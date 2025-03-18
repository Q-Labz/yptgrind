import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Fab,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Send, Chat, Close } from '@mui/icons-material';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setChat(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setChat(prev => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setChat(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again later.', sender: 'bot' }]);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setIsOpen(!isOpen)}
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        {isOpen ? <Close /> : <Chat />}
      </Fab>

      <Collapse in={isOpen}>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 300,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chat Assistant
          </Typography>

          <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            {chat.map((msg, index) => (
              <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Paper
                  sx={{
                    p: 1,
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.200',
                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                    maxWidth: '80%',
                  }}
                >
                  <ListItemText primary={msg.text} />
                </Paper>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem>
                <Paper sx={{ p: 1, bgcolor: 'grey.200' }}>
                  <ListItemText primary="Typing..." />
                </Paper>
              </ListItem>
            )}
          </List>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}>
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatBot;
