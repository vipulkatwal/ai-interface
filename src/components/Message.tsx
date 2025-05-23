import React from 'react';
import { Message as MessageType } from '../types';
import { usePlugins } from '../hooks/usePlugins';
import { formatDistanceToNow } from 'date-fns';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { plugins } = usePlugins();
  const isUser = message.sender === 'user';

  // Find the plugin to render the result if this is a plugin message
  const plugin = message.pluginName
    ? plugins.find(p => p.name.toLowerCase() === message.pluginName?.toLowerCase())
    : null;

  const timeAgo = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
    >
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-blue-600 text-white rounded-t-lg rounded-bl-lg'
            : 'bg-gray-100 text-gray-800 rounded-t-lg rounded-br-lg'
        } p-3 shadow-sm`}
      >
        {message.type === 'plugin' && plugin && message.pluginData ? (
          <div className="plugin-result">
            {plugin.renderResult(message.pluginData)}
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}

        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
          {timeAgo}
        </div>
      </div>
    </div>
  );
};

export default Message;