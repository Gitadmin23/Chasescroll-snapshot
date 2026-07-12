
import useCustomTheme from "@/hooks/useTheme"; 
import { IEventType } from "@/models/Event";
import { textLimit } from "@/utils/textlimiter";
import { Flex, Text } from "@chakra-ui/react";
import { LinkIcon } from "lucide-react";
import { LocationStroke } from "../svg";

export default function EventLocation(
    {
        data,
        limit = 0,
        showLink,
        fontSize
    } :{ data: IEventType | any, limit?: number, showLink: boolean, fontSize?: string}
) { 

    const { secondaryBackgroundColor } = useCustomTheme()

    console.log(data?.location?.locationDetails);
    

    return (
        <Flex w={"full"} gap={"2"} flexDir={"column"} >
            <Flex maxW={showLink ? "600px" : "full"} rounded={"32px"} py={"2"} px={showLink? "3" : "0px"} bgColor={showLink ? secondaryBackgroundColor : "transparent"} w={"full"} gap={showLink ? "2" : "1"}>
                <Flex w={"fit-content"} >
                <LocationStroke />
                </Flex>
                <Text fontSize={fontSize ?? ["12px", "12px", "14px"]} fontWeight={"500"} whiteSpace={"none"} lineBreak={"anywhere"} >{data?.location?.toBeAnnounced ? "To Be Announced" : limit === 0 ? data?.location?.locationDetails : textLimit(data?.location?.locationDetails, limit)}</Text>
            </Flex>
            {(data?.location?.link && showLink)&& (
                <Flex maxW={["400px"]} rounded={"32px"} py={"2"} px={"3"} bgColor={secondaryBackgroundColor} w={"full"} gap={"2"} alignItems={"center"} >
                    <LinkIcon />
                    <Text fontSize={["12px", "12px", "14px"]} fontWeight={"500"} ><a target="_blank" href={data?.location?.link} >Click Me</a></Text>
                </Flex>
            )}
        </Flex>
    )
}