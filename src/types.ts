export interface CropSuggestion {
  name: string;
  reason: string;
}

export interface StructuredAdvice {
  soilAndTerrain: string;
  recommendedCrops: CropSuggestion[];
  expertTip: string;
  suitabilityScore: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
}

export interface FarmAdvice {
  lat: number;
  lng: number;
  advice: StructuredAdvice | null;
  loading: boolean;
  error: string | null;
  weather?: WeatherData;
}
