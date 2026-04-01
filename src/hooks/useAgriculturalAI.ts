import { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FarmAdvice, StructuredAdvice, DetailedCropInfo } from '../types';

// Kerala bounds (approximate)
const KERALA_BOUNDS = {
  minLat: 8.1,
  maxLat: 12.9,
  minLng: 74.8,
  maxLng: 77.6
};

export const useAgriculturalAI = () => {
  const [advice, setAdvice] = useState<FarmAdvice>({
    lat: 0,
    lng: 0,
    advice: null,
    loading: false,
    error: null
  });

  const [cropDetails, setCropDetails] = useState<{
    loading: boolean;
    data: DetailedCropInfo | null;
    error: string | null;
  }>({
    loading: false,
    data: null,
    error: null
  });

  const validateLocation = (lat: number, lng: number) => {
    return (
      lat >= KERALA_BOUNDS.minLat &&
      lat <= KERALA_BOUNDS.maxLat &&
      lng >= KERALA_BOUNDS.minLng &&
      lng <= KERALA_BOUNDS.maxLng
    );
  };

  const getAdvice = useCallback(async (lat: number, lng: number, radius: number) => {
    // Security: Validate inputs
    if (!validateLocation(lat, lng)) {
      setAdvice(prev => ({ 
        ...prev, 
        lat, 
        lng, 
        loading: false, 
        error: 'Selected location is outside the supported Kerala region. Please select a point within Kerala.' 
      }));
      return;
    }

    setAdvice(prev => ({ ...prev, lat, lng, loading: true, error: null, weather: undefined }));

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('AI Service configuration is missing.');
      }

      // Fetch Weather Data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`
      ).then(res => res.json()).catch(() => null);

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const prompt = `Act as an expert Kerala agriculturalist. I am analyzing a farmable area at coordinates Latitude: ${lat}, Longitude: ${lng} in Kerala. 
      The area being considered is a circle with a radius of ${radius} meters.
      Current Local Weather:
      - Temperature: ${weatherRes?.current?.temperature_2m}°C
      - Humidity: ${weatherRes?.current?.relative_humidity_2m}%
      - Precipitation: ${weatherRes?.current?.precipitation}mm
      
      Provide a detailed analysis of the location.`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              soilAndTerrain: {
                type: Type.STRING,
                description: "Description of the likely soil type and terrain."
              },
              recommendedCrops: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["name", "reason"]
                },
                description: "List of 2-3 best crops for this location."
              },
              expertTip: {
                type: Type.STRING,
                description: "One key expert tip for success in this area."
              },
              suitabilityScore: {
                type: Type.INTEGER,
                description: "A score from 0-100 representing the agricultural suitability of this plot."
              }
            },
            required: ["soilAndTerrain", "recommendedCrops", "expertTip", "suitabilityScore"]
          }
        }
      });

      const structuredAdvice = JSON.parse(response.text) as StructuredAdvice;

      const weather = weatherRes ? {
        temperature: weatherRes.current.temperature_2m,
        humidity: weatherRes.current.relative_humidity_2m,
        precipitation: weatherRes.current.precipitation,
      } : undefined;

      setAdvice(prev => ({
        ...prev,
        advice: structuredAdvice,
        loading: false,
        weather
      }));
    } catch (err) {
      console.error('Agricultural AI Error:', err);
      setAdvice(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to connect to the AI service. Please try again later.'
      }));
    }
  }, []);

  const getCropDetails = useCallback(async (cropName: string) => {
    // Security: Sanitize input
    const sanitizedCropName = cropName.trim().substring(0, 50);
    if (!sanitizedCropName) return;

    setCropDetails({ loading: true, data: null, error: null });

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('AI Service configuration is missing.');
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const prompt = `Provide detailed agricultural information for the crop: ${sanitizedCropName} in the context of Kerala, India.`;

      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              plantingSeason: { type: Type.STRING },
              waterRequirements: { type: Type.STRING },
              fertilizerNeeds: { type: Type.STRING },
              commonPests: { type: Type.STRING },
              harvestTime: { type: Type.STRING },
              marketDemand: { type: Type.STRING }
            },
            required: ["name", "plantingSeason", "waterRequirements", "fertilizerNeeds", "commonPests", "harvestTime", "marketDemand"]
          }
        }
      });

      const details = JSON.parse(response.text) as DetailedCropInfo;
      setCropDetails({ loading: false, data: details, error: null });
    } catch (err) {
      console.error('Crop Details AI Error:', err);
      setCropDetails({ loading: false, data: null, error: 'Failed to fetch crop details.' });
    }
  }, []);

  const resetCropDetails = useCallback(() => {
    setCropDetails({ loading: false, data: null, error: null });
  }, []);

  return {
    advice,
    cropDetails,
    getAdvice,
    getCropDetails,
    resetCropDetails
  };
};
