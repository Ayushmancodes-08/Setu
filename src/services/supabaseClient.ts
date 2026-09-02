import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default demo credentials (can be overridden via localStorage or .env)
const DEFAULT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mock-setu-health.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock-setu-key';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private customUrl: string = '';
  private customKey: string = '';

  constructor() {
    this.customUrl = localStorage.getItem('SETU_SUPABASE_URL') || DEFAULT_SUPABASE_URL;
    this.customKey = localStorage.getItem('SETU_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY;
    this.initClient();
  }

  private initClient() {
    try {
      if (this.customUrl && this.customKey) {
        this.client = createClient(this.customUrl, this.customKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          },
          realtime: {
            params: {
              eventsPerSecond: 20
            }
          }
        });
      }
    } catch (err) {
      console.warn('Supabase client initialized in offline/mock mode:', err);
      this.client = null;
    }
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public isConfigured(): boolean {
    return !!(this.customUrl && this.customKey && !this.customUrl.includes('mock-setu-health'));
  }

  public getCredentials() {
    return {
      url: this.customUrl,
      key: this.customKey ? `${this.customKey.slice(0, 8)}...` : ''
    };
  }

  public setCredentials(url: string, key: string) {
    this.customUrl = url.trim();
    this.customKey = key.trim();
    localStorage.setItem('SETU_SUPABASE_URL', this.customUrl);
    localStorage.setItem('SETU_SUPABASE_ANON_KEY', this.customKey);
    this.initClient();
  }

  /**
   * Subscribe to a Realtime Channel for WebRTC Video Signaling & In-Call Messages
   */
  public joinCallChannel(
    channelName: string,
    onMessage: (payload: any) => void,
    onPresenceChange?: (presenceState: any) => void
  ) {
    if (!this.client) {
      // Fallback to native BroadcastChannel for local/stage multi-tab demo
      return this.joinLocalBroadcast(channelName, onMessage);
    }

    const channel = this.client.channel(`teleconsult-${channelName}`, {
      config: {
        broadcast: { ack: true, self: false },
        presence: { key: channelName }
      }
    });

    channel
      .on('broadcast', { event: 'signal' }, ({ payload }) => {
        onMessage(payload);
      })
      .on('presence', { event: 'sync' }, () => {
        if (onPresenceChange) {
          onPresenceChange(channel.presenceState());
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Supabase Realtime] Connected to room: ${channelName}`);
        }
      });

    return {
      sendSignal: async (data: any) => {
        try {
          await channel.send({
            type: 'broadcast',
            event: 'signal',
            payload: data
          });
        } catch (e) {
          // fallback to local broadcast
          this.sendLocalBroadcast(channelName, data);
        }
      },
      leave: () => {
        channel.unsubscribe();
      }
    };
  }

  /**
   * High-Reliability Local Broadcast Channel for seamless Stage presentations & zero-latency demo
   */
  private broadcastChannels = new Map<string, BroadcastChannel>();

  private joinLocalBroadcast(channelName: string, onMessage: (payload: any) => void) {
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(`setu_room_${channelName}`);
      bc.onmessage = (event) => {
        onMessage(event.data);
      };
      this.broadcastChannels.set(channelName, bc);
    }

    return {
      sendSignal: async (data: any) => {
        this.sendLocalBroadcast(channelName, data);
      },
      leave: () => {
        if (bc) {
          bc.close();
          this.broadcastChannels.delete(channelName);
        }
      }
    };
  }

  private sendLocalBroadcast(channelName: string, data: any) {
    let bc = this.broadcastChannels.get(channelName);
    if (!bc && typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(`setu_room_${channelName}`);
      this.broadcastChannels.set(channelName, bc);
    }
    if (bc) {
      bc.postMessage(data);
    }
  }
}

export const supabaseService = new SupabaseService();
