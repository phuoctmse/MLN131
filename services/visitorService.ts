import { apiVisitorService } from './apiVisitorService';
import { supabaseVisitorService } from './supabaseVisitorService';

// Thử Supabase trước, fallback về API nếu fail
class VisitorServiceManager {
  private activeService: any = null;
  
  async initialize() {
    console.log('🚀 VisitorServiceManager: Starting initialization...');
    
    // Thử Supabase trước (nếu có setup)  
    if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co') {
      console.log('Trying Supabase visitor service...');
      try {
        await supabaseVisitorService.initialize();
        this.activeService = supabaseVisitorService;
        console.log('✅ Supabase visitor service active');
        return;
      } catch (error) {
        console.warn('❌ Supabase failed, falling back to API service:', error);
      }
    }
    
    // Fallback to API service
    console.log('Using API visitor service...');
    await apiVisitorService.initialize();
    this.activeService = apiVisitorService;
    console.log('✅ API visitor service active');
  }

  subscribe(callback: (count: number) => void) {
    console.log('📡 VisitorServiceManager: Subscribe called');
    
    if (!this.activeService) {
      console.log('⚡ Auto-initializing service...');
      
      // Call callback immediately with fallback count
      const fallbackCount = this.getFallbackCount();
      console.log(`🎯 Providing immediate fallback count: ${fallbackCount}`);
      callback(fallbackCount);
      
      // Auto-initialize if not done
      this.initialize().then(() => {
        if (this.activeService) {
          console.log('🔗 Setting up subscription after auto-init');
          this.activeService.subscribe(callback);
        }
      });
      return () => {};
    }
    
    console.log('🔗 Setting up subscription with active service');
    return this.activeService.subscribe(callback);
  }

  private getFallbackCount(): number {
    const hour = new Date().getHours();
    // Giờ cao điểm có base count cao hơn
    if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 17) || (hour >= 19 && hour <= 22)) {
      return Math.floor(Math.random() * 8) + 5; // 5-12
    } else if (hour >= 6 && hour <= 23) {
      return Math.floor(Math.random() * 5) + 2; // 2-6
    } else {
      return Math.floor(Math.random() * 3) + 1; // 1-3 (đêm khuya)
    }
  }

  disconnect() {
    if (this.activeService) {
      this.activeService.disconnect();
    }
  }

  getCurrentCount() {
    return this.activeService ? this.activeService.getCurrentCount() : 1;
  }
}

export const visitorService = new VisitorServiceManager();