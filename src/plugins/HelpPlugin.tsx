import type { Plugin } from '../types';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import { pluginManager } from '../services/PluginManager';

const HelpPlugin: Plugin = {
  name: 'help',
  description: 'Show available commands',
  triggerPattern: /^\/help$/,

  async execute(): Promise<{ commands: { name: string; description: string }[] }> {
    return {
      commands: pluginManager.plugins.map(plugin => ({
        name: plugin.name,
        description: plugin.description
      }))
    };
  },

  render(data: { commands: { name: string; description: string }[] }) {
    return (
      <Card variant="outlined" sx={{ maxWidth: 400, mt: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Available Commands
          </Typography>
          <List>
            {data.commands.map((cmd, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`/${cmd.name}`}
                  secondary={cmd.description}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }
};

export default HelpPlugin;