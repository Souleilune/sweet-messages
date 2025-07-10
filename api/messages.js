let messages = [];

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, messages });
  }

  if (req.method === 'POST') {
    const { sender, message } = req.body;
    
    if (!sender || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Sender and message are required' 
      });
    }

    const newMessage = {
      id: Date.now(),
      sender: sender.trim(),
      message: message.trim(),
      timestamp: new Date().toLocaleString()
    };

    messages.push(newMessage);
    return res.status(200).json({ success: true, message: newMessage });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}