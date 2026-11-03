"use client";

import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import MapComponent from "@/components/Custom/MapComponent";

interface EventMapSectionProps {
    eventName?: string;
    coordinates: { lat: number; lng: number } | null;
}

export default function EventMapSection({ eventName, coordinates }: EventMapSectionProps) {
    if (!coordinates) return null;

    const handleOpenDirections = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
            "_blank"
        );
    };

    return (
        <Flex flexDir="column" gap="2">
            <Text fontSize="14px" fontWeight="bold">
                Location and surroundings
            </Text>
            <Flex w="full" flexDir="column" gap="1">
                <Button
                    variant="solid"
                    width="fit-content"
                    height="40px"
                    mt="20px"
                    borderRadius="full"
                    color="white"
                    fontWeight="semibold"
                    bgColor="primaryColor"
                    onClick={handleOpenDirections}
                >
                    Direction
                </Button>
                <MapComponent
                    lat={coordinates.lat}
                    lng={coordinates.lng}
                    width="100%"
                    height="200px"
                    zoom={15}
                    borderRadius="16px"
                    markerTitle={eventName || "Event Location"}
                />
            </Flex>
        </Flex>
    );
}

