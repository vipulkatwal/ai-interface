import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, CloudSun, CloudMoon, Droplets, Wind } from 'lucide-react';

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  icon?: string; // OpenWeatherMap icon code
  windSpeed?: number;
  sunrise?: number;
  sunset?: number;
}

function getWeatherIcon(description: string, icon?: string) {
  const desc = description.toLowerCase();
  if (icon && icon.includes('n')) return <CloudMoon className="w-10 h-10 text-blue-400" />;
  if (desc.includes('sun') || desc.includes('clear')) return <Sun className="w-10 h-10 text-yellow-400" />;
  if (desc.includes('cloud') && desc.includes('sun')) return <CloudSun className="w-10 h-10 text-yellow-300" />;
  if (desc.includes('cloud')) return <Cloud className="w-10 h-10 text-gray-400" />;
  if (desc.includes('rain')) return <CloudRain className="w-10 h-10 text-blue-500" />;
  if (desc.includes('snow')) return <CloudSnow className="w-10 h-10 text-blue-200" />;
  if (desc.includes('thunder')) return <CloudLightning className="w-10 h-10 text-yellow-600" />;
  if (desc.includes('drizzle')) return <CloudDrizzle className="w-10 h-10 text-blue-300" />;
  if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return <CloudFog className="w-10 h-10 text-gray-300" />;
  return <Sun className="w-10 h-10 text-yellow-400" />;
}

function getCardGradient(description: string) {
  const desc = description.toLowerCase();
  if (desc.includes('sun') || desc.includes('clear')) return 'from-yellow-200 to-yellow-50';
  if (desc.includes('cloud')) return 'from-gray-200 to-blue-50';
  if (desc.includes('rain')) return 'from-blue-200 to-blue-50';
  if (desc.includes('snow')) return 'from-blue-100 to-white';
  if (desc.includes('thunder')) return 'from-yellow-100 to-gray-200';
  if (desc.includes('drizzle')) return 'from-blue-100 to-blue-50';
  if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return 'from-gray-100 to-gray-50';
  return 'from-blue-100 to-blue-50';
}

function formatTime(unix: number | undefined) {
  if (!unix) return '--';
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ city, temperature, description, humidity, icon, windSpeed, sunrise, sunset }) => {
  return (
    <div
      className={`relative p-6 rounded-2xl shadow-lg bg-gradient-to-br ${getCardGradient(description)} min-w-[260px] max-w-xs mx-auto animate-fadein`}
      style={{ animation: 'fadein 0.7s' }}
    >
      <div className="flex items-center gap-4 mb-2">
        {getWeatherIcon(description, icon)}
        <div>
          <div className="text-lg font-bold text-gray-800">{city}</div>
          <div className="text-sm text-gray-500 capitalize">{description}</div>
        </div>
      </div>
      <div className="flex items-end gap-2 mt-2">
        <span className="text-4xl font-extrabold text-gray-900">{temperature.toFixed(1)}°C</span>
      </div>
      <div className="flex flex-col gap-2 mt-4 text-blue-700">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          <span className="text-sm">Humidity: {humidity}%</span>
        </div>
        {windSpeed !== undefined && (
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5" />
            <span className="text-sm">Wind: {windSpeed} m/s</span>
          </div>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
          <span>Sunrise: {formatTime(sunrise)}</span>
          <span>Sunset: {formatTime(sunset)}</span>
        </div>
      </div>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};