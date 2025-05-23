import { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography } from '@mui/material';
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
    const bgcolor = isUser ? 'primary.main' : 'grey.100';
    const color = isUser ? 'white' : 'text.primary';

    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: alignment,
          mb: 2,
          px: 2
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '70%',
            bgcolor,
            color,
            borderRadius: 2
          }}
        >
          {message.type === 'plugin' && message.pluginName ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {message.content}
              </Typography>
              {pluginManager.plugins
                .find(p => p.name === message.pluginName)
                ?.render(message.pluginData)}
            </Box>
          ) : (
            <Typography variant="body1">
              {message.content}
            </Typography>
          )}
          <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToBottom className="flex-grow overflow-auto">
        <Box sx={{ py: 2 }}>
          {messages.map(renderMessage)}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, mb: 2 }}>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.100' }}>
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
          p: 2,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message or use /help for commands..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={isLoading || !input.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;