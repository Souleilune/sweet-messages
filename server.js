// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Initialize messages file if it doesn't exist
async function initializeMessagesFile() {
    try {
        await fs.access(MESSAGES_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(MESSAGES_FILE, JSON.stringify([]));
        console.log('Created messages.json file');
    }
}

// Read messages from file
async function readMessages() {
    try {
        const data = await fs.readFile(MESSAGES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading messages:', error);
        return [];
    }
}

// Write messages to file
async function writeMessages(messages) {
    try {
        await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing messages:', error);
        return false;
    }
}

// Routes

// Get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await readMessages();
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
});

// Add new message
app.post('/api/messages', async (req, res) => {
    try {
        const { sender, message } = req.body;
        
        if (!sender || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Sender and message are required' 
            });
        }

        const messages = await readMessages();
        const newMessage = {
            id: Date.now(),
            sender: sender.trim(),
            message: message.trim(),
            timestamp: new Date().toLocaleString()
        };

        messages.push(newMessage);
        const saved = await writeMessages(messages);

        if (saved) {
            res.json({ success: true, message: newMessage });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save message' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const messages = await readMessages();
        
        const filteredMessages = messages.filter(msg => msg.id !== messageId);
        
        if (filteredMessages.length === messages.length) {
            return res.status(404).json({ 
                success: false, 
                error: 'Message not found' 
            });
        }

        const saved = await writeMessages(filteredMessages);

        if (saved) {
            res.json({ success: true, message: 'Message deleted successfully' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to delete message' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Admin authentication
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = 'sweetadmin123'; // In production, use environment variables
    
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid password' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
async function startServer() {
    await initializeMessagesFile();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📱 Message board available at http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);