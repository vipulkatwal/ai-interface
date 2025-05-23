import type { Plugin, PluginManager } from '../types/chat';

class PluginManagerService implements PluginManager {
  plugins: Map<string, Plugin>;

  constructor() {
    this.plugins = new Map();
  }

  register(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
  }

  unregister(name: string): void {
    this.plugins.delete(name);
  }

  findMatchingPlugin(message: string): { plugin: Plugin; match: RegExpMatchArray } | null {
    for (const plugin of this.plugins.values()) {
      const match = message.match(plugin.regex);
      if (match) {
        return { plugin, match };
      }
    }
    return null;
  }

  async executePlugin(plugin: Plugin, input: string): Promise<unknown> {
    try {
      return await plugin.execute(input);
    } catch (error) {
      console.error(`Error executing plugin ${plugin.name}:`, error);
      throw error;
    }
  }
}

export const pluginManager = new PluginManagerService();