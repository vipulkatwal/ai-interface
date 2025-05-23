import { v4 as uuidv4 } from 'uuid';
import type { Message, Plugin, PluginManager } from '../types';

class PluginManagerImpl implements PluginManager {
  plugins: Plugin[] = [];

  registerPlugin(plugin: Plugin): void {
    this.plugins.push(plugin);
  }

  async parseMessage(message: string): Promise<Message> {
    const timestamp = new Date().toISOString();

    // Check for plugin commands
    for (const plugin of this.plugins) {
      const match = message.match(plugin.triggerPattern);
      if (match) {
        const args = match.slice(1); // Remove the full match
        try {
          const pluginData = await plugin.execute(args);
          return {
            id: uuidv4(),
            sender: 'assistant',
            content: message,
            type: 'plugin',
            pluginName: plugin.name,
            pluginData,
            timestamp
          };
        } catch (error) {
          return {
            id: uuidv4(),
            sender: 'assistant',
            content: `Error executing ${plugin.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            type: 'text',
            timestamp
          };
        }
      }
    }

    // If no plugin matches, return as regular text message
    return {
      id: uuidv4(),
      sender: 'user',
      content: message,
      type: 'text',
      timestamp
    };
  }
}

export const pluginManager = new PluginManagerImpl();