import React, { useState, useRef, useEffect } from 'react';
import { Send, Command, X } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Command suggestions
  const commands = [
    { command: '/weather', description: 'Get weather for a location', example: '/weather New York' },
    { command: '/calc', description: 'Calculate an expression', example: '/calc 5 * 10 + 2' },
    { command: '/define', description: 'Look up a word definition', example: '/define happiness' },
  ];

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      setShowCommands(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without shift for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    // Toggle command menu on /
    if (e.key === '/' && message === '') {
      setShowCommands(true);
    }
    
    // Close command menu on Escape
    if (e.key === 'Escape') {
      setShowCommands(false);
    }
  };

  const insertCommand = (cmd: string) => {
    setMessage(cmd + ' ');
    setShowCommands(false);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white relative">
      {showCommands && (
        <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-t-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-2 bg-gray-50 border-b">
            <div className="flex items-center text-sm text-gray-600">
              <Command size={16} className="mr-1" />
              <span>Available Commands</span>
            </div>
            <button 
              onClick={() => setShowCommands(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {commands.map((cmd) => (
              <div 
                key={cmd.command}
                className="p-2 hover:bg-gray-100 cursor-pointer flex flex-col"
                onClick={() => insertCommand(cmd.command)}
              >
                <div className="font-medium text-blue-600">{cmd.command}</div>
                <div className="text-sm text-gray-600">{cmd.description}</div>
                <div className="text-xs text-gray-500 mt-1">Example: {cmd.example}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-end space-x-2">
        <div className="flex-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <textarea
            ref={inputRef}
            className="w-full px-3 py-2 resize-none focus:outline-none rounded-lg"
            placeholder="Type a message or command (start with /)"
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>
        
        <button
          className={`p-2 rounded-full ${
            isLoading || !message.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } transition-colors flex-shrink-0`}
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <Command size={14} className="mr-1" />
        <span>
          Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">/</kbd> for commands or just type naturally
        </span>
      </div>
    </div>
  );
};

export default MessageInput;