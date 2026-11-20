"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
import { IEventType } from "@/models/Event";
import ProductImageScroller from "@/components/Custom/productImageScroller";
import EventLocation from "@/components/Custom/eventLocation";
import ShareButton from "@/components/Custom/ShareButton";

interface EventMediaSectionProps {
    event: IEventType;
    images: string[];
}

export default function EventMediaSection({ event, images }: EventMediaSectionProps) {
    return (
        <Flex flexDir="column" w="full" gap="4">
            <Flex w="full" pos="relative">
                <ProductImageScroller
                    rounded="8px"
                    height={["340px", "340px", "520px"]}
                    images={images}
                />
                <ShareButton itemLabel="Event" />
            </Flex>
            <Flex
                w="full"
                alignItems="center"
                my="auto"
                display={["none", "none", "flex"]}
            >
                <EventLocation showLink={true} data={event} />
            </Flex>
        </Flex>
    );
}
