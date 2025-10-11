import { createClient } from '@supabase/supabase-js';

// Supabase config - Bạn sẽ thay thế bằng URL và key thật sau khi tạo project
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types cho visitor tracking
export interface VisitorSession {
  id: string;
  user_agent: string;
  ip_address?: string;
  joined_at: string;
  last_seen: string;
  is_active: boolean;
}

export interface VisitorCount {
  id: number;
  count: number;
  updated_at: string;
}

class SupabaseVisitorService {
  private listeners: Set<(count: number) => void> = new Set();
  private currentCount = 0;
  private sessionId: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private subscription: any = null;

  async initialize() {
    this.sessionId = this.generateSessionId();
    
    try {
      // Thêm session mới
      await this.joinSession();
      
      // Subscribe to real-time updates
      this.subscribeToVisitorUpdates();
      
      // Heartbeat để maintain session
      this.startHeartbeat();
      
      // Cleanup khi user rời trang
      if (typeof window !== 'undefined') {
        // Multiple event listeners để catch tất cả trường hợp
        const cleanup = () => {
          this.leaveSession();
        };

        window.addEventListener('beforeunload', cleanup);
        window.addEventListener('unload', cleanup);
        window.addEventListener('pagehide', cleanup);

        // Visibility change để handle khi user switch tab/minimize
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            this.pauseSession();
          } else {
            this.resumeSession();
          }
        });

        // Focus/blur events để track active state
        window.addEventListener('blur', () => {
          this.pauseSession();
        });

        window.addEventListener('focus', () => {
          this.resumeSession();
        });
      }
    } catch (error) {
      console.warn('Supabase không khả dụng, sử dụng fallback:', error);
      this.useFallbackTracking();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async joinSession() {
    if (!this.sessionId) return;

    const sessionData: Partial<VisitorSession> = {
      id: this.sessionId,
      user_agent: navigator.userAgent,
      joined_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      is_active: true
    };

    const { error } = await supabase
      .from('visitor_sessions')
      .insert(sessionData);

    if (error) {
      console.warn('Lỗi tạo session:', error);
      throw error;
    }

    await this.updateVisitorCount();
  }

  private async leaveSession() {
    if (!this.sessionId) return;

    await supabase
      .from('visitor_sessions')
      .delete()
      .eq('id', this.sessionId);

    await this.updateVisitorCount();
  }

  private async pauseSession() {
    if (!this.sessionId) return;

    await supabase
      .from('visitor_sessions')
      .update({ is_active: false })
      .eq('id', this.sessionId);

    await this.updateVisitorCount();
  }

  private async resumeSession() {
    if (!this.sessionId) return;

    await supabase
      .from('visitor_sessions')
      .update({ 
        is_active: true,
        last_seen: new Date().toISOString()
      })
      .eq('id', this.sessionId);

    await this.updateVisitorCount();
  }

  private async updateVisitorCount() {
    // Cleanup old sessions (>2 minutes để sensitive hơn)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    
    await supabase
      .from('visitor_sessions')
      .delete()
      .lt('last_seen', twoMinutesAgo);

    // Count active sessions
    const { count } = await supabase
      .from('visitor_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const visitorCount = Math.max(1, count || 0);

    // Update global count
    await supabase
      .from('visitor_count')
      .upsert({
        id: 1,
        count: visitorCount,
        updated_at: new Date().toISOString()
      });

    this.currentCount = visitorCount;
    this.notifyListeners(visitorCount);
  }

  private subscribeToVisitorUpdates() {
    this.subscription = supabase
      .channel('visitor_count_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'visitor_count' 
        }, 
        (payload) => {
          const newData = payload.new as any;
          if (newData && typeof newData.count === 'number') {
            this.currentCount = newData.count;
            this.notifyListeners(this.currentCount);
          }
        }
      )
      .subscribe();
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(async () => {
      if (this.sessionId) {
        // Update last_seen để maintain session
        await supabase
          .from('visitor_sessions')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', this.sessionId);
        
        // Trigger update count để cleanup old sessions
        await this.updateVisitorCount();
      }
    }, 15000); // Heartbeat mỗi 15 giây (thay vì 30 giây)
  }

  private useFallbackTracking() {
    // Fallback giống như trước
    const baseCount = Math.floor(Math.random() * 8) + 2; // 2-9 người
    this.currentCount = baseCount;
    this.notifyListeners(baseCount);

    setInterval(() => {
      const variation = Math.floor(Math.random() * 3) - 1;
      this.currentCount = Math.max(1, this.currentCount + variation);
      this.notifyListeners(this.currentCount);
    }, 45000);
  }

  subscribe(callback: (count: number) => void) {
    this.listeners.add(callback);
    
    if (this.currentCount > 0) {
      callback(this.currentCount);
    }

    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(count: number) {
    this.listeners.forEach(callback => callback(count));
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.subscription) {
      supabase.removeChannel(this.subscription);
    }

    this.leaveSession();
    this.listeners.clear();
  }

  getCurrentCount() {
    return this.currentCount;
  }
}

export const supabaseVisitorService = new SupabaseVisitorService();