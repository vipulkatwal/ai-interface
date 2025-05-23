import { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Avatar, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import type { Message } from '../types';
import { pluginManager } from '../services/PluginManager';
import CalculatorPlugin from '../plugins/CalculatorPlugin';
import WeatherPlugin from '../plugins/WeatherPlugin';
import DictionaryPlugin from '../plugins/DictionaryPlugin';
import HelpPlugin from '../plugins/HelpPlugin';

// Register plugins
pluginManager.registerPlugin(CalculatorPlugin);
pluginManager.registerPlugin(WeatherPlugin);
pluginManager.registerPlugin(DictionaryPlugin);
pluginManager.registerPlugin(HelpPlugin);

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  sender: 'assistant',
  content: 'Welcome to the AI Chat Interface! Type /help to see available commands.',
  type: 'text',
  timestamp: new Date().toISOString()
};

const userAvatar = <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>U</Avatar>;
const assistantAvatar = <Avatar sx={{ bgcolor: 'grey.800', color: 'white', width: 40, height: 40 }}>🤖</Avatar>;

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      content: input,
      type: 'text',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await pluginManager.parseMessage(input);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred',
        type: 'text',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const alignment = isUser ? 'flex-end' : 'flex-start';
    const bubbleColor = isUser ? 'linear-gradient(135deg, #1976d2 60%, #42a5f5 100%)' : 'rgba(255,255,255,0.85)';
    const textColor = isUser ? 'white' : 'grey.900';
    const avatar = isUser ? userAvatar : assistantAvatar;
    const borderRadius = isUser
      ? '18px 18px 4px 18px'
      : '18px 18px 18px 4px';

    return (
      <Fade in timeout={400} key={message.id}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: alignment,
            mb: 2,
            px: { xs: 1, sm: 3 },
          }}
        >
          {!isUser && <Box sx={{ mr: 1 }}>{avatar}</Box>}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              maxWidth: { xs: '90%', sm: '70%' },
              background: bubbleColor,
              color: textColor,
              borderRadius,
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
              fontSize: '1.08rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              minWidth: 120,
              position: 'relative',
            }}
          >
            {message.type === 'plugin' && message.pluginName ? (
              <Box>
                <Typography variant="body1" sx={{ mb: 1, color: textColor }}>
                  {message.content}
                </Typography>
                {pluginManager.plugins
                  .find(p => p.name === message.pluginName)
                  ?.render(message.pluginData)}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: textColor }}>
                {message.content}
              </Typography>
            )}
            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7, color: textColor, textAlign: 'right' }}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
          </Paper>
          {isUser && <Box sx={{ ml: 1 }}>{avatar}</Box>}
        </Box>
      </Fade>
    );
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <ScrollToBottom className="flex-grow overflow-auto">
        <Box sx={{ py: { xs: 1, sm: 3 } }}>
          {messages.map(renderMessage)}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, mb: 2 }}>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.85)' }}>
                <Typography variant="body1">Thinking...</Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </ScrollToBottom>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 1, sm: 2 },
          bgcolor: 'rgba(255,255,255,0.7)',
          borderTop: 1,
          borderColor: 'divider',
          position: 'sticky',
          bottom: 0,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.04)',
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message or use /help for commands..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)',
              fontSize: '1.1rem',
            }}
            InputProps={{
              style: { padding: '12px 16px' },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={isLoading || !input.trim()}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              width: 48,
              height: 48,
              boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.12)',
              '&:hover': { bgcolor: 'primary.dark' },
              transition: 'all 0.2s',
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;