# AI Chat Interface with Plugin System

A modern chat interface that supports plugin-based commands and natural language processing. Built with React, TypeScript, and Material-UI.

## Features

- Modern, responsive chat UI
- Plugin system for extensible functionality
- Built-in plugins:
  - Calculator (`/calc [expression]`)
  - Weather (`/weather [city]`)
  - Dictionary (`/define [word]`)
- Message history persistence
- Loading states and error handling
- Rich message rendering for plugin responses

## Prerequisites

- Node.js 16+ and npm

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Plugin Architecture

The plugin system is designed to be extensible and easy to use. Each plugin implements the following interface:

```typescript
interface Plugin {
  name: string;
  description: string;
  triggerPattern: RegExp;
  execute: (args: string[]) => Promise<any>;
  render: (data: any) => React.ReactNode;
}
```

### Creating a New Plugin

1. Create a new file in `src/plugins/`
2. Implement the Plugin interface
3. Register the plugin in `src/components/ChatInterface.tsx`

Example plugin:
```typescript
const MyPlugin: Plugin = {
  name: 'myplugin',
  description: 'My awesome plugin',
  triggerPattern: /^\/myplugin\s+(.+)$/,
  async execute(args: string[]) {
    // Plugin logic here
    return result;
  },
  render(data: any) {
    return <div>{/* Render plugin output */}</div>;
  }
};
```

## Available Commands

- `/calc [expression]` - Evaluate mathematical expressions
- `/weather [city]` - Get current weather for a city
- `/define [word]` - Look up word definitions

## Technologies Used

- React
- TypeScript
- Material-UI
- Vite
- Axios for API requests
- react-scroll-to-bottom for chat scrolling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
