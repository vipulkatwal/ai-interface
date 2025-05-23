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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message.startsWith('/')) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSelectedIndex(0);
    }
  }, [message]);

  useEffect(() => {
    if (showSuggestions && suggestionsRef.current) {
      const selected = suggestionsRef.current.querySelector('.selected');
      if (selected) (selected as HTMLElement).scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, showSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setSelectedIndex(0);
    }
  };

  const filteredPlugins = plugins.filter(plugin =>
    plugin.getCommand().toLowerCase().includes(
      message.slice(1).toLowerCase()
    )
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && filteredPlugins.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredPlugins.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredPlugins.length) % filteredPlugins.length);
      } else if (e.key === 'Enter') {
        if (message.startsWith('/')) {
          setMessage(`/${filteredPlugins[selectedIndex].getCommand()} `);
          setShowSuggestions(false);
          setSelectedIndex(0);
          inputRef.current?.focus();
          e.preventDefault();
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center"
        autoComplete="off"
      >
        <div className="relative w-full flex justify-center">
          <div className="flex items-center w-full max-w-2xl bg-white border border-blue-100 rounded-xl px-2 py-1 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or command (start with /)"
              className="flex-1 px-5 py-3 bg-transparent border-none outline-none text-base placeholder:text-gray-400 min-w-0 rounded-xl"
              style={{ height: 48 }}
            />
            <button
              type="submit"
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all ml-2"
              style={{ width: 44, height: 44 }}
            >
              <Send size={22} />
            </button>
          </div>
          {showSuggestions && filteredPlugins.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 max-h-48 overflow-y-auto"
              style={{ maxWidth: '576px', margin: '0 auto' }}
            >
              {filteredPlugins.map((plugin, idx) => (
                <button
                  key={plugin.getCommand()}
                  onClick={() => {
                    setMessage(`/${plugin.getCommand()} `);
                    setShowSuggestions(false);
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl text-base transition-colors ${
                    idx === selectedIndex ? 'bg-blue-100 selected' : ''
                  }`}
                >
                  <div className="font-medium text-blue-700">/{plugin.getCommand()}</div>
                  <div className="text-xs text-gray-500">{plugin.getDescription()}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};