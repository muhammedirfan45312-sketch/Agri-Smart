import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2 } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 10.8505,
  lng: 76.2711
};

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: { lat: number, lng: number } | null;
  radius: number;
  onRadiusChange: (radius: number) => void;
}

const Map: React.FC<MapProps> = ({ onLocationSelect, selectedLocation, radius, onRadiusChange }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyD84Egptlb3r4xYDxHvxgJ7sX3Smb7LV74"
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const onClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onLocationSelect(e.latLng.lat(), e.latLng.lng());
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return isLoaded ? (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-olive/10 border-[12px] border-white relative group cursor-crosshair"
    >
      <div className="absolute inset-0 border border-olive/5 rounded-[28px] pointer-events-none z-10" />
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedLocation || center}
        zoom={7}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: true, // Added Satellite View Control
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
          },
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#5A5A40" }]
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#f1f3f1" }]
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#cbd5cb" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#e2e8e2" }]
            },
            {
              featureType: "administrative",
              elementType: "labels.text.fill",
              stylers: [{ color: "#2d332d" }]
            }
          ]
        }}
      >
        {selectedLocation && (
          <>
            <Marker 
              position={selectedLocation}
              animation={google.maps.Animation.DROP}
            />
            <Circle
              center={selectedLocation}
              radius={radius}
              options={{
                fillColor: "#5A5A40",
                fillOpacity: 0.2,
                strokeColor: "#5A5A40",
                strokeOpacity: 0.5,
                strokeWeight: 2,
                clickable: false,
                editable: false,
                zIndex: 1
              }}
            />
          </>
        )}
      </GoogleMap>

      {/* Radius Control UI */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-6 left-6 z-20"
          >
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-[32px] border border-olive/10 shadow-xl w-64">
              <div className="flex items-center gap-3 mb-4">
                <Settings2 size={16} className="text-olive" />
                <h3 className="text-[10px] font-sans font-black text-olive uppercase tracking-widest">
                  Farmable Area
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-sans font-bold text-olive/40 uppercase tracking-wider">Radius</span>
                  <span className="text-lg font-serif font-bold text-sage-900">{radius}m</span>
                </div>
                
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={radius}
                  onChange={(e) => onRadiusChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-olive/10 rounded-full appearance-none cursor-pointer accent-olive"
                />
                
                <div className="flex justify-between text-[8px] font-sans font-black text-olive/20 uppercase tracking-tighter">
                  <span>100m</span>
                  <span>5km</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pulsating Indicator Tooltip */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ 
              position: 'absolute', 
              left: mousePos.x, 
              top: mousePos.y, 
              pointerEvents: 'none',
              zIndex: 30,
              transform: 'translate(-50%, -50%)' 
            }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute w-8 h-8 bg-olive rounded-full"
              />
              <div className="w-3 h-3 bg-olive rounded-full border-2 border-white shadow-lg relative z-10" />
            </div>
            
            <motion.div 
              initial={{ y: 5 }}
              animate={{ y: 0 }}
              className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-olive/10 shadow-2xl whitespace-nowrap"
            >
              <p className="text-[10px] font-sans font-black text-olive uppercase tracking-[0.15em]">
                Click to get farm advice
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Overlay Controls Hint (Static) - Moved to Bottom Right to avoid search bar */}
      <div className="absolute bottom-6 right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-olive/10 shadow-sm opacity-40 group-hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] font-sans font-black text-olive/60 uppercase tracking-widest">
          Kerala Plot Analysis
        </p>
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-sage-50 rounded-[40px] border border-olive/5">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-olive/10 border-t-olive rounded-full animate-spin" />
        <p className="text-[10px] font-sans font-black text-olive/40 uppercase tracking-[0.3em]">Initializing Map Engine</p>
      </div>
    </div>
  );
};

export default React.memo(Map);
