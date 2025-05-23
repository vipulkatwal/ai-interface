export interface PluginResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'plugin';
  timestamp: Date;
  pluginResponse?: PluginResponse;
}

export interface Plugin {
  getName(): string;
  getCommand(): string;
  getDescription(): string;
  execute(args: string[]): Promise<PluginResponse>;
  render(data: PluginResponse): React.ReactNode;
}