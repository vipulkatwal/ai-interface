import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types';
import { usePlugins } from '../hooks/usePlugins';

interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, sender: 'user' | 'assistant', type?: 'text' | 'plugin', pluginName?: string, pluginData?: any) => void;
  processUserMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { findMatchingPlugin } = usePlugins();

  // Load messages from localStorage on initial load
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add welcome message if no saved messages
      addMessage(
        "Hi! I'm your AI assistant. Try commands like '/weather New York', '/calc 5*10', or '/define happiness'. Or just ask me naturally!",
        'assistant'
      );
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (
    content: string,
    sender: 'user' | 'assistant',
    type: 'text' | 'plugin' = 'text',
    pluginName?: string,
    pluginData?: any
  ) => {
    const newMessage: Message = {
      id: uuidv4(),
      sender,
      content,
      type,
      pluginName,
      pluginData,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const processUserMessage = async (content: string) => {
    // Add user message to chat
    addMessage(content, 'user');

    // Check if message is a command or can be handled by a plugin
    setIsLoading(true);

    try {
      const matchedPlugin = await findMatchingPlugin(content);

      if (matchedPlugin) {
        const { plugin, result } = matchedPlugin;

        // Add assistant message with plugin result
        addMessage(
          result.content,
          'assistant',
          'plugin',
          plugin.name,
          result.pluginData
        );
      } else {
        // No plugin matched, respond with default message
        addMessage(
          "I'm not sure how to help with that. Try using commands like '/weather New York', '/calc 5*10', or '/define happiness'.",
          'assistant'
        );
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage(
        "Sorry, I encountered an error processing your request. Please try again.",
        'assistant'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');

    // Add welcome message after clearing
    addMessage(
      "Hi! I'm your AI assistant. Try commands like '/weather New York', '/calc 5*10', or '/define happiness'. Or just ask me naturally!",
      'assistant'
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        processUserMessage,
        isLoading,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};