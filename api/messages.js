import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Database error' 
        });
      }

      return res.status(200).json({ 
        success: true, 
        messages: messages || [] 
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

      // Insert new message
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender: String(sender).trim(),
            message: String(message).trim(),
            timestamp: new Date().toLocaleString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Database error' 
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: data 
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