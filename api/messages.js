export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Simple in-memory storage (resets on each deployment)
  // For production, use a database like Supabase or PlanetScale
  const messages = global.messages || [];

  try {
    if (req.method === 'GET') {
      return res.status(200).json({ 
        success: true, 
        messages: messages 
      });
    }

    if (req.method === 'POST') {
      // Parse request body if it's a string
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      const { sender, message } = body;

      // Validate required fields
      if (!sender || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Sender and message are required' 
        });
      }

      // Create new message
      const newMessage = {
        id: Date.now(),
        sender: String(sender).trim(),
        message: String(message).trim(),
        timestamp: new Date().toLocaleString()
      };

      // Add to messages array
      messages.push(newMessage);
      global.messages = messages;

      return res.status(200).json({ 
        success: true, 
        message: newMessage 
      });
    }

    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });

  } catch (error) {
    console.error('Messages error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
}
