let messages = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const messageId = parseInt(id);
    
    const initialLength = messages.length;
    messages = messages.filter(msg => msg.id !== messageId);
    
    if (messages.length === initialLength) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}