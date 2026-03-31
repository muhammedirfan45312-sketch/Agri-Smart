export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
}

export interface FarmAdvice {
  lat: number;
  lng: number;
  advice: string;
  loading: boolean;
  error: string | null;
  weather?: WeatherData;
}
