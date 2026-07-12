"use client"
import { Avatar, Box, Flex, Text } from '@chakra-ui/react' 
import useCustomTheme from '@/hooks/useTheme' 
import { IEventType } from '@/models/Event'
import { capitalizeFLetter } from '@/utils/capitalizeLetter'
import { textLimit } from '@/utils/textlimiter'
import { RESOURCE_URL } from '@/constants'

export default function EventCreator(props: IEventType) {

    const {
        createdBy, 
    } = props

    const isAdmin = props?.isOrganizer || props?.eventMemberRole === "ADMIN" || props?.eventMemberRole === "COLLABORATOR"

    const {
        mainBackgroundColor,
        secondaryBackgroundColor
    } = useCustomTheme();

    return (
        <Flex w={["130px", "fit-content", isAdmin ? "full" : "full"]} gap={"6"} bgColor={[mainBackgroundColor, mainBackgroundColor, secondaryBackgroundColor]} rounded={"64px"} alignItems={["center"]} h={["fit-content", "fit-content"]} px={["0px", "0px", "4"]} py={["0px", "0px", "3"]} >
            <Flex position={"relative"} border={"0px solid #CDD3FD"} rounded={"full"} alignItems={"center"} gap={"3"} >
                <Flex width={"fit-content"} position={"relative"} >
                    <Avatar.Root size={"md"} rounded={"full"} roundedTopRight={"0px"} >
                        <Avatar.Fallback rounded={"full"} roundedTopRight={"0px"} name={`${createdBy?.firstName} ${createdBy?.lastName}`} />
                        <Avatar.Image rounded={"full"} roundedTopRight={"0px"} src={`${RESOURCE_URL}${createdBy?.data?.imgMain?.value}`} />
                    </Avatar.Root> 
                </Flex>
                <Flex display={["none", "none", "flex"]} flexDir={"column"} >
                    <Text textAlign={"left"} fontWeight={"medium"} >{capitalizeFLetter(createdBy?.firstName) + " " + capitalizeFLetter(createdBy?.lastName)}</Text>
                    {/* <Text textAlign={"left"} fontWeight={"medium"} fontSize={"12px"} >{textLimit(capitalizeFLetter(createdBy?.firstName) + " " + capitalizeFLetter(createdBy?.lastName), 10)}</Text> */}
                    <Text textAlign={"left"} mt={"-2px"} fontSize={["13px", "13px", "sm"]} >{createdBy?.username?.includes("@gmail") ? textLimit(createdBy?.username, 4) : textLimit(createdBy?.username, 10)}</Text>
                </Flex>

                <Flex display={["flex", "flex", "none"]} flexDirection={"column"} >
                    {/* <Text textAlign={"left"} display={["none", "block"]} fontWeight={"medium"} >{capitalizeFLetter(createdBy?.firstName) + " " + capitalizeFLetter(createdBy?.lastName)}</Text> */}
                    <Text textAlign={"left"} fontWeight={"medium"} fontSize={"12px"} >{textLimit(capitalizeFLetter(createdBy?.firstName) + " " + capitalizeFLetter(createdBy?.lastName), 10)}</Text>
                    <Text textAlign={"left"} mt={"-2px"} fontSize={["13px", "13px", "sm"]} >{createdBy?.username?.includes("@gmail") ? textLimit(createdBy?.username, 4) : textLimit(createdBy?.username, 10)}</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}
