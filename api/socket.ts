import type { VercelRequest, VercelResponse } from '@vercel/node';

// Lưu trữ visitor count trong memory (sẽ reset khi function restart)
let visitorSessions = new Map<string, number>();
let currentCount = 0;

// Thêm base count để tránh hiển thị 0 khi deploy mới
const getBaseCount = () => {
  const hour = new Date().getHours();
  // Giờ cao điểm có base count cao hơn
  if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 17) || (hour >= 19 && hour <= 22)) {
    return Math.floor(Math.random() * 8) + 5; // 5-12
  } else if (hour >= 6 && hour <= 23) {
    return Math.floor(Math.random() * 5) + 2; // 2-6
  } else {
    return Math.floor(Math.random() * 3) + 1; // 1-3 (đêm khuya)
  }
};

const VisitorAPI = (req: VercelRequest, res: VercelResponse) => {
  // Thiết lập CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Cleanup old sessions trước khi trả về count
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [id, timestamp] of visitorSessions.entries()) {
      if (timestamp < fiveMinutesAgo) {
        visitorSessions.delete(id);
      }
    }
    
    const activeCount = visitorSessions.size;
    const finalCount = activeCount > 0 ? activeCount + getBaseCount() : getBaseCount();
    
    res.status(200).json({ 
      count: finalCount,
      active_sessions: activeCount,
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === 'POST') {
    try {
      const { action, sessionId } = req.body;
      const clientIP = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
      const uniqueId = sessionId || `${clientIP}-${Date.now()}`;

      if (action === 'join') {
        // Thêm visitor mới
        visitorSessions.set(uniqueId, Date.now());
        currentCount = visitorSessions.size;
        
        // Cleanup old sessions (older than 5 minutes - nghiêm ngặt hơn)
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        for (const [id, timestamp] of visitorSessions.entries()) {
          if (timestamp < fiveMinutesAgo) {
            visitorSessions.delete(id);
          }
        }
        
        const activeCount = visitorSessions.size;
        currentCount = activeCount + getBaseCount();

      } else if (action === 'leave') {
        // Remove visitor
        visitorSessions.delete(uniqueId);
        const activeCount = visitorSessions.size;
        currentCount = activeCount + getBaseCount();
      } else if (action === 'heartbeat') {
        // Update timestamp for existing session
        if (visitorSessions.has(uniqueId)) {
          visitorSessions.set(uniqueId, Date.now());
        }
        const activeCount = visitorSessions.size;
        currentCount = activeCount + getBaseCount();
      }

      // Always ensure realistic count
      const responseCount = Math.max(getBaseCount(), currentCount);
      res.status(200).json({ count: responseCount, sessionId: uniqueId });

    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ error: 'Internal server error', count: 1 });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};

export default VisitorAPI;