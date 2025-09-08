'use client';
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
import { Button, Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Text } from "@chakra-ui/react"
import React from 'react'
import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '@/models/PaginatedResponse';
import { IEventType, IProductTypeData } from '@/models/Event';
import MapComponent from '@/components/Custom/MapComponent';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { atom, useAtom, useSetAtom } from 'jotai';
import { activeEventAtom, activeTicketAtom, affiliateIDAtom, ticketurchaseStepAtom } from '@/states/activeTicket';
import TicketPurchaseModal from '@/components/Custom/modals/TicketPurchaseModal/Index';
import { toaster } from "@/components/ui/toaster"
import { STORAGE_KEYS } from '@/utils/StorageKeys';
import EventDate from '@/components/Custom/eventDate';
import EventCreator from '@/components/Custom/eventCreator';
import DescriptionCard from '@/components/Custom/description';
import useCustomTheme from '@/hooks/useTheme';
import EventLocation from '@/components/Custom/eventLocation';
import ProductImageScroller from '@/components/Custom/productImageScroller';
import BreadCrumbs from '@/components/Custom/breadcrumbs';
import EventMesh from '@/components/eventMesh';
import EventDonation from '@/components/eventDonation';
import PrBtn from '@/components/prBtn';

export const currentIdAtom = atom<string | null>(null);
export const showTicketModalAtom = atom(false);
function Event({ id, affiliateID }: { id: string, affiliateID?: string }) {

    const setCurrentId = useSetAtom(currentIdAtom);

    setCurrentId(id);
    const [event, setEvent] = React.useState<IEventType>({} as IEventType);
    const [ticketType, setTicketType] = React.useState<string | null>(null);
    const [tickets, setTickets] = React.useState<IProductTypeData[]>([]);
    const [showModal, setShowModal] = useAtom(showTicketModalAtom);
    const setActiveTicket = useSetAtom(activeTicketAtom);
    const setActiveEvent = useSetAtom(activeEventAtom);
    const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);

    // state 
    const setAffilateID = useSetAtom(affiliateIDAtom);

    if (affiliateID) {
        setAffilateID(affiliateID);
    }

    const { mainBackgroundColor } = useCustomTheme()


    const { isLoading, data, isError, error } = useQuery<AxiosResponse<PaginatedResponse<IEventType>>>({
        queryKey: ['get-external-events', id],
        queryFn: () => httpService.get(`${URLS.event}/events`, {
            params: {
                id
            }
        })
    });

    React.useEffect(() => {
        // INITIALIZE VALUES IF THEY EXIST
        const step = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
        if (step) {
            setCurrentStep(() => {
                return step ? Number(step) : 1;
            });

            if (Number(step) > 1) {
                setShowModal(true);
            }
        }
    }, [])

    React.useEffect(() => {
        if (!isLoading && !isError && data?.data) {
            const item: PaginatedResponse<IEventType> = data?.data;
            setEvent(item?.content[0]);
            setTicketType(item?.content[0]?.productTypeData[0]?.ticketType);
            setTickets(item.content[0]?.productTypeData);

            // set atoms
            setActiveTicket(item?.content[0]?.productTypeData[0]);
            setActiveEvent(item?.content[0]);
        }
    }, [data, isError, isLoading]);

    // Dynamically update the page title when event data loads
    React.useEffect(() => {
        if (event?.eventName) {
            document.title = `Chasescroll | ${event.eventName}`;
        } else {
            document.title = 'Chasescroll | Event';
        }
    }, [event?.eventName]);

    // functions
    const handlePayment = React.useCallback(() => {
        const activeTicket = tickets.filter((item) => item.ticketType === ticketType)[0];
        if (activeTicket) {
            setActiveTicket(activeTicket);
            setShowModal(true);
            setActiveEvent(event);
            return;
        } else {
            toaster.create({
                title: 'Error',
                description: 'No ticket found for this ticket type',
                type: 'error',
            });
        }
    }, [ticketType, tickets])

    const isAdmin = event?.isOrganizer || event?.eventMemberRole === "ADMIN" || event?.eventMemberRole === "COLLABORATOR"

    return (
        <>
            {!isLoading &&
                <Flex w={"full"} bgColor={mainBackgroundColor} flexDir={"column"} gap={"4"} px={["4", "4", "6"]} pb={["400px", "400px", "6"]} py={"6"} >
                    <TicketPurchaseModal isOpen={showModal} onClose={() => setShowModal(false)} type='EVENT' />
                    <BreadCrumbs {...event} />
                    <Flex w={"full"} gap={"4"} flexDir={["column", "column", "row"]} >
                        <Flex flexDir={"column"} w={"full"} gap={"4"} >
                            <Flex w={"full"} pos={"relative"} >
                                <ProductImageScroller rounded={"8px"} height={["340px", "340px", "520px"]} images={event?.picUrls?.length > 0 ? event?.picUrls : [event?.currentPicUrl]} />
                            </Flex>
                            <Flex w={"full"} alignItems={"center"} my={"auto"} display={["none", "none", "flex"]} >
                                <EventLocation showLink={true} data={event} />
                            </Flex>
                        </Flex>

                        <Flex w={"full"} flexDir={"column"} gap={"3"} >
                            <Text fontWeight={"700"} fontSize={["16px", "16px", "24px"]} >{capitalizeFLetter(event?.eventName)}</Text>
                            <Flex w={"full"} flexDir={["column-reverse", "column-reverse", "column"]} gap={"2"} > 
                                <Flex display={["none", "none", "flex"]} >
                                    <DescriptionCard limit={1000} label='About This Event' description={event?.eventDescription} />
                                </Flex>
                                <Flex display={["flex", "flex", "none"]} >
                                    <DescriptionCard limit={750} label='About This Event' description={event?.eventDescription} />
                                </Flex>
                                <Flex flexDir={isAdmin ? "column" : "row"} gap={"2"} w={"full"} >
                                    <Flex w={[isAdmin ? "full" : "fit-content", isAdmin ? "full" : "full", "full"]} alignItems={["start", "start", "center"]} flexDir={["column", "column", "row"]} justifyContent={["start", "start", "space-between"]} gap={"3"} >
                                        <Flex gap={"3"} w={[isAdmin ? "full" : "fit-content", isAdmin ? "full" : "full", "full"]} alignItems={[isAdmin ? "center" : "start", isAdmin ? "center" : "start", "center"]} flexDir={[isAdmin ? "row" : "column", isAdmin ? "row" : "column", "row"]} justifyContent={[isAdmin ? "space-between" : "start", isAdmin ? "space-between" : "start", "space-between"]}  >
                                            <EventCreator {...event} />
                                            <Flex display={["flex", "flex", "none"]} w={"full"} flexDir={"column"} gap={"2"} mr={isAdmin ? "auto" : "0px"} >
                                                {(!event?.isOrganizer && event?.eventMemberRole !== "ADMIN" && event?.eventMemberRole !== "COLLABORATOR") && (
                                                    <PrBtn data={event} />
                                                )}
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                    <Flex display={["flex", "flex", "none"]} maxW={["full", "full", "full", "430px", "430px"]} flexDir={"column"} gap={"2"} w={"full"} >
                                        {((event?.eventMemberRole !== "COLLABORATOR") && !event?.isOrganizer && event?.eventMemberRole !== "ADMIN") && (
                                            <Flex bg={mainBackgroundColor} bottom={"0px"} w={"full"} flexDir={"column"} rounded={"16px"} gap={"3"} p={"3"} borderWidth={"1px"} borderColor={"#DEDEDE"} style={{ boxShadow: "0px 20px 70px 0px #C2C2C21A" }} >
                                                <Flex w={"full"} gap={"2"} flexDir={"column"} >
                                                    <Text fontWeight={"500"} fontSize={["xs", "xs", "sm"]} >See ticket{event?.productTypeData?.length > 1 ? "s" : ""} available for this event</Text>
                                                    <Flex w={"full"} justifyContent={"end"} >
                                                        <Button onClick={handlePayment} w="full" h="40px" fontWeight={"semibold"} borderRadius={'full'} bgColor="chasescrollBlue" color="white">Select Ticket Here</Button>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        )}
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Flex w={"full"} display={["flex", "flex", "none"]} >
                                <EventLocation showLink={true} data={event} />
                            </Flex>
                            <EventDate {...event} />
                            <Flex w={"full"} justifyContent={"space-between"} gap={"4"} >
                                <Flex display={["none", "none", "flex"]} w={"full"} flexDir={"column"} gap={"6"} >
                                    <Flex mt={"auto"} maxW={["full", "full", "full", "317px", "317px"]} flexDir={"column"} gap={"6"} w={"full"} >
                                        {((event?.eventMemberRole !== "COLLABORATOR") && !event?.isOrganizer && event?.eventMemberRole !== "ADMIN") && (
                                            <Flex bg={mainBackgroundColor} zIndex={"50"} pos={["relative"]} bottom={"0px"} w={"full"} flexDir={"column"} rounded={"16px"} gap={"3"} p={"5"} borderWidth={"1px"} borderColor={"#DEDEDE"} style={{ boxShadow: "0px 20px 70px 0px #C2C2C21A" }} >
                                                <Flex w={"full"} gap={"2"} flexDir={"column"} >
                                                    <Text fontWeight={"500"} fontSize={["xs", "xs", "sm"]} >See ticket available for this event</Text>
                                                    <Flex w={"full"} justifyContent={"end"} >
                                                        <Button onClick={handlePayment} w="full" h="40px" fontWeight={"semibold"} borderRadius={'full'} bgColor="chasescrollBlue" color="white">Select Ticket Here</Button>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        )} 
                                    </Flex> 
                                    {(!event?.isOrganizer && event?.eventMemberRole !== "ADMIN" && event?.eventMemberRole !== "COLLABORATOR") && (
                                        <Flex w={"fit-content"} >
                                            <PrBtn data={event} />
                                        </Flex>
                                    )}
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex w={"full"} gap={"4"} flexDir={["column", "column", "row"]} >
                        <Flex w={"full"} flexDir={"column"} gap={"3"} >
                            {/* <EventLocation showLink={true} data={event} /> */}
                            <Flex w={"full"} maxW={"500px"} gap={"2"} flexDir={["column", "column", "column", "column", "column"]} >
                                <Flex w={"full"} display={["flex", "flex", "none"]} >
                                    <EventMesh data={event} />
                                </Flex>
                                <EventDonation item={event} />
                            </Flex>
                            <Flex w={"full"} flexDir={"column"} gap={"2"} >
                                {/* <EventLocation {...event} /> */}
                                {event?.location?.latlng && (
                                    <Flex flexDir={"column"} gap={"2"} >
                                        <Text fontSize={"14px"} fontWeight={"bold"} >Location and surroundings</Text>
                                        <Flex w={"full"} flexDir={"column"} gap={"1"} >
                                            <Button
                                                variant={'solid'}
                                                width="fit"
                                                height="40px"
                                                mt='20px'
                                                borderRadius={'full'}
                                                color="white"
                                                fontWeight={"semibold"}
                                                bgColor="primaryColor"
                                                onClick={() => {
                                                    if (event?.location?.latlng) {
                                                        const [lat, lng] = event.location.latlng.split(' ');
                                                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                                                    }
                                                }}
                                                disabled={!event?.location?.latlng}
                                            >
                                                Direction
                                            </Button>
                                            <MapComponent
                                                lat={parseFloat(event.location.latlng.split(' ')[0])}
                                                lng={parseFloat(event.location.latlng.split(' ')[1])}
                                                width="100%"
                                                height="200px"
                                                zoom={15}
                                                borderRadius="16px"
                                                markerTitle={event?.eventName || 'Event Location'}
                                            />
                                        </Flex>
                                    </Flex>
                                )}
                            </Flex>
                        </Flex>
                        <Flex w={"full"} display={["none", "none", "flex"]} flexDir={"column"} >
                            <EventMesh data={event} />
                            <Flex w={"full"} h={"8"} />
                        </Flex>
                    </Flex>
                </Flex>
            }
        </>
    )
}

export default Event

