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
import { IProduct } from '@/models/product';
import { useRouter } from 'next/navigation';

interface IProps {
    service: IProduct;
}

function ProductCard({ service }: IProps) {
    const router = useRouter();

    return (
        <Box onClick={() => router.push(`/share/product?id=${service?.id}`)} cursor='pointer' w='full' h='100%' flex={1} borderWidth={'1px'} borderColor={'gray.200'} _hover={{ bg: 'transparent' }} overflow={'hidden'} borderRadius={'16px'} display={'flex'} flexDir={'column'}>
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
                            <Avatar.Fallback width="full" height="full" name={`${service?.creator?.firstName} ${service?.creator?.lastName}`} />
                            <Avatar.Image
                                src={(RESOURCE_URL as string) + service?.creator?.data?.imgMain?.value as string}
                                w='full'
                                h='full'
                                objectFit='cover'
                            />
                        </Avatar.Root>
                    </ChasescrollBox>
                    <Flex direction='column' ml={2}>
                        <Text fontWeight='medium' fontSize='14px' color='black'>
                            {capitalizeFLetter(textLimit(service?.creator?.firstName, 15))} {capitalizeFLetter(textLimit(service?.creator?.lastName, 10))}
                        </Text>
                        <Text fontWeight='medium' fontSize='12px' color='gray.500'>
                            {service?.createdDate ? new Date(service?.createdDate).toDateString() : 'no Date'}
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            <Flex direction={'column'} w='full' flex={1} px={0} pt={1}>
                <Box p={4} flex={'0.3'}>
                    <Flex alignItems={'center'} justifyContent={'space-between'}>
                        <Text fontWeight='bold' fontSize='24px' color='black' mt={0}>
                            {textLimit(service?.name, 30)}
                        </Text>
                        <Flex justifyContent={'flex-end'}>
                            <Flex width='auto' px="5px" height="30px" borderRadius={'50px'} borderWidth="0.5px" borderColor="#CACACA" justifyContent={'center'} alignItems={'center'}>
                                <Star size={'20px'} variant='Bold' color="gold" />
                                <Text fontWeight='medium' fontSize='14px' color="primaryColor" ml="2px" >{service?.rating ?? 0}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Text fontWeight='normal' fontSize='16px' color='black' my={2}>
                        {textLimit(service?.category.replaceAll('_', ' '), 30)}
                    </Text>
                    <Flex mt={2}>
                        <Location variant='Outline' size="20px" color="#5465E0" />
                        <Text fontWeight='normal' fontSize='14px' color='primaryColor' ml={1}>
                            {service?.location?.locationDetails}
                        </Text>
                    </Flex>
                    <Flex w="full" justifyContent="space-between" alignItems={'center'} >
                        <Text mt={4} fontWeight='semibold' fontSize='18px'>
                            {formatNumber(service?.price)}
                        </Text>

                        <Text mt={4} fontWeight='semibold' fontSize='14px' color={'primaryColor'}>
                            {service?.quantity} available
                        </Text>
                    </Flex>
                </Box>


            </Flex>
            <Flex justifyContent={'center'} alignItems={'center'} borderTopColor={'gray.200'} borderTopWidth={'1px'} h="50px">
                <Text fontSize="16px" fontFamily={'sans-serif'} color="primaryColor">View Product</Text>
            </Flex>
        </Box>
    )
}

export default ProductCard
