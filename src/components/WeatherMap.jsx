import React, { useEffect, useState } from 'react';

const API_KEY = import.meta.env.VITE_WEATHERBIT_API_KEY;

function getLatLon(city) {
  // You should use a real geocoding API for production.
  // For demo, here's a simple lookup for a few cities:
  const lookup = {
    Seattle: { lat: 47.6062, lon: -122.3321 },
    NewYork: { lat: 40.7128, lon: -74.0060 },
    London: { lat: 51.5074, lon: -0.1278 },
    Paris: { lat: 48.8566, lon: 2.3522 },
    Tokyo: { lat: 35.6895, lon: 139.6917 },
    // Add more cities as needed
  };
  return lookup[city] || { lat: 45, lon: 45 }; // fallback
}

const WeatherMap = ({ currentCity }) => {
  const [latLon, setLatLon] = useState({ lat: 45, lon: 45 });

  useEffect(() => {
    setLatLon(getLatLon(currentCity));
  }, [currentCity]);

  const mapUrl = `https://maps.weatherbit.io/v2.0/singleband/fullsat/latest/6/${latLon.lat}/${latLon.lon}.png?key=${API_KEY}`;

  return (
    <div className="map-container" style={{ width: '100%', height: '100%' }}>
      <iframe
        title="weather-map"
        src={mapUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 'none' }}
        scrolling="no"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default WeatherMap;