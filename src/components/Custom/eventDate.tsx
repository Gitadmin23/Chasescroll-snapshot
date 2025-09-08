
import useCustomTheme from "@/hooks/useTheme"; 
import { Flex, Text } from "@chakra-ui/react";
import { CalendarIcon } from "../svg";
import { IEventType } from "@/models/Event";
import { dateFormat, timeFormat } from "@/utils/dateFormat";


export default function EventDate(
    {
        startDate, 
        endDate
    } : IEventType
){

    const { primaryColor } = useCustomTheme()

    return( 
        <Flex alignItems={"center"} gap={"3"} >
        <Flex w={"full"} flexDir={"column"} gap={"4"} >
            <Flex gap={"2"} alignItems={"center"} >
                <Text fontWeight={"600"} w={"90px"} >Start Date:</Text>
                <CalendarIcon color={primaryColor} />
                <Text fontSize={["12px", "12px", "14px"]} >{dateFormat(startDate)} {timeFormat(startDate)}</Text>
            </Flex>
            <Flex gap={"2"} alignItems={"center"}>
                <Text fontWeight={"600"} w={"90px"} >End Date:</Text>
                <CalendarIcon color={primaryColor} />
                <Text fontSize={["12px", "12px", "14px"]} >{dateFormat(endDate)} {timeFormat(endDate)}</Text>
            </Flex>
        </Flex>
    </Flex>
    )
}