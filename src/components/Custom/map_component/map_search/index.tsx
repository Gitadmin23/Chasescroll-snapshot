import { Box, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'
import React from 'react'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { IoSearchOutline } from 'react-icons/io5';
import useEventStore from '@/global-state/useCreateEventState';
import useCustomTheme from '@/hooks/useTheme';
import useProductStore from '@/global-state/useCreateProduct';

interface Props {
    center: any,
    panTo: any,
    setMarker: any
}

let defaultzoom = 8;

let location_address: any = 'Location'

function MapSearch(props: Props) {
    let {
        center,
        panTo,
        setMarker
    } = props


    const [map, SetMap] = React.useState({
        lat: 9.0820,
        lng: 8.6753,
    })

    const [zoom, SetZoom] = React.useState(8)
    const [show, setShow] = React.useState(false)

    const { eventdata, updateEvent } = useEventStore((state) => state);
    const { updateProduct, productdata, updateRental, rentaldata, updateAddress, location } = useProductStore((state) => state);

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: new google.maps.LatLng(center),
            radius: 100 * 1000,
        },
    });

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

    const handleInput = (e: any) => {
        setValue(e.target.value);
        if (e.target.value === '') {
            setShow(false)
        } else {
            setShow(true)
        }
    };

    const handleSelect = async (address: any) => {
        setValue(address, false);
        setShow(false)
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });

            let newState = results[0]?.address_components[results[0]?.address_components?.length - 1]?.types[0] === "country" ? results[0]?.address_components[results[0]?.address_components?.length - 2]?.long_name : results[0]?.address_components[results[0]?.address_components?.length - 3]?.long_name
 

            updateEvent({
                ...eventdata,
                location: {
                    ...eventdata.location,
                    locationDetails: address,
                    placeIds: newState,
                    latlng: lat + " " + lng
                }
            })
            updateProduct({
                ...productdata, location: {
                    locationDetails: address,
                    latlng: lat + " " + lng,
                    state: newState
                },
                state: newState
            })
            updateAddress({
                ...location,
                locationDetails: address,
                latlng: lat + " " + lng,
                state: newState
            })
            updateRental({
                ...rentaldata, location: {
                    locationDetails: address,
                    latlng: lat + " " + lng,
                    state: newState
                },
                state: newState
            })


            setMarker({
                lat: Number(lat),
                lng: Number(lng),
            })
            SetMap({ lat: lat, lng: lng })
            SetZoom(9)
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    React.useEffect(() => {
        center = map
        defaultzoom = zoom
        if (value === '') {
            location_address = 'Location'
        } else {
            location_address = value
        }
    })

    const {
        mainBackgroundColor,
    } = useCustomTheme();

    return (
        <Box w='full' mt={"4"} justifyContent={"center"} display={"flex"} >
            <Box position={"relative"} bg={mainBackgroundColor} w={"70%"} zIndex={"20"} h={"45px"} rounded={"md"} >

                <Box width={"full"} h={"45px"} position={"relative"} >
                    <InputGroup zIndex={"20"} position={"relative"} >
                        <InputLeftElement h={"45px"} pointerEvents='none'>
                            <IoSearchOutline size={"25px"} color='#5D70F9' />
                        </InputLeftElement>
                        <Input value={value} h={"45px"} onChange={handleInput} type='text' borderColor={"brand.chasescrollBlue"} focusBorderColor={'brand.chasescrollBlue'} bgColor={mainBackgroundColor} placeholder='Search your location' />
                    </InputGroup>
                    {show && (
                        <Box width={"full"} bgColor={mainBackgroundColor} maxH={"250px"} overflowY={"auto"} zIndex={"20"} px={"4"} display={"flex"} flexDir={"column"} alignItems={"start"} py={"2"} rounded={"md"} position={"absolute"} mt={"2"} >
                            {/* <SearchComponent home={home} /> */}
                            {status !== "OK" && (
                                <Box w={"full"} textAlign={"center"} as='button' py={"2"} >
                                    Loading...
                                </Box>
                            )}
                            {status === "OK" &&
                                data.map((item: { description: string }, index: any) => {
                                    return (
                                        <Box onClick={() => handleSelect(item?.description)} w={"full"} textAlign={"left"} as='button' bgColor={mainBackgroundColor} py={"2"} key={index} >
                                            {item?.description?.length > 50 ? item?.description?.substring(0, 50) + "..." : item?.description}
                                        </Box>
                                    )
                                })}
                        </Box>
                    )}
                    {show && (
                        <Box onClick={() => setValue("")} bgColor={"black"} opacity={"0.3"} zIndex={"10"} position={"fixed"} inset={"0px"} />
                    )}
                </Box>
                {/* <Combobox onSelect={handleSelect}>
                    <ComboboxInput
                        value={value}
                        style={{ paddingLeft: "16px", display: "flex", justifyContent: "center", height: "45px", width: "100%", borderRadius: "12px" }}
                        onChange={handleInput}
                        disabled={!ready}
                        placeholder="Search your location"
                    />
                    <ComboboxPopover >
                        <ComboboxList>
                            {status === "OK" &&
                                data.map((item: any, index: any) => {
                                    console.log(item);

                                    return (
                                        <ComboboxOption key={index} value={item?.description} />
                                    )
                                })}
                        </ComboboxList>
                    </ComboboxPopover>
                </Combobox> */}
            </Box>
        </Box>
    )
}

export default MapSearch
