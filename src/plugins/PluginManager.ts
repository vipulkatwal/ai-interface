import { Plugin, PluginResponse } from '../types';
import { CalculatorPlugin } from './calculator/CalculatorPlugin';
import { WeatherPlugin } from './weather/WeatherPlugin';
import { DictionaryPlugin } from './dictionary/DictionaryPlugin';

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  constructor() {
    this.registerDefaultPlugins();
  }

  private registerDefaultPlugins() {
    const defaultPlugins = [
      new CalculatorPlugin(),
      new WeatherPlugin(),
      new DictionaryPlugin()
    ];

    defaultPlugins.forEach(plugin => {
      this.plugins.set(plugin.command, plugin);
    });
  }

  getPlugin(command: string): Plugin | undefined {
    return this.plugins.get(command);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  async executeCommand(command: string, args: string[]): Promise<PluginResponse> {
    const plugin = this.getPlugin(command);
    if (!plugin) {
      return {
        success: false,
        data: null,
        error: `Unknown command: ${command}`
      };
    }

    return plugin.execute(args);
  }

  parseMessage(message: string): { command: string; args: string[] } | null {
    const match = message.match(/^\/(\w+)(?:\s+(.+))?$/);
    if (!match) return null;

    const [, command, argsString] = match;
    const args = argsString ? argsString.split(/\s+/) : [];
    return { command, args };
  }
}