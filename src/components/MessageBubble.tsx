import React from 'react';
import { Message } from '../types';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timestamp = format(new Date(message.timestamp), 'HH:mm');

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-4 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {message.type === 'plugin' ? (
          <div className="space-y-2">
            <div className="text-sm opacity-75">
              Plugin: {message.pluginName}
            </div>
            {message.pluginData}
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};