'use client';
import React, { useCallback, useMemo } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface OptimizedMapComponentProps {
  lat: number;
  lng: number;
  width?: string;
  height?: string;
  zoom?: number;
  borderRadius?: string;
  markerTitle?: string;
  onMarkerClick?: () => void;
}

// Libraries to load for Google Maps
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

const OptimizedMapComponent: React.FC<OptimizedMapComponentProps> = React.memo(({
  lat,
  lng,
  width = '100%',
  height = '200px',
  zoom = 15,
  borderRadius = '16px',
  markerTitle = 'Event Location',
  onMarkerClick
}) => {
  const googleMapsApiKey = 'AIzaSyCk55j_rxvh2Xwau4ifeyzl2uSv4W6nbw0';
  const [showInfoWindow, setShowInfoWindow] = React.useState(false);
  const [mapInstance, setMapInstance] = React.useState<google.maps.Map | null>(null);

  // Memoize map container style to prevent re-creation
  const mapContainerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    borderRadius: borderRadius
  }), [borderRadius]);

  // Memoize center coordinates
  const center = useMemo(() => ({
    lat,
    lng
  }), [lat, lng]);

  // Memoize map options
  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    clickableIcons: true,
    gestureHandling: 'cooperative' as const,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      }
    ]
  }), []);

  const handleMarkerClick = useCallback(() => {
    setShowInfoWindow(true);
    onMarkerClick?.();
  }, [onMarkerClick]);

  const handleInfoWindowClose = useCallback(() => {
    setShowInfoWindow(false);
  }, []);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);

  const handleMapUnmount = useCallback(() => {
    setMapInstance(null);
  }, []);

  // Loading component
  const loadingElement = useMemo(() => (
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
  ), []);

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
        libraries={libraries}
        loadingElement={loadingElement}
        preventGoogleFontsLoading
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={handleMapLoad}
          onUnmount={handleMapUnmount}
        >
          <Marker
            position={center}
            onClick={handleMarkerClick}
            title={markerTitle}
            animation={window.google?.maps?.Animation?.DROP}
          />

          {showInfoWindow && (
            <InfoWindow
              position={center}
              onCloseClick={handleInfoWindowClose}
              options={{
                pixelOffset: new window.google.maps.Size(0, -30)
              }}
            >
              <Box p={2} maxW="200px">
                <Box fontWeight="bold" mb={1} fontSize="sm">
                  {markerTitle}
                </Box>
                <Box fontSize="xs" color="gray.600">
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
});

OptimizedMapComponent.displayName = 'OptimizedMapComponent';

export default OptimizedMapComponent;