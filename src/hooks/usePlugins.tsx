import { useState, useEffect } from 'react';
import { Plugin, PluginResult } from '../types';
import { weatherPlugin } from '../plugins/weatherPlugin';
import { calculatorPlugin } from '../plugins/calculatorPlugin';
import { dictionaryPlugin } from '../plugins/dictionaryPlugin';

interface MatchedPlugin {
  plugin: Plugin;
  result: PluginResult;
}

export const usePlugins = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    // Register all available plugins
    setPlugins([weatherPlugin, calculatorPlugin, dictionaryPlugin]);
  }, []);

  const findMatchingPlugin = async (message: string): Promise<MatchedPlugin | null> => {
    // Check for slash commands first (e.g., /weather Paris)
    const slashCommandMatch = message.match(/^\/(\w+)\s+(.+)$/);
    if (slashCommandMatch) {
      const [, command, input] = slashCommandMatch;
      const matchedPlugin = plugins.find(plugin =>
        plugin.triggers.includes(command.toLowerCase())
      );

      if (matchedPlugin) {
        try {
          const result = await matchedPlugin.execute(input);
          return { plugin: matchedPlugin, result };
        } catch (error) {
          console.error(`Error executing plugin ${matchedPlugin.name}:`, error);
          throw error;
        }
      }
    }

    // Try natural language parsing
    for (const plugin of plugins) {
      // Check if message contains any of the plugin's keywords
      const hasKeyword = plugin.keywords.some(keyword =>
        message.toLowerCase().includes(keyword.toLowerCase())
      );

      if (hasKeyword) {
        try {
          // Extract the relevant part of the message after the keyword
          let input = message;

          // For natural language queries, try to extract the relevant part
          plugin.keywords.forEach(keyword => {
            const regex = new RegExp(`(?:${keyword})\\s+(.+)`, 'i');
            const match = message.match(regex);
            if (match && match[1]) {
              input = match[1];
            }
          });

          const result = await plugin.execute(input);
          return { plugin, result };
        } catch (error) {
          console.error(`Error executing plugin ${plugin.name}:`, error);
          continue; // Try next plugin if this one fails
        }
      }
    }

    return null;
  };

  return { plugins, findMatchingPlugin };
};