import type { ReactNode } from 'react';

export type MessageSender = 'user' | 'assistant';
export type MessageType = 'text' | 'plugin';

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  type: MessageType;
  pluginName?: string;
  pluginData?: any;
  timestamp: string;
}

export interface Plugin {
  name: string;
  description: string;
  triggerPattern: RegExp;
  execute: (args: string[]) => Promise<any>;
  render: (data: any) => ReactNode;
}

export interface PluginManager {
  plugins: Plugin[];
  registerPlugin: (plugin: Plugin) => void;
  parseMessage: (message: string) => Promise<Message>;
}