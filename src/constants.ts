export const SOIL_STYLE = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#3d2b1f" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#5c4033" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "simplified" }, { color: "#8b4513" }] }
];

export const RAINFALL_STYLE = [
  { featureType: "all", elementType: "geometry", stylers: [{ color: "#001f3f" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0074d9" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#003366" }] },
  { featureType: "road", stylers: [{ color: "#001a33" }] }
];

export const DEFAULT_STYLE = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#5A5A40" }] },
  { featureType: "landscape", elementType: "all", stylers: [{ color: "#f1f3f1" }] },
  { featureType: "water", elementType: "all", stylers: [{ color: "#cbd5cb" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#e2e8e2" }] },
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#2d332d" }] }
];

export const KERALA_CENTER = {
  lat: 10.8505,
  lng: 76.2711
};
