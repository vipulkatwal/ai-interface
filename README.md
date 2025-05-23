# AI-Powered Chatbot Interface

A React-based chatbot interface that supports plugin commands and natural language interactions. Built with TypeScript, Material-UI, and a plugin architecture for extensibility.

## Features

- 💬 Modern chat interface with message history
- 🔌 Plugin system for extensible functionality
- 🌤️ Weather information lookup
- 🔢 Calculator for mathematical expressions
- 📚 Dictionary definitions
- 💾 Persistent chat history using localStorage
- 🎨 Material Design UI components
- 📱 Responsive layout

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- OpenWeatherMap API key (for weather plugin)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-interface
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your API keys:
   ```env
   # OpenWeatherMap API key (Required for weather plugin)
   # Get your free API key at: https://openweathermap.org/api
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key for weather data | Yes | - |

To get your API keys:
1. OpenWeatherMap API:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Navigate to "API Keys" section
   - Create a new API key or use the default one
   - Copy the key to your `.env` file

## Plugin Architecture

The chatbot uses a plugin-based architecture that allows for easy extension of functionality:

### Plugin Interface
```typescript
interface Plugin {
  name: string;
  description: string;
  command: string;
  regex: RegExp;
  execute: (input: string) => Promise<any>;
  renderResponse: (data: any) => React.ReactNode;
}
```

### Available Plugins

1. **Calculator Plugin**
   - Command: `/calc <expression>`
   - Example: `/calc 5 * (10 + 2)`
   - Safely evaluates mathematical expressions

2. **Weather Plugin**
   - Command: `/weather <city>`
   - Example: `/weather London`
   - Shows current weather conditions
   - Requires: `VITE_OPENWEATHER_API_KEY`

3. **Dictionary Plugin**
   - Command: `/define <word>`
   - Example: `/define serendipity`
   - Provides word definitions and examples

### Adding New Plugins

To create a new plugin:

1. Create a new file in `src/plugins/`
2. Implement the Plugin interface
3. Register the plugin in `src/components/Chat.tsx`

Example plugin structure:
```typescript
export const myPlugin: Plugin = {
  name: 'plugin-name',
  description: 'Plugin description',
  command: '/command',
  regex: /^\/command\s+(.+)$/i,

  async execute(input: string) {
    // Process the input and return result
  },

  renderResponse(data) {
    // Return React component to render the result
  }
};
```

## Project Structure

```
src/
├── components/        # React components
│   ├── Chat.tsx      # Main chat interface
│   └── MessageBubble.tsx
├── plugins/          # Plugin implementations
│   ├── CalculatorPlugin.tsx
│   ├── WeatherPlugin.tsx
│   └── DictionaryPlugin.tsx
├── services/         # Core services
│   └── PluginManager.ts
├── types/           # TypeScript type definitions
│   ├── chat.ts
│   └── env.d.ts
└── App.tsx         # Root component
```

## Technologies Used

- React 18
- TypeScript
- Material-UI
- Vite
- Axios
- react-scroll-to-bottom

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
