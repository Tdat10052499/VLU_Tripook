import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SimpleMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
  popupContent?: string;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ 
  latitude, 
  longitude, 
  zoom = 15, 
  className = "",
  popupContent
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = () => {
      if (!isMounted || !mapRef.current) return;

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        // Clear container
        mapRef.current.innerHTML = '';

        // Create map
        const map = L.map(mapRef.current, {
          center: [latitude, longitude],
          zoom: zoom,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create custom icon
        const customIcon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        // Add marker
        const marker = L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map);

        // Add popup if content is provided
        if (popupContent) {
          marker.bindPopup(`
            <div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
              <strong style="color: #1e40af;">📍 ${popupContent}</strong>
            </div>
          `).openPopup();
        }

      } catch (error) {
        console.warn('Map initialization error:', error);
      }
    };

    // Initialize map directly since Leaflet is imported
    if (isMounted) {
      // Small delay to ensure DOM is ready
      setTimeout(initializeMap, 100);
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.warn('Map cleanup error:', error);
        }
      }
    };
  }, [latitude, longitude, zoom, popupContent]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef}
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30"
        style={{ minHeight: '400px', backgroundColor: '#f3f4f6' }}
      />
    </div>
  );
};

export default SimpleMap;