import MapComponent from '@/components/Custom/MapComponent'
import { IEventType } from '@/models/Event'
import { PaginatedResponse } from '@/models/PaginatedResponse'
import httpService from '@/services/httpService'
import { URLS } from '@/services/urls'
import { Avatar, Box, Button, Container, Flex, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React from 'react'
import { Calendar1, Location } from 'iconsax-reactjs';
import { RESOURCE_URL } from '@/constants'
import ChasescrollBox from '@/components/Custom/ChasescrollBox'
import { DateTime } from 'luxon'
import { capitalizeFLetter } from '@/utils/capitalizeLetter'
import TicketSelection from '@/components/Custom/modals/TicketPurchaseModal/TicketSelection'

interface Props {
    params: {
        id: string
    },
    searchParams: {
        id: string
    }
}

function TicketSalePage({ params, }: Props) {
    const { id } = params;
    const [event, setEvent] = React.useState<IEventType | null>(null);

    const { isLoading, data, isError, error } = useQuery<AxiosResponse<PaginatedResponse<IEventType>>>({
        queryKey: ['get-external-events', id],
        queryFn: () => httpService.get(`${URLS.event}/events`, {
            params: {
                id
            }
        })
    });

    React.useEffect(() => {
        if (!isLoading && !isError && data?.data) {
            const item: PaginatedResponse<IEventType> = data?.data;
            setEvent(item?.content[0]);
        }
    }, [data, isError, isLoading]);

    return (
        <Box w="full" h="full">
            <Container>
                {!isLoading && !isError && data?.data && (
                    <Flex w='full' h="full" spaceX={6} mt="10px">

                        <Box flex={1} h="full">
                            <Box width={'full'} h="500px" mb="10xp" borderWidth={'1px'} borderColor="gray.200" borderRadius={'16px'} overflow={'hidden'}>
                                <Image w="full" h="full" objectFit="cover" src={(RESOURCE_URL as string) + (event?.currentPicUrl as string)} />
                            </Box>

                            <HStack w="auto" h="40px" borderRadius={"full"} spaceX={3} justifyContent={'flex-start'} alignItems={'center'} px={2} bgColor={'gray.100'} mt="20px">
                                <Location size={25} variant='Outline' color="blue" />
                                <Text>{event?.location?.toBeAnnounced ? 'To be announced' : event?.location.locationDetails}</Text>
                            </HStack>

                            <Box w="full" h="full" borderWidth='1px' borderColor="gray.200" p="20px" borderRadius={'16px'} my="20px">

                                <Heading fontSize={'24px'}>{event?.eventName}</Heading>
                                <VStack mt='20px' w="full" alignItems={'flex-start'} spaceY={0} borderRadius={'16px'}>
                                    <Heading fontSize={'20px'}>Event details</Heading>
                                    <Text fontSize={'16px'} mt="0px">{event?.eventDescription}</Text>
                                </VStack>

                                <HStack w="full" h="90px" p={2} borderTopWidth={'1px'} borderTopColor={'gray.200'} borderBottomWidth={'1px'} borderBottomColor={'gray.200'} mt='20px' alignItems={'center'} spaceX={2}>
                                    <ChasescrollBox width='50px' height='50px' borderRadius='10px'>
                                        <Avatar.Root width={'full'} height={'full'} borderWidth="1px" borderColor="#233DF3">
                                            <Avatar.Fallback name={`${event?.createdBy?.firstName} ${event?.createdBy?.lastName}`} />
                                            <Avatar.Image src={`${RESOURCE_URL}${event?.createdBy?.data?.imgMain?.value}`} />
                                        </Avatar.Root>
                                    </ChasescrollBox>
                                    <VStack spaceX={0} spaceY={-2} alignItems={'flex-start'}>
                                        <Text fontFamily={'sans-serif'} fontWeight={700} fontSize={'16px'}>{capitalizeFLetter(event?.createdBy?.firstName)} {capitalizeFLetter(event?.createdBy?.lastName)}</Text>
                                        <Text fontFamily={'sans-serif'} fontWeight={300} fontSize={'14px'}>{capitalizeFLetter(event?.createdBy?.username)}</Text>
                                    </VStack>
                                </HStack>

                                <VStack alignItems={'flex-start'} mt='20px' spaceY={2} w="50%">
                                    <HStack justifyContent={'space-between'} w="full">
                                        <Text>Start Date</Text>
                                        <HStack>
                                            <Calendar1 size={'25px'} color="blue" variant='Outline' />
                                            <Text>{DateTime.fromMillis(event?.startDate || 0).toFormat('dd LLL yyyy') ?? ''} {DateTime.fromMillis(event?.startTime || 0).toFormat('hh:mm a')}</Text>
                                        </HStack>
                                    </HStack>

                                    <HStack justifyContent={'space-between'} w="full">
                                        <Text>End Date</Text>
                                        <HStack>
                                            <Calendar1 size={'25px'} color="blue" variant='Outline' />
                                            <Text>{DateTime.fromMillis(event?.endDate || 0).toFormat('dd LLL yyyy') ?? ''} {DateTime.fromMillis(event?.endTime || 0).toFormat('hh:mm a')}</Text>
                                        </HStack>
                                    </HStack>
                                </VStack>

                            </Box>

                            <Heading fontSize={'16px'} mt="20px">Location and surrounding</Heading>

                            <Button
                                variant={'solid'}
                                width="auto"
                                height="45px"
                                mt='20px'
                                borderRadius={'full'}
                                color="white"
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
                            <Box height={'20px'} />
                            {event?.location?.latlng ? (
                                <MapComponent
                                    lat={parseFloat(event.location.latlng.split(' ')[0])}
                                    lng={parseFloat(event.location.latlng.split(' ')[1])}
                                    width="100%"
                                    height="200px"
                                    zoom={15}
                                    borderRadius="16px"
                                    markerTitle={event?.eventName || 'Event Location'}
                                />
                            ) : (
                                <Box w='full' h="200px" mt='20px' borderRadius={'16px'} bgColor="gray.100"></Box>
                            )}
                        </Box>

                        <Box flex={1} h="full" borderWidth='1px' borderColor="gray.200" p="20px" borderRadius={'16px'}>
                            <TicketSelection />
                        </Box>

                    </Flex>
                )}
            </Container>
        </Box>
    )
}

export default TicketSalePage
