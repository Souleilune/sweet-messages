export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow DELETE method
  if (req.method !== 'DELETE') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Get message ID from URL parameter
    const { id } = req.query;
    const messageId = parseInt(id);

    // Validate ID
    if (isNaN(messageId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid message ID' 
      });
    }

    // Get current messages
    const messages = global.messages || [];
    const initialLength = messages.length;

    // Filter out the message to delete
    const filteredMessages = messages.filter(msg => msg.id !== messageId);
    
    // Check if message was found and deleted
    if (filteredMessages.length === initialLength) {
      return res.status(404).json({ 
        success: false, 
        error: 'Message not found' 
      });
    }

    // Update global messages
    global.messages = filteredMessages;

    return res.status(200).json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });

  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
}