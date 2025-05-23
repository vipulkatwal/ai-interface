import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { MessageBubble } from './MessageBubble';
import { CommandInput } from './CommandInput';
import useChatStore from '../store/chatStore';
import { PluginManager } from '../plugins/PluginManager';
import { Trash2 } from 'lucide-react';

const pluginManager = new PluginManager();

const TYPING_DELAY = 900; // ms

const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 border border-blue-100 rounded-2xl shadow animate-chatfade w-fit">
    <span className="text-blue-400 font-semibold text-xs">AI is thinking</span>
    <span className="flex gap-1">
      <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  </div>
);

export const ChatUI: React.FC = () => {
  const { messages, addMessage, setLoading, clearMessages } = useChatStore();
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    // Load messages from localStorage on mount
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      parsedMessages.forEach((message: any) => addMessage(message));
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat?')) {
      clearMessages();
      localStorage.removeItem('chatMessages');
    }
  };

  const handleSendMessage = async (content: string) => {
    addMessage({
      sender: 'user',
      content,
      type: 'text',
    });

    // Show typing indicator
    setShowTyping(true);
    setLoading(true);
    await new Promise((res) => setTimeout(res, TYPING_DELAY));
    setShowTyping(false);

    // Check if it's a command
    const parsedCommand = pluginManager.parseMessage(content);
    if (parsedCommand) {
      try {
        const response = await pluginManager.executeCommand(
          parsedCommand.command,
          parsedCommand.args
        );
        const plugin = pluginManager.getPlugin(parsedCommand.command);
        if (plugin) {
          addMessage({
            sender: 'assistant',
            content: '',
            type: 'plugin',
            pluginName: plugin.getCommand(),
            pluginData: plugin.render(response),
          });
        }
      } catch {
        addMessage({
          sender: 'assistant',
          content: 'Sorry, there was an error processing your command.',
          type: 'text',
        });
      }
      setLoading(false);
    } else {
      // Handle regular message
      addMessage({
        sender: 'assistant',
        content: 'I can help you with weather, calculations, and definitions. Try using /weather, /calc, or /define commands!',
        type: 'text',
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50/60 to-white">
      {/* Enhanced Header */}
      <header className="backdrop-blur bg-white/80 border-b border-blue-100 py-4 px-8 flex justify-between items-center shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl select-none" role="img" aria-label="robot">🤖</span>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 drop-shadow-sm">AI Assistant</h1>
        </div>
        <button
          onClick={handleClearChat}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 text-base font-medium transition-colors px-4 py-2 rounded-lg border border-gray-200 hover:border-red-300 bg-white hover:bg-red-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <Trash2 size={18} />
          Clear Chat
        </button>
        <div className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-blue-100/0 via-blue-200/60 to-blue-100/0 pointer-events-none" />
      </header>
      <div className="flex-1 overflow-hidden">
        <ScrollToBottom className="h-full p-4">
          <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${message.type === 'plugin' ? 'w-full' : ''}`}>
                  <MessageBubble message={message} />
                </div>
              </div>
            ))}
            {showTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
          </div>
        </ScrollToBottom>
      </div>
      {/* Input area */}
      <div className="w-full flex flex-col items-center pb-6 pt-2 bg-transparent">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-2xl rounded-xl bg-white/90 border border-blue-100 px-4 py-2 flex items-center">
            <CommandInput
              onSendMessage={handleSendMessage}
              plugins={pluginManager.getAllPlugins()}
            />
          </div>
        </div>
        <div className="w-full flex justify-center mt-2">
          <span className="text-xs text-gray-400">⌘ Pro tip: Use <span className="bg-gray-100 px-1 rounded">/</span> for commands or just chat naturally</span>
        </div>
      </div>
      <style>{`
        @keyframes chatfade {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-chatfade { animation: chatfade 0.4s; }
        .animate-bounce {
          animation: bounce 1.2s infinite both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(1); }
          40% { transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};