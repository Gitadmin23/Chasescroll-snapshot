"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
import { IEventType } from "@/models/Event";
import EventMesh from "@/components/eventMesh";
import EventDonation from "@/components/eventDonation";
import EventMapSection from "./EventMapSection";

interface EventBottomSectionProps {
    event: IEventType;
    mapCoordinates: { lat: number; lng: number } | null;
}

export default function EventBottomSection({
    event,
    mapCoordinates,
}: EventBottomSectionProps) {
    return (
        <Flex w="full" gap="4" flexDir={["column", "column", "row"]}>
            <Flex w="full" flexDir="column" gap="3">
                <Flex
                    w="full"
                    maxW="500px"
                    gap="2"
                    flexDir={["column", "column", "column", "column", "column"]}
                >
                    <Flex w="full" display={["flex", "flex", "none"]}>
                        <EventMesh data={event} />
                    </Flex>
                    <EventDonation item={event} />
                </Flex>

                <EventMapSection
                    eventName={event?.eventName}
                    coordinates={mapCoordinates}
                />
            </Flex>

            <Flex
                w="full"
                display={["none", "none", "flex"]}
                flexDir="column"
            >
                <EventMesh data={event} />
                <Flex w="full" h="8" />
            </Flex>
        </Flex>
    );
}

