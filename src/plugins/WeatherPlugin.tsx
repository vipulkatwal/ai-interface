import axios from 'axios';
import type { Plugin } from '../types';
import { Card, CardContent, Typography } from '@mui/material';

// Note: In a real application, this should be in an environment variable
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

const WeatherPlugin: Plugin = {
  name: 'weather',
  description: 'Get current weather for a city',
  triggerPattern: /^\/weather\s+(.+)$/,

  async execute(args: string[]): Promise<WeatherData> {
    const city = args[0];
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });

      const data = response.data;
      return {
        city: data.name,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`City "${city}" not found`);
      }
      throw new Error('Failed to fetch weather data');
    }
  },

  render(data: WeatherData) {
    return (
      <Card variant="outlined" sx={{ maxWidth: 300, mt: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Weather in {data.city}
          </Typography>
          <Typography variant="h4" sx={{ my: 1 }}>
            {data.temperature}°C
          </Typography>
          <Typography color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {data.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Humidity: {data.humidity}%
          </Typography>
          <Typography variant="body2">
            Wind Speed: {data.windSpeed} m/s
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default WeatherPlugin;