import React from 'react';
import { Message } from '../types';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timestamp = format(new Date(message.timestamp), 'HH:mm');

  // Modern bubble styles
  const bubbleBase =
    'max-w-[80%] px-4 py-3 rounded-2xl shadow-md mb-2 flex flex-col gap-1 animate-chatfade';
  const userBubble =
    'bg-gradient-to-br from-blue-500 to-blue-400 text-white self-end rounded-br-md';
  const botBubble =
    'bg-white/80 backdrop-blur border border-blue-100 text-blue-900 self-start rounded-bl-md';
  const pluginBubble =
    'bg-white/60 backdrop-blur-md border border-blue-100 shadow-xl p-0';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={
          message.type === 'plugin'
            ? `${bubbleBase} ${pluginBubble}`
            : `${bubbleBase} ${isUser ? userBubble : botBubble}`
        }
        style={{ minWidth: 0 }}
      >
        {message.type === 'plugin' ? (
          <div className="p-2">
            <div className="text-xs text-blue-400 font-semibold mb-1">Plugin: {message.pluginName}</div>
            {React.isValidElement(message.pluginData) ? message.pluginData : null}
          </div>
        ) : (
          <div className="whitespace-pre-wrap break-words text-base">{message.content}</div>
        )}
        <div
          className={`text-[11px] mt-1 ${
            isUser ? 'text-blue-100 text-right' : 'text-blue-400 text-left'
          }`}
        >
          {timestamp}
        </div>
      </div>
      <style>{`
        @keyframes chatfade {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};