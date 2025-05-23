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
    // Natural language weather queries
    const weatherPatterns = [
      /(?:weather|temperature|forecast)\s+(?:in|at|for)\s+([\w\s]+)/i,
      /what(?:'s| is) the weather in ([\w\s]+)/i,
      /how(?:'s| is) the weather in ([\w\s]+)/i,
      /is it raining in ([\w\s]+)/i
    ];
    for (const pattern of weatherPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return { command: 'weather', args: [match[1].trim()] };
      }
    }

    // Natural language calculator queries
    const calcPatterns = [
      /what(?:'s| is) ([^?]+)\?/i,
      /calculate ([^?]+)/i,
      /how much is ([^?]+)\?/i,
      /evaluate ([^?]+)/i
    ];
    for (const pattern of calcPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return { command: 'calc', args: [match[1].trim()] };
      }
    }

    // Natural language dictionary queries
    const dictPatterns = [
      /define ([\w-]+)/i,
      /what does ([\w-]+) mean/i,
      /meaning of ([\w-]+)/i,
      /definition of ([\w-]+)/i
    ];
    for (const pattern of dictPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return { command: 'define', args: [match[1].trim()] };
      }
    }

    // Original slash command parsing
    const match = message.match(/^\/(\w+)(?:\s+(.+))?$/);
    if (!match) return null;

    const [, command, argsString] = match;
    const args = argsString ? argsString.split(/\s+/) : [];
    return { command, args };
  }
}