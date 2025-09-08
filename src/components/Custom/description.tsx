"use client" 
import useCustomTheme from '@/hooks/useTheme' 
import { capitalizeFLetter } from '@/utils/capitalizeLetter'
import { textLimit } from '@/utils/textlimiter'
import { Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

export default function DescriptionCard({ description, limit, label, width } : { description: string, label: string, limit: number, width?: string }) {

    const { secondaryBackgroundColor } = useCustomTheme()
    const [textSize, setTextSize] = useState(limit)

    return ( 
        <Flex w={width ?? "full"} flexDir={"column"} bgColor={secondaryBackgroundColor} p={"4"} rounded={"16px"} gap={"2"} >
            <Text fontSize={"15px"} fontWeight={"bold"} >{label}</Text>
            <Text fontSize={"14px"} >{textLimit(capitalizeFLetter(description), textSize)}{description?.length > limit && (<span role='button' style={{ fontWeight: "700" }} onClick={() => setTextSize((prev) => prev === description?.length ? limit : description?.length)} >{description?.length !== textSize ? "more" : "...less"}</span>)}</Text>
        </Flex>
    )
}
