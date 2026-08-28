import { OfflineMutation } from '../types';

const QUEUE_STORAGE_KEY = 'setu_offline_mutation_queue';

class OfflineSyncManager {
  private queue: OfflineMutation[] = [];
  private listeners: ((queue: OfflineMutation[]) => void)[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.loadQueue();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.triggerSync();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notifyListeners();
      });
    }
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (e) {
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save offline queue', e);
    }
  }

  public getQueue(): OfflineMutation[] {
    return [...this.queue];
  }

  public getPendingCount(): number {
    return this.queue.filter(m => m.status === 'QUEUED' || m.status === 'SYNCING').length;
  }

  public isNetworkOnline(): boolean {
    return this.isOnline;
  }

  public setSimulatedOnline(online: boolean) {
    this.isOnline = online;
    if (online) {
      this.triggerSync();
    } else {
      this.notifyListeners();
    }
  }

  public enqueueMutation(type: OfflineMutation['type'], payload: any): OfflineMutation {
    const mutation: OfflineMutation = {
      id: `mut-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      status: this.isOnline ? 'SYNCING' : 'QUEUED',
      retryCount: 0,
    };

    this.queue.unshift(mutation);
    this.saveQueue();

    if (this.isOnline) {
      setTimeout(() => {
        this.processSingleMutation(mutation.id);
      }, 1000);
    }

    return mutation;
  }

  public triggerSync() {
    if (!this.isOnline) return;

    const queued = this.queue.filter(m => m.status === 'QUEUED' || m.status === 'FAILED');
    if (queued.length === 0) return;

    queued.forEach(item => {
      item.status = 'SYNCING';
    });
    this.saveQueue();

    setTimeout(() => {
      this.queue.forEach(item => {
        if (item.status === 'SYNCING') {
          item.status = 'SYNCED';
        }
      });
      this.saveQueue();
    }, 1800);
  }

  private processSingleMutation(id: string) {
    const item = this.queue.find(m => m.id === id);
    if (item) {
      item.status = 'SYNCED';
      this.saveQueue();
    }
  }

  public clearSynced() {
    this.queue = this.queue.filter(m => m.status !== 'SYNCED');
    this.saveQueue();
  }

  public subscribe(callback: (queue: OfflineMutation[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getQueue());
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.getQueue()));
  }
}

export const offlineSyncManager = new OfflineSyncManager();
