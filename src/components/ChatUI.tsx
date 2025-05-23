import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChat } from '../context/ChatContext';
import { MessageCircle, Trash2 } from 'lucide-react';

const ChatUI: React.FC = () => {
  const { messages, processUserMessage, isLoading, clearMessages } = useChat();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <MessageCircle className="text-blue-600 mr-2" size={24} />
          <h1 className="text-xl font-semibold">AI Assistant</h1>
        </div>
        
        <button
          onClick={clearMessages}
          className="text-gray-500 hover:text-red-500 flex items-center text-sm transition-colors"
        >
          <Trash2 size={16} className="mr-1" />
          Clear Chat
        </button>
      </header>
      
      {/* Chat content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput onSendMessage={processUserMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatUI;