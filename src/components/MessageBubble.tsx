import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { Message } from '../types/chat';
import { calculatorPlugin } from '../plugins/CalculatorPlugin';
import { weatherPlugin } from '../plugins/WeatherPlugin';
import { dictionaryPlugin } from '../plugins/DictionaryPlugin';

interface MessageBubbleProps {
  message: Message;
}

const plugins = {
  calculator: calculatorPlugin,
  weather: weatherPlugin,
  dictionary: dictionaryPlugin
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isPlugin = message.type === 'plugin';

  const renderContent = () => {
    if (isPlugin && message.pluginName && message.pluginData) {
      const plugin = plugins[message.pluginName as keyof typeof plugins];
      if (plugin) {
        return plugin.renderResponse(message.pluginData);
      }
    }

    return (
      <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
        {message.content}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        maxWidth: '100%'
      }}
    >
      <Box
        sx={{
          maxWidth: isPlugin ? '80%' : '70%',
          width: isPlugin ? 'fit-content' : 'auto'
        }}
      >
        {isPlugin ? (
          renderContent()
        ) : (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: isUser ? 'primary.main' : 'background.paper',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              borderRadius: 2
            }}
          >
            {renderContent()}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;