"use client"
import useCustomTheme from '@/hooks/useTheme'
import { capitalizeFLetter } from '@/utils/capitalizeLetter'
import { textLimit } from '@/utils/textlimiter'
import { Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

export default function DescriptionCard({ description, limit, label, width, ticket }: { description: string, label: string, limit: number, width?: string, ticket?: boolean }) {

    const { secondaryBackgroundColor, mainBackgroundColor } = useCustomTheme()
    const [textSize, setTextSize] = useState(limit)

    return (
        <Flex w={width ?? "full"} flexDir={"column"} bgColor={ticket ? mainBackgroundColor : secondaryBackgroundColor} p={ticket ? "2" : "4"} rounded={"16px"} gap={"2"} >
            {label && (
                <Text fontSize={"15px"} fontWeight={"bold"} >{label}</Text>
            )}
            {!ticket && (
                <Flex
                    fontSize={ticket ? "12px" : "14px"}
                    flexDirection={"column"}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            )}
            {ticket && (
                <Text fontSize={"14px"} >{textLimit(capitalizeFLetter(description), textSize)}{description?.length > limit && (<span role='button' style={{ fontWeight: "700" }} onClick={() => setTextSize((prev) => prev === description?.length ? limit : description?.length)} >{description?.length !== textSize ? "more" : "...less"}</span>)}</Text>
            )}
        </Flex>
    )
}
