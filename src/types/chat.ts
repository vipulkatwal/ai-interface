export type MessageType = 'text' | 'plugin';
export type Sender = 'user' | 'assistant';

export interface Message {
  id: string;
  sender: Sender;
  content: string;
  type: MessageType;
  pluginName?: string;
  pluginData?: any;
  timestamp: string;
}

export interface Plugin {
  name: string;
  description: string;
  command: string;
  regex: RegExp;
  execute: (input: string) => Promise<any>;
  renderResponse: (data: any) => React.ReactNode;
}

export interface PluginManager {
  plugins: Map<string, Plugin>;
  register: (plugin: Plugin) => void;
  unregister: (name: string) => void;
  findMatchingPlugin: (message: string) => { plugin: Plugin; match: RegExpMatchArray } | null;
  executePlugin: (plugin: Plugin, input: string) => Promise<any>;
}