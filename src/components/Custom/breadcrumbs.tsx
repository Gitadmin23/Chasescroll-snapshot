"use client" 
import useCustomTheme from "@/hooks/useTheme"
import { IDonationList } from "@/models/donation"
import { IEventType } from "@/models/Event"
import { capitalizeFLetter } from "@/utils/capitalizeLetter"
import { textLimit } from "@/utils/textlimiter"
import { Flex, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { IoIosArrowForward } from "react-icons/io"

export default function BreadCrumbs(
    {
        eventName,
        name
    } : IEventType | IDonationList | any
) {

    const { back } = useRouter()
    const { primaryColor } = useCustomTheme() 

    const clickHandler = () => { 
        back() 
    }

    return (
        <Flex gap={"1"} alignItems={"center"} pb={"3"} >
            <Text cursor={"pointer"} onClick={clickHandler} fontSize={"14px"} color={primaryColor} fontWeight={"500"} >Back</Text>
            <IoIosArrowForward />
            <Text fontSize={"14px"} fontWeight={"500"} >{name ? "Fundraising" : "Event"} details</Text>
            <IoIosArrowForward />
            <Text fontSize={"14px"} fontWeight={"500"} >{textLimit(name ? capitalizeFLetter(name) : capitalizeFLetter(eventName), 20)}</Text>
        </Flex>
    )
}