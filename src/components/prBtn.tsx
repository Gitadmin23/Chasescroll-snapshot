"use client"

import useCustomTheme from '@/hooks/useTheme'
import { Button, Flex, Text } from '@chakra-ui/react' 
import React from 'react' 
import { IEventType } from '@/models/Event'
import { useRouter } from 'next/navigation'
import { LANDINGPAGE_URL } from '@/services/urls'

export default function PrBtn({ data }: { data: IEventType}) {

    const { 
        primaryColor, 
    } = useCustomTheme() 

    const router = useRouter()
 
    const clickHandler = () => {
        router.push(`${LANDINGPAGE_URL}/auth?eventId=${data?.id}`)
    }

    return (
        <>
            {(!data?.isOrganizer && data?.affiliates?.length > 0 && data?.affiliates[0]?.percent) && (
                <Flex flexDirection={"column"} gap={"1"} w={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? "full" : "fit-content"}  >
                    {data.eventMemberRole !== "ADMIN" && data.eventMemberRole !== "COLLABORATOR" && (
                        <Text fontSize={["14px", "14px", "14px"]} fontWeight={"600"} >Apply to be a PR</Text>
                    )}
                    {data.eventMemberRole !== "ADMIN" && data.eventMemberRole !== "COLLABORATOR" ? (
                        <Button 
                            // disable={(data?.prStatus === "PENDING" || data?.prStatus === "ACTIVE" || createPr?.isPending) ? true : false}
                            onClick={clickHandler}
                            backgroundColor={[data?.prStatus === "PENDING" ? "#FF9500" : primaryColor, data?.prStatus === "PENDING" ? "#FF9500" : primaryColor, data?.prStatus === "PENDING" ? "#FF9500" : primaryColor]}
                            color={["white", "white", "white"]} borderRadius={"999px"} fontSize={["xs", "xs", "sm"]}
                            px={"4"}
                            width={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? ["90%", "90%", "full", "full"] : ["120px", "120px", "fit-content"]}
                            height={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? "55px" : " 45px "}
                            borderTopRadius={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? ["0px"] : "32px"}
                            borderBottomRightRadius={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? ["0px", "0px", "12px"] : "32px"}
                            h={"40px"}
                            fontWeight={"semibold"}
                            borderBottomLeftRadius={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? "12px" : "32px"} >
                            {data?.prStatus === "PENDING" ? "Pending" : data?.prStatus === "ACTIVE" ? "Already a PR" : `Earn ${data?.affiliates[0]?.percent}%`}
                        </Button>
                    ) : (
                        <Button 
                            // disable={(data?.prStatus === "PENDING" || data?.prStatus === "ACTIVE" || createPr?.isPending) ? true : false}
                            onClick={clickHandler}
                            backgroundColor={[data?.prStatus === "PENDING" ? "#FF9500" : primaryColor, data?.prStatus === "PENDING" ? "#FF9500" : primaryColor, data?.prStatus === "PENDING" ? "#FF9500" : primaryColor]}
                            color={["white", "white", "white"]} borderRadius={"999px"} fontSize={["xs", "xs", "sm"]}
                            px={"4"}
                            width={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? ["90%", "90%", "full", "full"] : ["120px", "120px", "fit-content"]}
                            height={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? "55px" : " 45px "}
                            borderTopRadius={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? ["0px"] : "32px"}
                            h={"40px"}
                            fontWeight={"semibold"}
                            borderBottomRightRadius={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? ["0px", "0px", "12px"] : "32px"}
                            borderBottomLeftRadius={(data.eventMemberRole === "ADMIN" || data.eventMemberRole === "COLLABORATOR") ? "12px" : "32px"} >
                            {data?.prStatus === "PENDING" ? "Pending" : data?.prStatus === "ACTIVE" ? "Already a PR" : `Apply to be a PR - ${data?.affiliates[0]?.percent}%`}
                        </Button>
                    )}

                </Flex>
            )}
        </>
    )
}
