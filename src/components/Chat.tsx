import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ScrollToBottom from 'react-scroll-to-bottom';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from '../types/chat';
import { pluginManager } from '../services/PluginManager';
import { calculatorPlugin } from '../plugins/CalculatorPlugin';
import { weatherPlugin } from '../plugins/WeatherPlugin';
import { dictionaryPlugin } from '../plugins/DictionaryPlugin';
import MessageBubble from './MessageBubble';

// Register plugins
pluginManager.register(calculatorPlugin);
pluginManager.register(weatherPlugin);
pluginManager.register(dictionaryPlugin);

const HELP_MESSAGE = 'I can help you with weather, calculations, and definitions. Try using:\n' +
  '• /weather [city] - Get current weather for a city\n' +
  '• /calc [expression] - Calculate mathematical expressions\n' +
  '• /define [word] - Look up word definitions';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleHelp = () => {
    const helpMessage: Message = {
      id: uuidv4(),
      sender: 'assistant',
      content: HELP_MESSAGE,
      type: 'text',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, helpMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      content: input.trim(),
      type: 'text',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const trimmedInput = input.trim();

      // Handle help command
      if (trimmedInput.toLowerCase() === '/help') {
        handleHelp();
        return;
      }

      // Check for plugin commands
      const pluginMatch = pluginManager.findMatchingPlugin(trimmedInput);

      if (pluginMatch) {
        const { plugin, match } = pluginMatch;
        const pluginInput = match[1].trim(); // Get the captured group (command argument)

        if (!pluginInput) {
          throw new Error(`Please provide an input for the ${plugin.command} command.`);
        }

        const result = await pluginManager.executePlugin(plugin, pluginInput);
        const response: Message = {
          id: uuidv4(),
          sender: 'assistant',
          content: pluginInput,
          type: 'plugin',
          pluginName: plugin.name,
          pluginData: result,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, response]);
      } else {
        // Handle natural language processing here
        handleHelp();
      }
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred',
        type: 'text',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 2 }}>
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <ScrollToBottom>
            <Box sx={{ p: 2 }}>
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </Box>
          </ScrollToBottom>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message or command (e.g., /weather london)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
              inputRef={inputRef}
              size="small"
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!input.trim() || isProcessing}
              sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat;