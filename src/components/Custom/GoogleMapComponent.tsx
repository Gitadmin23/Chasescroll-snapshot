'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Spinner } from '@chakra-ui/react';

interface GoogleMapComponentProps {
  lat: number;
  lng: number;
  width?: string;
  height?: string;
  zoom?: number;
  borderRadius?: string;
  markerTitle?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  lat,
  lng,
  width = '100%',
  height = '200px',
  zoom = 15,
  borderRadius = '16px',
  markerTitle = 'Location'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const googleMapsApiKey = 'AIzaSyCk55j_rxvh2Xwau4ifeyzl2uSv4W6nbw0';

  useEffect(() => {
    // Load the Google Maps JavaScript API
    const loadGoogleMapsApi = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.initMap = () => {
          setMapLoaded(true);
        };

        return () => {
          document.head.removeChild(script);
          // delete window.initMap;
        };
      } else {
        setMapLoaded(true);
      }
    };

    loadGoogleMapsApi();
  }, [googleMapsApiKey]);

  useEffect(() => {
    if (mapLoaded && mapRef.current && !mapInstance) {
      // Initialize the map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Add a marker
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: markerTitle,
        animation: window.google.maps.Animation.DROP,
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>${markerTitle}</strong><br>Latitude: ${lat}<br>Longitude: ${lng}</div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      setMapInstance(map);
    }
  }, [mapLoaded, lat, lng, zoom, markerTitle, mapInstance]);

  // Update map center when lat/lng props change
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setCenter({ lat, lng });

      // Update marker position
      const markers = mapInstance.markers || [];
      if (markers.length > 0) {
        markers[0].setPosition({ lat, lng });
      }
    }
  }, [lat, lng, mapInstance]);

  return (
    <Box
      w={width}
      h={height}
      borderRadius={borderRadius}
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
      position="relative"
    >
      {!mapLoaded && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
        >
          <Spinner size="xl" color="primaryColor" />
        </Box>
      )}
      <Box ref={mapRef} width="100%" height="100%" />
    </Box>
  );
};

export default GoogleMapComponent;