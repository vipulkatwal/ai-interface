import React from 'react';
import axios from 'axios';
import { BasePlugin } from '../base/BasePlugin.tsx';
import { PluginResponse } from '../../types';
import { WeatherCard } from './WeatherCard';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  icon?: string;
  windSpeed?: number;
  sunrise?: number;
  sunset?: number;
}

const API_KEY = 'ce3f2554a9e087b4c776d5d081a2a52c'; // Replace with your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export class WeatherPlugin extends BasePlugin {
  constructor() {
    super(
      'weather',
      'weather',
      'Get weather information (e.g., /weather London)'
    );
  }

  async execute(args: string[]): Promise<PluginResponse<WeatherData | null>> {
    if (!args.length) {
      return {
        success: false,
        data: null,
        error: 'Please provide a city name'
      };
    }

    try {
      // Normalize city input for case-insensitive search
      const city = args.join(' ').trim();
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });

      const { main, weather, name, wind, sys } = response.data;
      return {
        success: true,
        data: {
          city: name,
          temperature: main.temp,
          description: weather[0].description,
          humidity: main.humidity,
          icon: weather[0].icon,
          windSpeed: wind?.speed,
          sunrise: sys?.sunrise,
          sunset: sys?.sunset
        }
      };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return {
          success: false,
          data: null,
          error: `City not found. Please check the spelling or try a nearby larger city.`
        };
      }
      return {
        success: false,
        data: null,
        error: 'Failed to fetch weather data'
      };
    }
  }

  protected renderSuccess(data: PluginResponse<WeatherData | null>): React.ReactNode {
    if (!data.data) return null;
    const { city, temperature, description, humidity, icon, windSpeed, sunrise, sunset } = data.data;
    return (
      <WeatherCard
        city={city}
        temperature={temperature}
        description={description}
        humidity={humidity}
        icon={icon}
        windSpeed={windSpeed}
        sunrise={sunrise}
        sunset={sunset}
      />
    );
  }

  public render(data: PluginResponse<WeatherData | null>, loading = false): React.ReactNode {
    if (loading) {
      return <div className="p-6 text-center animate-pulse text-blue-400">Loading weather...</div>;
    }
    if (!data.success) {
      return (
        <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl">{data.error || 'Something went wrong.'}</div>
      );
    }
    return this.renderSuccess(data);
  }
}