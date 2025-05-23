import React, { useEffect, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { MessageBubble } from './MessageBubble';
import { CommandInput } from './CommandInput';
import useChatStore from '../store/chatStore';
import { PluginManager } from '../plugins/PluginManager';
import { MessageCircle, Trash2, Settings } from 'lucide-react';

const pluginManager = new PluginManager();

export const ChatUI: React.FC = () => {
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({
      sender: 'user',
      content,
      type: 'text'
    });

    // Check if it's a command
    const parsedCommand = pluginManager.parseMessage(content);
    if (parsedCommand) {
      setLoading(true);
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
            pluginName: plugin.name,
            pluginData: plugin.render(response)
          });
        }
      } catch (error) {
        addMessage({
          sender: 'assistant',
          content: 'Sorry, there was an error processing your command.',
          type: 'text'
        });
      }
      setLoading(false);
    } else {
      // Handle regular message
      addMessage({
        sender: 'assistant',
        content: 'I can help you with various commands. Try /weather, /calc, or /define!',
        type: 'text'
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-7 px-12 flex justify-between items-center shadow-sm min-h-[80px]">
        <div className="flex items-center gap-4">
          <MessageCircle className="text-blue-600 mr-2" size={36} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">AI Assistant</h1>
            <div className="text-base text-gray-400 -mt-1">Powered by advanced AI</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Settings"
          >
            <Settings size={22} />
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('chatMessages');
              window.location.reload();
            }}
            className="text-gray-400 hover:text-red-500 flex items-center text-base transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={20} className="mr-1" />
            Clear Chat
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center">
        <ScrollToBottom className="h-full w-full flex flex-col items-center justify-center p-6">
          <div className="space-y-4 w-full max-w-2xl mx-auto flex flex-col justify-center items-center min-h-[calc(100vh-260px)]">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-400 mt-24 text-xl select-none font-medium">
                Start a conversation or try a command like <span className="text-blue-500 font-semibold">/weather London</span>
              </div>
            )}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollToBottom>
      </div>
      <div className="w-full flex justify-center bg-transparent py-8">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl shadow-lg bg-white/90 border border-gray-200 px-6 py-4 flex items-center">
            <CommandInput
              onSendMessage={handleSendMessage}
              plugins={pluginManager.getAllPlugins()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};