import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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

    // Delete the message
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error' 
      });
    }

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