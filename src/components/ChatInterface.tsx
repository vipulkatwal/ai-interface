import { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Avatar, Fade, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
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
  content: '👋 Hi there! I\'m your AI assistant. Type /help to see what I can do for you.',
  type: 'text',
  timestamp: new Date().toISOString()
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Theme colors based on mode
  const theme = {
    primary: darkMode ? '#60A5FA' : '#2563EB',
    background: darkMode ? '#111827' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    surface: darkMode ? '#1F2937' : '#FFFFFF',
    text: darkMode ? '#F3F4F6' : '#111827',
    textSecondary: darkMode ? '#9CA3AF' : '#6B7280',
    userBubble: darkMode
      ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
      : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    assistantBubble: darkMode
      ? 'linear-gradient(135deg, #374151 0%, #1F2937 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
    border: darkMode ? '#374151' : '#E5E7EB',
    shadow: darkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  };

  const userAvatar = (
    <Avatar
      sx={{
        bgcolor: theme.primary,
        width: 40,
        height: 40,
        fontWeight: 600,
        fontSize: '1rem',
        boxShadow: theme.shadow,
      }}
    >
      U
    </Avatar>
  );

  const assistantAvatar = (
    <Avatar
      sx={{
        bgcolor: darkMode ? '#374151' : '#F3F4F6',
        color: darkMode ? '#F3F4F6' : '#111827',
        width: 40,
        height: 40,
        boxShadow: theme.shadow,
      }}
    >
      🤖
    </Avatar>
  );

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    const savedTheme = localStorage.getItem('darkMode');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), Math.random() * 1000 + 500);
  };

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
    simulateTyping();

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

  const handleClearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem('chatMessages');
  };

  const TypingIndicator = () => (
    <Box sx={{ display: 'flex', gap: 1, px: 1 }}>
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </Box>
  );

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const alignment = isUser ? 'flex-end' : 'flex-start';
    const bubbleColor = isUser ? theme.userBubble : theme.assistantBubble;
    const textColor = isUser ? '#FFFFFF' : theme.text;
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
            px: { xs: 2, sm: 4 },
          }}
        >
          {!isUser && <Box sx={{ mr: 1.5 }}>{avatar}</Box>}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              maxWidth: { xs: '85%', sm: '70%' },
              background: bubbleColor,
              color: textColor,
              borderRadius,
              boxShadow: theme.shadow,
              fontSize: '1.08rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              minWidth: 120,
              position: 'relative',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: darkMode
                  ? '0 8px 16px -1px rgba(0, 0, 0, 0.5), 0 4px 8px -2px rgba(0, 0, 0, 0.4)'
                  : '0 8px 16px -1px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
              },
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
              <Typography
                variant="body1"
                sx={{
                  color: textColor,
                  lineHeight: 1.6,
                  letterSpacing: '0.01em',
                }}
              >
                {message.content}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                opacity: 0.7,
                color: textColor,
                textAlign: 'right',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Paper>
          {isUser && <Box sx={{ ml: 1.5 }}>{avatar}</Box>}
        </Box>
      </Fade>
    );
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme.background,
      fontFamily: 'Inter, system-ui, sans-serif',
      color: theme.text,
      transition: 'all 0.2s ease-in-out',
    }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: theme.shadow,
          zIndex: 10,
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {assistantAvatar}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            AI Assistant
            {isTyping && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '20px',
                  bgcolor: darkMode ? '#374151' : '#F3F4F6',
                  borderRadius: '10px',
                  px: 1.5,
                  py: 0.5,
                  ml: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.textSecondary,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  typing<TypingIndicator />
                </Typography>
              </Box>
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              color: theme.text,
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              },
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Button
            startIcon={<DeleteSweepIcon />}
            onClick={handleClearChat}
            variant="outlined"
            size="small"
            sx={{
              borderColor: theme.border,
              color: theme.text,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: theme.primary,
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            Clear Chat
          </Button>
        </Box>
      </Box>

      <ScrollToBottom className="flex-grow overflow-auto">
        <Box sx={{ py: { xs: 3, sm: 4 } }}>
          {messages.map(renderMessage)}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', px: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                {assistantAvatar}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: theme.surface,
                    borderRadius: '18px 18px 18px 4px',
                    boxShadow: theme.shadow,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} thickness={6} sx={{ color: theme.primary }} />
                    <Typography variant="body1" sx={{ color: theme.textSecondary }}>
                      Thinking...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
        </Box>
      </ScrollToBottom>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: theme.surface,
          borderTop: `1px solid ${theme.border}`,
          position: 'sticky',
          bottom: 0,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.shadow,
          zIndex: 10,
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', maxWidth: '1200px', mx: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message or use /help for commands..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            sx={{
              bgcolor: darkMode ? '#374151' : 'white',
              borderRadius: 3,
              boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.05)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.border,
                },
                '&:hover fieldset': {
                  borderColor: theme.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.primary,
                },
              },
              '& .MuiInputBase-input': {
                color: theme.text,
              },
            }}
            InputProps={{
              style: { padding: '14px 18px' },
            }}
          />
          <IconButton
            type="submit"
            disabled={isLoading || !input.trim()}
            sx={{
              width: 48,
              height: 48,
              bgcolor: theme.primary,
              color: '#FFFFFF',
              boxShadow: theme.shadow,
              '&:hover': {
                bgcolor: darkMode ? '#3B82F6' : '#1D4ED8',
              },
              '&.Mui-disabled': {
                bgcolor: darkMode ? '#374151' : '#E5E7EB',
                color: darkMode ? '#6B7280' : '#9CA3AF',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      <style>{`
        .typing-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: currentColor;
          animation: typing 1.4s infinite ease-in-out;
          margin: 0 1px;
        }

        .typing-dot:nth-child(1) { animation-delay: 200ms; }
        .typing-dot:nth-child(2) { animation-delay: 300ms; }
        .typing-dot:nth-child(3) { animation-delay: 400ms; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#4B5563' : '#CBD5E1'};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#6B7280' : '#94A3B8'};
        }
      `}</style>
    </Box>
  );
};

export default ChatInterface;