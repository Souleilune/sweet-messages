export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Parse request body if it's a string
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { password } = body;

    // Validate password exists
    if (!password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password is required' 
      });
    }

    // Check password
    const ADMIN_PASSWORD = 'sweetadmin123';
    
    if (password === ADMIN_PASSWORD) {
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful' 
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid password' 
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
}