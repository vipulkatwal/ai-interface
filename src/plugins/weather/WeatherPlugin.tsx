import React from 'react';
import axios from 'axios';
import { BasePlugin } from '../base/BasePlugin';
import { PluginResponse } from '../../types';

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export class WeatherPlugin extends BasePlugin {
  constructor() {
    super(
      'weather',
      'weather',
      'Get current weather for a city (e.g., /weather London)'
    );
  }

  async execute(args: string[]): Promise<PluginResponse> {
    try {
      const city = args.join(' ');
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });

      const { main, weather, name } = response.data;
      return {
        success: true,
        data: {
          city: name,
          temperature: main.temp,
          description: weather[0].description,
          humidity: main.humidity
        }
      };
    } catch (_error) {
      return {
        success: false,
        data: null,
        error: 'Failed to fetch weather data'
      };
    }
  }

  protected renderSuccess(data: PluginResponse): React.ReactNode {
    const { city, temperature, description, humidity } = data.data;
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="text-xl font-semibold">{city}</div>
        <div className="text-2xl font-bold mt-2">{temperature}°C</div>
        <div className="text-gray-600 capitalize">{description}</div>
        <div className="text-sm text-gray-500 mt-2">Humidity: {humidity}%</div>
      </div>
    );
  }
}