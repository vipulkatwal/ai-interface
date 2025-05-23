import { create } from 'zustand';
import { Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: uuidv4(),
      timestamp: new Date().toISOString()
    }]
  })),
  clearMessages: () => set({ messages: [] }),
  setLoading: (loading) => set({ isLoading: loading })
}));

export default useChatStore;