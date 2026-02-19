const QWEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const HAIZHU_LOCATION_ID = '101280102'; // Haizhu District, Guangzhou
// Use local proxy to avoid CORS
const QWEATHER_API_URL = '/api/weather/v7/weather/now';

export interface WeatherData {
    temp: string;
    icon: string;
    text: string;
    feelsLike?: string;
    humidity?: string;
    windDir?: string;
    windScale?: string;
}

export const fetchWeather = async (): Promise<WeatherData | null> => {
    if (!QWEATHER_API_KEY || QWEATHER_API_KEY === 'PLACEHOLDER_API_KEY') {
        console.warn('Weather API Key is missing or invalid.');
        return null;
    }

    try {
        const url = `${QWEATHER_API_URL}?location=${HAIZHU_LOCATION_ID}&key=${QWEATHER_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Weather API Error Details:', errorText);
            throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.code !== '200') {
            throw new Error(`Weather API Error Code: ${data.code}`);
        }

        return {
            temp: data.now.temp,
            icon: data.now.icon,
            text: data.now.text,
            feelsLike: data.now.feelsLike,
            humidity: data.now.humidity,
            windDir: data.now.windDir,
            windScale: data.now.windScale
        };

    } catch (error) {
        console.error('Failed to fetch weather:', error);
        return null;
    }
};
