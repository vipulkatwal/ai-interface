import React from 'react';
import { Plugin, PluginResult } from '../types';
import { CloudSun, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export const weatherPlugin: Plugin = {
  name: 'Weather',
  description: 'Get current weather for a location',
  icon: 'cloud-sun',
  triggers: ['weather', 'forecast'],
  keywords: ['weather', 'temperature', 'forecast', "what's the weather", "how's the weather"],
  
  execute: async (location: string): Promise<PluginResult> => {
    try {
      // In a real app, you would call a weather API
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock weather data based on location
      const mockWeatherData: WeatherData = {
        location: location.trim(),
        temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Thunderstorm'][
          Math.floor(Math.random() * 5)
        ],
        humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
        windSpeed: Math.floor(Math.random() * 20) + 1, // 1-20 km/h
      };
      
      return {
        content: `Weather in ${mockWeatherData.location}: ${mockWeatherData.temperature}°C, ${mockWeatherData.condition}`,
        pluginData: mockWeatherData,
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error(`Couldn't get weather for ${location}. Please try again.`);
    }
  },
  
  renderResult: (data: WeatherData) => (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 text-white shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{data.location}</h3>
        <CloudSun size={28} className="text-yellow-200" />
      </div>
      
      <div className="flex items-center mb-3">
        <div className="text-3xl font-bold mr-2">{data.temperature}°C</div>
        <div className="text-sm opacity-90">{data.condition}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <Droplets size={16} className="mr-1" />
          <span>Humidity: {data.humidity}%</span>
        </div>
        <div className="flex items-center">
          <Wind size={16} className="mr-1" />
          <span>Wind: {data.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  ),
};