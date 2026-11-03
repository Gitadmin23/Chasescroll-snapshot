"use client";

import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import useCustomTheme from "@/hooks/useTheme";

interface EventTicketCardProps {
    hasTickets: boolean;
    ticketAvailabilityText: string;
    onSelectTicket: () => void;
    padding?: string | string[];
}

export default function EventTicketCard({
    hasTickets,
    ticketAvailabilityText,
    onSelectTicket,
    padding = "3",
}: EventTicketCardProps) {
    const { mainBackgroundColor } = useCustomTheme();

    return (
        <Flex
            bg={mainBackgroundColor}
            w="full"
            flexDir="column"
            rounded="16px"
            gap="3"
            p={padding}
            borderWidth="1px"
            borderColor="#DEDEDE"
            style={{ boxShadow: "0px 20px 70px 0px #C2C2C21A" }}
        >
            <Flex w="full" gap="2" flexDir="column">
                <Text fontWeight="500" fontSize={["xs", "xs", "sm"]}>
                    {ticketAvailabilityText}
                </Text>
                <Flex w="full" justifyContent="end">
                    <Button
                        onClick={onSelectTicket}
                        w="full"
                        h="40px"
                        fontWeight="semibold"
                        borderRadius="full"
                        bgColor="chasescrollBlue"
                        color="white"
                        disabled={!hasTickets}
                        opacity={hasTickets ? 1 : 0.6}
                        cursor={hasTickets ? "pointer" : "not-allowed"}
                    >
                        {hasTickets ? "Select Ticket Here" : "No Tickets Available"}
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}

