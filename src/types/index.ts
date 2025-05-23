export type Sender = 'user' | 'assistant';
export type MessageType = 'text' | 'plugin';

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
  icon: string;
  triggers: string[];
  keywords: string[];
  execute: (input: string) => Promise<PluginResult>;
  renderResult: (data: any) => React.ReactNode;
}

export interface PluginResult {
  content: string;
  pluginData: any;
}