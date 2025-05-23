import type { Plugin } from '../types/chat';
import { Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';
import axios from 'axios';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

export const weatherPlugin: Plugin = {
  name: 'weather',
  description: 'Get current weather for a city',
  command: '/weather',
  regex: /^\/weather\s+(.+)$/i,

  async execute(input: string): Promise<WeatherData> {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    if (!API_KEY) {
      throw new Error('Weather API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(input.trim())}&units=metric&appid=${API_KEY}`;

    try {
      const response = await axios.get<WeatherData>(url);
      if (response.status !== 200) {
        throw new Error('Could not fetch weather data');
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Could not find weather data for "${input}". Please check the city name and try again.`);
      }
      throw new Error('Could not fetch weather data. Please try again later.');
    }
  },

  renderResponse(data: WeatherData) {
    return (
      <Card variant="outlined" sx={{ maxWidth: 300, my: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weather in {data.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <img
              src={`https://openweathermap.org/img/w/${data.weather[0].icon}.png`}
              alt={data.weather[0].description}
              style={{ marginRight: 8 }}
            />
            <Typography variant="h5">
              {Math.round(data.main.temp)}°C
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Feels like: {Math.round(data.main.feels_like)}°C
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Humidity: {data.main.humidity}%
          </Typography>
        </CardContent>
      </Card>
    );
  }
};