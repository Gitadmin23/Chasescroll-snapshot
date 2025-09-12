'use client';
import React, { useCallback } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface MapComponentProps {
  lat: number;
  lng: number;
  width?: string;
  height?: string;
  zoom?: number;
  borderRadius?: string;
  markerTitle?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  lat,
  lng,
  width = '100%',
  height = '200px',
  zoom = 15,
  borderRadius = '16px',
  markerTitle = 'Event Location'
}) => {
  const googleMapsApiKey = 'AIzaSyCk55j_rxvh2Xwau4ifeyzl2uSv4W6nbw0';
  const [showInfoWindow, setShowInfoWindow] = React.useState(false);
  
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius
  };

  const center = {
    lat,
    lng
  };

  const onMarkerClick = useCallback(() => {
    setShowInfoWindow(true);
  }, []);

  const onInfoWindowClose = useCallback(() => {
    setShowInfoWindow(false);
  }, []);

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      }
    ]
  };

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
      <LoadScript 
        googleMapsApiKey={googleMapsApiKey}
        loadingElement={
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
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
        >
          <Marker
            position={center}
            onClick={onMarkerClick}
            title={markerTitle}
            animation={window.google?.maps?.Animation?.DROP}
          />
          
          {showInfoWindow && (
            <InfoWindow
              position={center}
              onCloseClick={onInfoWindowClose}
            >
              <Box p={2}>
                <Box fontWeight="bold" mb={1}>{markerTitle}</Box>
                <Box fontSize="sm" color="gray.600">
                  Lat: {lat.toFixed(6)}<br />
                  Lng: {lng.toFixed(6)}
                </Box>
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapComponent;