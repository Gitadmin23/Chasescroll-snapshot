import React from 'react'
import ChasescrollBox from './ChasescrollBox';
import { Location } from 'iconsax-reactjs';
import { IEventType } from '@/models/Event';
import { DateTime } from 'luxon';
import { RESOURCE_URL } from '@/constants';
import { textLimit } from '@/utils/textlimiter';
import { formatNumber } from '@/utils/formatNumber';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { format } from 'timeago.js';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useRouter } from 'next/navigation'


function EventCard({ event }: { event: IEventType }) {
    const router = useRouter();
    return (
        <Box onClick={() => router.push(`/share/event?id=${event?.id}`)} cursor='pointer' w='full' h='auto' borderWidth={'1px'} borderColor={'gray.200'} overflow={'hidden'} borderRadius={'16px'} bgColor="white">
            <Box w='full' h='250px' bg='gray.200' borderRadius='0px' position='relative' overflow='hidden'>
                <Image
                    w='full'
                    h='full'
                    position='relative'
                    objectFit='cover'
                    border='0'
                    src={RESOURCE_URL + event?.currentPicUrl}
                // transition="transform 0.3s ease"
                // _hover={{
                //     transform: 'scale(1.50)'
                // }}
                />
                <Flex
                    w='188px'
                    h='45px'
                    borderRadius='full'
                    position='absolute'
                    left='20px'
                    top='20px'
                    bg='whiteAlpha.600'
                    align='center'
                    px={2}
                >
                    <ChasescrollBox borderWidth='2px' bgColor='lightgrey' borderRadius='30px' width='30px' height='30px' borderColor='transparent'>
                        <Image
                            src={(RESOURCE_URL as string) + event?.createdBy?.data?.imgMain?.value as string}
                            w='full'
                            h='full'
                            objectFit='cover'
                        />
                    </ChasescrollBox>
                    <Flex direction='column' ml={2}>
                        <Text fontWeight='medium' fontSize='14px' color='black' fontFamily={'Raleway'}>
                            {capitalizeFLetter(textLimit(event?.createdBy.firstName, 15))} {capitalizeFLetter(textLimit(event?.createdBy.lastName, 40))}
                        </Text>
                        <Text fontWeight='medium' fontSize='12px' color='gray.500'>
                            {event?.createdDate ? format(new Date(event?.createdDate).toDateString()) : 'no Date'}
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            <Box w='full' h='auto' px={0} pt={4}>
                <Box p={4} flex={'0.3'}>
                    <Text fontWeight='medium' fontSize='20px' color='black' mt={0}>
                        {DateTime.fromMillis(event?.createdDate as any).toFormat("MM DD")}
                    </Text>
                    <Text fontWeight='bold' fontSize='24px' color='black' mt={0}>
                        {event?.eventName?.length > 10 ? event?.eventName.substring(0, 10) : event?.eventName}
                    </Text>
                    <Flex mt={2}>
                        <Location variant='Outline' size="20px" color="#5465E0" />
                        <Text fontWeight='normal' fontSize='14px' color='gray.500' ml={1}>
                            {event?.location?.toBeAnnounced ? "To Be Announced" : textLimit(event?.location?.locationDetails + "", 25)}
                        </Text>
                    </Flex>
                    <Text mt={4} fontWeight='semibold' fontSize='18px'>
                        {formatNumber(event?.minPrice)}
                    </Text>
                </Box>

                <Flex justifyContent={'center'} alignItems={'center'} borderTopColor={'gray.200'} borderTopWidth={'1px'} h="50px">
                    <Text fontSize="16px" fontFamily={'sans-serif'} color="primaryColor">View Event</Text>
                </Flex>
            </Box>
        </Box>
    )
}

export default EventCard
