"use client";

import React from "react";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import useCustomTheme from "@/hooks/useTheme";

interface EventStatusViewProps {
    type: "loading" | "error";
    onRetry?: () => void;
}

export default function EventStatusView({ type, onRetry }: EventStatusViewProps) {
    const { mainBackgroundColor } = useCustomTheme();

    if (type === "loading") {
        return (
            <Flex
                w="full"
                minH="60vh"
                alignItems="center"
                justifyContent="center"
                flexDir="column"
                gap="3"
                bgColor={mainBackgroundColor}
            >
                <Spinner size="xl" color="primaryColor" />
                <Text fontSize="sm" color="gray.500">
                    Loading event details...
                </Text>
            </Flex>
        );
    }

    return (
        <Flex
            w="full"
            minH="60vh"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            gap="4"
            px="4"
            bgColor={mainBackgroundColor}
        >
            <Text fontSize="xl" fontWeight="bold">
                Event Not Found
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center" maxW="400px">
                This event may no longer be available or there was a problem loading it.
            </Text>
            {onRetry && (
                <Button
                    borderRadius="full"
                    bgColor="chasescrollBlue"
                    color="white"
                    px="6"
                    onClick={onRetry}
                >
                    Try Again
                </Button>
            )}
        </Flex>
    );
}

