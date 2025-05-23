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

export interface PluginResponse {
  success: boolean;
  data: any;
  error?: string;
}

export interface Plugin {
  name: string;
  command: string;
  description: string;
  execute: (args: string[]) => Promise<PluginResponse>;
  render: (data: PluginResponse) => React.ReactNode;
}