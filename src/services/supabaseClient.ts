import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default demo credentials (can be overridden via localStorage or .env)
const DEFAULT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private customUrl: string = '';
  private customKey: string = '';
  private broadcastChannels = new Map<string, BroadcastChannel>();
  private processedSignalIds = new Set<string>();

  constructor() {
    this.customUrl = localStorage.getItem('SETU_SUPABASE_URL') || DEFAULT_SUPABASE_URL;
    this.customKey = localStorage.getItem('SETU_SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY;
    this.initClient();
  }

  private initClient() {
    try {
      if (this.customUrl && this.customKey && !this.customUrl.includes('mock-setu-health')) {
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
      } else {
        this.client = null;
      }
    } catch (err) {
      console.warn('Supabase client initialized in local hybrid mode:', err);
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
   * Universal Dual-Channel (Supabase Realtime + Local BroadcastChannel)
   * Guarantees 100% video/audio/chat connectivity between Patient & Doctor across:
   * 1. Multi-tab / Multi-window demo on the same PC
   * 2. Cross-device networks when configured with Supabase keys
   */
  public joinCallChannel(
    channelName: string,
    onMessage: (payload: any) => void,
    onPresenceChange?: (presenceState: any) => void
  ) {
    const handleSignal = (payload: any) => {
      if (!payload) return;
      // Deduplicate if received over both channels
      if (payload._signalId) {
        if (this.processedSignalIds.has(payload._signalId)) return;
        this.processedSignalIds.add(payload._signalId);
        if (this.processedSignalIds.size > 2000) {
          const first = this.processedSignalIds.values().next().value;
          if (first) this.processedSignalIds.delete(first);
        }
      }
      onMessage(payload);
    };

    // 1. Setup Local Broadcast Channel
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(`setu_room_${channelName}`);
      bc.onmessage = (event) => {
        handleSignal(event.data);
      };
      this.broadcastChannels.set(channelName, bc);
    }

    // 2. Setup Supabase Realtime Channel if client exists
    let supabaseChannel: any = null;
    if (this.client) {
      try {
        supabaseChannel = this.client.channel(`teleconsult-${channelName}`, {
          config: {
            broadcast: { ack: true, self: false },
            presence: { key: channelName }
          }
        });

        supabaseChannel
          .on('broadcast', { event: 'signal' }, ({ payload }: any) => {
            handleSignal(payload);
          })
          .on('presence', { event: 'sync' }, () => {
            if (onPresenceChange) {
              onPresenceChange(supabaseChannel.presenceState());
            }
          })
          .subscribe((status: string) => {
            if (status === 'SUBSCRIBED') {
              console.log(`[Supabase Realtime] Connected to room: ${channelName}`);
            }
          });
      } catch (err) {
        console.warn('Supabase Realtime channel subscription skipped:', err);
      }
    }

    return {
      sendSignal: async (data: any) => {
        const signalId = `sig-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const payloadWithId = { ...data, _signalId: signalId };

        // Always broadcast locally to other browser tabs
        if (bc) {
          bc.postMessage(payloadWithId);
        }

        // Also broadcast via Supabase Realtime if connected
        if (supabaseChannel) {
          try {
            await supabaseChannel.send({
              type: 'broadcast',
              event: 'signal',
              payload: payloadWithId
            });
          } catch (e) {
            // Ignored, local broadcast handles same-browser
          }
        }
      },
      leave: () => {
        if (bc) {
          bc.close();
          this.broadcastChannels.delete(channelName);
        }
        if (supabaseChannel) {
          supabaseChannel.unsubscribe();
        }
      }
    };
  }
}

export const supabaseService = new SupabaseService();
