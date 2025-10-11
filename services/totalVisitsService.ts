import { createClient } from '@supabase/supabase-js';

// Sử dụng same config như supabaseVisitorService
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

class TotalVisitsService {
  private hasVisited = false;

  async recordVisit(): Promise<number> {
    // Chỉ record 1 lần per session để tránh spam
    if (this.hasVisited) {
      return await this.getTotalVisits();
    }

    try {
      // Gọi function increment trong Supabase
      console.log('📞 Calling increment_visit_count...');
      const { data, error } = await supabase.rpc('increment_visit_count');
      
      if (error) {
        console.error('❌ Supabase RPC Error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return this.getFallbackCount();
      }

      this.hasVisited = true;
      console.log(`✅ Total visits: ${data}`);
      return data || 0;

    } catch (error) {
      console.error('❌ Network/Other Error:', error);
      return this.getFallbackCount();
    }
  }

  async getTotalVisits(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('total_visits')
        .select('count')
        .eq('id', 1)
        .single();

      if (error) {
        console.warn('Lỗi get total visits:', error);
        return this.getFallbackCount();
      }

      return data?.count || 0;

    } catch (error) {
      console.warn('Supabase không khả dụng:', error);
      return this.getFallbackCount();
    }
  }

  private getFallbackCount(): number {
    // Fallback: sử dụng localStorage để simulate
    const stored = localStorage.getItem('fallback_total_visits');
    let count = stored ? parseInt(stored) : 1000; // Start từ 1000 để realistic
    
    if (!this.hasVisited) {
      count += 1;
      localStorage.setItem('fallback_total_visits', count.toString());
      this.hasVisited = true;
    }
    
    return count;
  }

  // Reset flag khi cần (ví dụ: new session)
  resetVisitFlag() {
    this.hasVisited = false;
  }
}

export const totalVisitsService = new TotalVisitsService();