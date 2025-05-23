import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Plugin } from '../types';

interface CommandInputProps {
  onSendMessage: (message: string) => void;
  plugins: Plugin[];
}

export const CommandInput: React.FC<CommandInputProps> = ({
  onSendMessage,
  plugins
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (message.startsWith('/')) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const filteredPlugins = plugins.filter(plugin =>
    plugin.command.toLowerCase().includes(
      message.slice(1).toLowerCase()
    )
  );

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or use / for commands..."
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Send size={20} />
        </button>
      </form>

      {showSuggestions && filteredPlugins.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200">
          {filteredPlugins.map((plugin) => (
            <button
              key={plugin.command}
              onClick={() => {
                setMessage(`/${plugin.command} `);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="font-medium">/{plugin.command}</div>
              <div className="text-sm text-gray-500">{plugin.description}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};