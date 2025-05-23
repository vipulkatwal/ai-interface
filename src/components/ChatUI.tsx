import React, { useEffect, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { MessageBubble } from './MessageBubble';
import { CommandInput } from './CommandInput';
import useChatStore from '../store/chatStore';
import { PluginManager } from '../plugins/PluginManager';
import { MessageCircle, Trash2 } from 'lucide-react';

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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <MessageCircle className="text-blue-600 mr-2" size={24} />
          <h1 className="text-xl font-semibold">AI Assistant</h1>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('chatMessages');
            localStorage.removeItem('chatMessages');
          }}
          className="text-gray-500 hover:text-red-500 flex items-center text-sm transition-colors"
        >
          <Trash2 size={16} className="mr-1" />
          Clear Chat
        </button>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollToBottom className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
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
      <div className="p-4 border-t border-gray-200 bg-white">
        <CommandInput
          onSendMessage={handleSendMessage}
          plugins={pluginManager.getAllPlugins()}
        />
      </div>
    </div>
  );
};