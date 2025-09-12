import React, { useEffect } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  useJsApiLoader,
  DirectionsRenderer
} from "@react-google-maps/api";
import { MdClose } from 'react-icons/md';
import MapSearch from './map_search';
import UserLocation from './user_location';
import { Box, Flex, useToast } from '@chakra-ui/react';
import CustomButton from '@/components/general/Button';
import useEventStore from '@/global-state/useCreateEventState';
import LoadingAnimation from '../loading_animation';
import EventDirection from './event_direction';
import useCustomTheme from '@/hooks/useTheme';
import useProductStore from '@/global-state/useCreateProduct';

interface Props {
  close?: any,
  hidesearch?: boolean,
  height?: string,
  view?: boolean,
  latlng?: any,
  zoom?: number | undefined,
  setMyLocat?: any
}

const center = {
  lat: 9.0820,
  lng: 8.6753,
};


function MapComponent(props: Props) {
  const {
    close,
    hidesearch,
    height,
    view,
    latlng,
    zoom,
    setMyLocat
  } = props


  const { eventdata, updateEvent } = useEventStore((state) => state);
  const { updateProduct, productdata, updateRental, rentaldata, updateAddress, location } = useProductStore((state) => state);
  const toast = useToast()
  const [directionsResponse, setDirectionsResponse] = React.useState(null);

  const containerStyle = {
    width: '100%',
    height: height ? height : '47vh',
    borderRadius: "0px"
  };


  const options = {
    disableDefaultUI: true,
    zoomControl: zoom ? false : true,
  };

  const [marker, setMarker] = React.useState({} as any)
  const [center, setCenter] = React.useState({} as any)
  const [myLocaton, setMyLocaton] = React.useState({} as any)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCk55j_rxvh2Xwau4ifeyzl2uSv4W6nbw0',
    libraries: ["places"],
  });

  const [map, setMap] = React.useState(null)

  const mapRef: any = React.useRef(null);
  const onMapLoad = React.useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  const panTo = React.useCallback(({ lat, lng }: any) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  const onMapClick = React.useCallback((e: any) => {
    if (!hidesearch) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
        (results: any, status: any) => {
          if (status === 'OK' && results[0]) {

            let address = results[0].formatted_address


            // if (results[0]?.address_components[results[0]?.address_components?.length - 1]?.types[0] === "country") {
            //   console.log(results[0]?.address_components[results[0]?.address_components?.length - 2]?.long_name);
            //   console.log(results[0]?.address_components);
            // } else {
            //   console.log(results[0]?.address_components[results[0]?.address_components?.length - 3]?.long_name);
            //   console.log(results[0]?.address_components);
            // }

            let newState = results[0]?.address_components[results[0]?.address_components?.length - 1]?.types[0] === "country" ? results[0]?.address_components[results[0]?.address_components?.length - 2]?.long_name : results[0]?.address_components[results[0]?.address_components?.length - 3]?.long_name
 
            updateEvent({
              ...eventdata,
              location: {
                ...eventdata.location,
                locationDetails: address,
                placeIds: newState,
                latlng: e.latLng.lat() + " " + e.latLng.lng()
              }
            })
            updateProduct({
              ...productdata, location: {
                locationDetails: address,
                latlng: e.latLng.lat() + " " + e.latLng.lng(),
                state: newState
              },
              state: newState
            })
            updateAddress({
              ...location,
              locationDetails: address,
              latlng: e.latLng.lat() + " " + e.latLng.lng(),
              state: newState
            })
            updateRental({
              ...rentaldata, location: {
                locationDetails: address,
                latlng: e.latLng.lat() + " " + e.latLng.lng(),
                state: newState
              },
              state: newState
            })

          } else {
            console.error('Error fetching address:', status);
          }
        }
      );

      setMarker({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      })
    }
  }, []);

  useEffect(() => {
    if (latlng) {
      setCenter({
        lat: Number(latlng.split(" ")[0]),
        lng: Number(latlng.split(" ")[1]),
      })
      setMarker({
        lat: Number(latlng.split(" ")[0]),
        lng: Number(latlng.split(" ")[1]),
      })
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () =>
          setCenter({
            lat: 9.0820,
            lng: 8.6753,
          })

      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyLocaton({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        if (hidesearch) {
          setMyLocat({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      }
    );
  }, [])

  const clickHandler = () => {
    if (eventdata.location.latlng) {
      close(false)
    } else {
      toast({
        title: 'Error',
        description: "Add the Location of your event",
        status: 'error',
        isClosable: true,
        duration: 3000,
        position: 'top-right',
      });
    }
  }

  const {
    mainBackgroundColor,
  } = useCustomTheme();

  return (
    <Box width={"full"} bgColor={mainBackgroundColor} >
      <LoadingAnimation loading={!isLoaded} >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          options={options}
          zoom={zoom ? zoom : 14}
          onLoad={onMapLoad}

          onUnmount={onUnmount}
          onClick={onMapClick}>
          {/* <UserLocation panTo={panTo}/>   */}
          {!hidesearch && (
            <MapSearch setMarker={setMarker} center={center} panTo={panTo} />
          )}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        </GoogleMap>
      </LoadingAnimation>
      {!view && (
        <Flex w={"full"} bgColor={mainBackgroundColor} justifyContent={hidesearch ? "between" : "end"} px={"4"} py={"2"} >
          {(hidesearch && !directionsResponse) && (
            <EventDirection latLng={latlng} myLocation={myLocaton} setResult={setDirectionsResponse} />
          )}
          <CustomButton onClick={() => clickHandler()} ml={"auto"} text={hidesearch ? 'Close' : 'Okay'} width={"fit-content"} />
        </Flex>
      )}
    </Box>
  )
}

export default MapComponent
