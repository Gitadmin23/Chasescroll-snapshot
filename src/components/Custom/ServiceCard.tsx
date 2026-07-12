import { RESOURCE_URL } from '@/constants';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { textLimit } from '@/utils/textlimiter';
import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react'
import ChasescrollBox from './ChasescrollBox';
import { DateTime } from 'luxon';
import { formatNumber } from '@/utils/formatNumber';
import { Location, Star } from 'iconsax-reactjs';
import { IService } from '@/models/Service';

interface IProps {
    service: IService;
}

function ServiceCard({ service }: IProps) {
    return (
        <Box cursor='pointer' w='full' h='auto' borderWidth={'1px'} borderColor={'gray.200'} _hover={{ bg: 'transparent' }} overflow={'hidden'} borderRadius={'16px'}>
            <Box w='full' h='250px' bg='gray.200' borderRadius='0px' position='relative' overflow='hidden'>
                <Image
                    w='full'
                    h='full'
                    position='relative'
                    objectFit='cover'
                    border='0'
                    src={RESOURCE_URL + service?.images[0]}
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
                        <Avatar.Root>
                            <Avatar.Fallback width="full" height="full" name={`${service?.vendor?.firstName} ${service?.vendor?.lastName}`} />
                            <Avatar.Image
                                src={(RESOURCE_URL as string) + service?.vendor?.data?.imgMain?.value as string}
                                w='full'
                                h='full'
                                objectFit='cover'
                            />
                        </Avatar.Root>
                    </ChasescrollBox>
                    <Flex direction='column' ml={2}>
                        <Text fontWeight='medium' fontSize='14px' color='black'>
                            {capitalizeFLetter(textLimit(service?.vendor?.firstName, 15))} {capitalizeFLetter(textLimit(service?.vendor?.lastName, 10))}
                        </Text>
                        <Text fontWeight='medium' fontSize='12px' color='gray.500'>
                            {service?.createdDate ? new Date(service?.createdDate).toDateString() : 'no Date'}
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            <Flex direction={'column'} w='full' h='auto' px={0} pt={4}>
                <Box p={4} flex={'0.3'}>
                    <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text fontWeight='bold' fontSize='24px' color='black' mt={0}>
                            {service?.name}
                        </Text>
                        <Flex justifyContent={'flex-end'}>
                            <Flex width='auto' px="5px" height="30px" borderRadius={'50px'} borderWidth="0.5px" borderColor="#CACACA" justifyContent={'center'} alignItems={'center'} mr="10px">
                                <Text fontWeight='semibold' fontSize='14px' color="#3B54F7" >{service?.totalBooking > 0 ? `${service?.totalBooking} clients served` : 'Ready to serve'}</Text>
                            </Flex>
                            <Flex width='auto' px="5px" height="30px" borderRadius={'50px'} borderWidth="0.5px" borderColor="#CACACA" justifyContent={'center'} alignItems={'center'}>
                                <Star size={'20px'} variant='Bold' color="gold" />
                                <Text fontWeight='medium' fontSize='14px' color="primaryColor" ml="2px" >{service?.rating}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Text fontWeight='normal' fontSize='16px' color='black' mt={0}>
                        {service?.category?.length > 50 ? service?.category?.substring(0, 50).replaceAll('_', ' ') : service?.category.replaceAll('_', ' ')}
                    </Text>
                    <Flex mt={2}>
                        <Location variant='Outline' size="20px" color="#5465E0" />
                        <Text fontWeight='normal' fontSize='14px' color='gray.500' ml={1}>
                            {service.state}
                        </Text>
                    </Flex>
                    <Text mt={4} fontWeight='semibold' fontSize='18px'>
                        {formatNumber(service?.price)}
                    </Text>
                </Box>

                <Flex justifyContent={'center'} alignItems={'center'} borderTopColor={'gray.200'} borderTopWidth={'1px'} h="50px">
                    <Text fontSize="16px" fontFamily={'sans-serif'} color="primaryColor">View Service</Text>
                </Flex>
            </Flex>
        </Box>
    )
}

export default ServiceCard
