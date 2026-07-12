import { Box } from '@chakra-ui/react'
import React from 'react'
import { MdMyLocation } from 'react-icons/md'

interface Props {
    panTo: any
}

function UserLocation(props: Props) {
    const {
        panTo
    } = props

    return (
        <Box as='button' position={"absolute"} zIndex={"20"} w={"10"} h={"10"} display={"flex"} rounded={"md"} justifyContent={"center"} alignItems={"center"}
            style={{ marginLeft: '46.4vw', marginTop: '22.5vh' }}
            onClick={() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        panTo({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    () => null
                );
            }} >
            <MdMyLocation size='23' className=' text-gray-800' />
        </Box>
    )
}

export default UserLocation
