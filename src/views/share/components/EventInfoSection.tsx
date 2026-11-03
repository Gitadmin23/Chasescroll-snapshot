"use client";

import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { IEventType } from "@/models/Event";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import DescriptionCard from "@/components/Custom/description";
import EventCreator from "@/components/Custom/eventCreator";
import EventLocation from "@/components/Custom/eventLocation";
import EventDate from "@/components/Custom/eventDate";
import PrBtn from "@/components/prBtn";
import EventTicketCard from "./EventTicketCard";

interface EventInfoSectionProps {
    event: IEventType;
    isAdmin: boolean;
    showPrBtn: boolean;
    hasTickets: boolean;
    ticketAvailabilityText: string;
    onSelectTicket: () => void;
}

export default function EventInfoSection({
    event,
    isAdmin,
    showPrBtn,
    hasTickets,
    ticketAvailabilityText,
    onSelectTicket,
}: EventInfoSectionProps) {
    return (
        <Flex w="full" flexDir="column" gap="3">
            <Text fontWeight="700" fontSize={["16px", "16px", "24px"]}>
                {event?.eventName ? capitalizeFLetter(event.eventName) : "Event Details"}
            </Text>

            <Flex
                w="full"
                flexDir={["column-reverse", "column-reverse", "column"]}
                gap="2"
            >
                {/* Description: Responsive character limits */}
                <Flex display={["none", "none", "flex"]}>
                    <DescriptionCard
                        limit={1000}
                        label="About This Event"
                        description={event?.eventDescription || ""}
                    />
                </Flex>
                <Flex display={["flex", "flex", "none"]}>
                    <DescriptionCard
                        limit={750}
                        label="About This Event"
                        description={event?.eventDescription || ""}
                    />
                </Flex>

                {/* Creator and Mobile Ticket Card Row */}
                <Flex flexDir={isAdmin ? "column" : "row"} gap="2" w="full">
                    <Flex
                        flex="1"
                        maxW={["130px", "130px", "full"]}
                        alignItems={["start", "start", "center"]}
                        flexDir={["column", "column", "row"]}
                        justifyContent={["start", "start", "space-between"]}
                        gap="3"
                    >
                        <Flex
                            gap="3"
                            alignItems={[
                                isAdmin ? "center" : "start",
                                isAdmin ? "center" : "start",
                                "center",
                            ]}
                            flexDir={[
                                isAdmin ? "row" : "column",
                                isAdmin ? "row" : "column",
                                "row",
                            ]}
                            justifyContent={[
                                isAdmin ? "space-between" : "start",
                                isAdmin ? "space-between" : "start",
                                "space-between",
                            ]}
                        >
                            <EventCreator {...event} />
                            <Flex
                                display={["flex", "flex", "none"]}
                                w="full"
                                flexDir="column"
                                gap="2"
                                mr={isAdmin ? "auto" : "0px"}
                            >
                                {showPrBtn && <PrBtn data={event} />}
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Mobile Ticket Purchase Box */}
                    <Flex
                        display={["flex", "flex", "none"]}
                        maxW={["full", "full", "full", "430px", "430px"]}
                        flex="1"
                        flexDir="column"
                        gap="2"
                        w="full"
                    >
                        {!isAdmin && (
                            <EventTicketCard
                                hasTickets={hasTickets}
                                ticketAvailabilityText={ticketAvailabilityText}
                                onSelectTicket={onSelectTicket}
                                padding="3"
                            />
                        )}
                    </Flex>
                </Flex>
            </Flex>

            {/* Mobile Event Location */}
            <Flex w="full" display={["flex", "flex", "none"]}>
                <EventLocation showLink={true} data={event} limit={50} />
            </Flex>

            {/* Event Dates */}
            <EventDate {...event} />

            {/* Desktop Actions Section */}
            <Flex w="full" justifyContent="space-between" gap="4">
                <Flex
                    display={["none", "none", "flex"]}
                    w="full"
                    flexDir="column"
                    gap="6"
                >
                    {/* Desktop Ticket Purchase Box */}
                    <Flex
                        mt="auto"
                        maxW={["full", "full", "full", "430px", "430px"]}
                        flexDir="column"
                        gap="6"
                        w="full"
                    >
                        {!isAdmin && (
                            <EventTicketCard
                                hasTickets={hasTickets}
                                ticketAvailabilityText={ticketAvailabilityText}
                                onSelectTicket={onSelectTicket}
                                padding="5"
                            />
                        )}
                    </Flex>

                    {showPrBtn && (
                        <Flex w="fit-content">
                            <PrBtn data={event} />
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}

