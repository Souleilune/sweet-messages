export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { password } = req.body;
    const ADMIN_PASSWORD = 'sweetadmin123';
    
    console.log('Received password:', password); // Debug log
    console.log('Expected password:', ADMIN_PASSWORD); // Debug log
    
    if (password === ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}