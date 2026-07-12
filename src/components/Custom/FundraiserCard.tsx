import { RESOURCE_URL } from '@/constants';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { textLimit } from '@/utils/textlimiter';
import { AbsoluteCenter, Avatar, Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react'
import ChasescrollBox from './ChasescrollBox';
import { formatNumber } from '@/utils/formatNumber';
import { IDonationList } from '@/models/donation';
import { ProgressCircle } from "@chakra-ui/react"
import { useRouter } from 'next/navigation';

interface IProps {
    fundraiser: IDonationList;
}

function FundraiserCard({ fundraiser }: IProps) {
    const router = useRouter();

    return (
        <Box onClick={() => router.push(`/share/fundraiser?id=${fundraiser?.id}`)} cursor='pointer' w='full' h='auto' borderWidth={'1px'} borderColor={'gray.200'} _hover={{ bg: 'transparent' }} overflow={'hidden'} borderRadius={'16px'}>
            <Box w='full' h='250px' bg='gray.200' borderRadius='0px' position='relative' overflow='hidden'>
                <Image
                    w='full'
                    h='full'
                    position='relative'
                    objectFit='cover'
                    border='0'
                    src={RESOURCE_URL + fundraiser?.bannerImage}
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
                            <Avatar.Fallback width="full" height="full" name={`${fundraiser?.user?.firstName} ${fundraiser?.user?.lastName}`} />
                            <Avatar.Image
                                src={(RESOURCE_URL as string) + fundraiser?.user?.data?.imgMain?.value as string}
                                w='full'
                                h='full'
                                objectFit='cover'
                            />
                        </Avatar.Root>
                    </ChasescrollBox>
                    <Flex direction='column' ml={2}>
                        <Text fontWeight='medium' fontSize='14px' color='black'>
                            {capitalizeFLetter(textLimit(fundraiser?.user?.firstName, 15))} {capitalizeFLetter(textLimit(fundraiser?.user?.lastName, 10))}
                        </Text>
                        <Text fontWeight='medium' fontSize='12px' color='gray.500'>
                            {fundraiser?.createdDate ? new Date(fundraiser?.createdDate).toDateString() : 'no Date'}
                        </Text>
                    </Flex>
                </Flex>
            </Box>

            <Flex direction={'row'} justifyContent={'space-between'} w='full' h='auto' px={4} pt={4} pb={4}>
                <Flex flexDirection={'column'} alignItems={'flex-start'}>
                    <Text fontWeight='normal' fontSize='14px' color='gray' mt={0}>
                        Fundraiser Title
                    </Text>
                    <Text fontWeight='bold' fontSize='16px' color='black' mt={0}>
                        {fundraiser?.name}
                    </Text>
                    <Flex justifyContent={'flex-start'} flexDir={'column'} mt={2}>
                        <Text fontWeight='normal' fontSize='14px' color='gray' mt={0}>
                            Amount Raised
                        </Text>
                        <Text fontWeight='bold' fontSize='16px' color='black' mt={0}>
                            {formatNumber(fundraiser?.total)}
                        </Text>
                    </Flex>
                </Flex>


                <Flex flexDirection={'column'} alignItems={'flex-end'}>
                    <Text fontWeight='normal' fontSize='14px' color='gray' mt={0}>
                        Target
                    </Text>
                    <Text fontWeight='bold' fontSize='16px' color='black' mt={0} mb={4}>
                        {formatNumber(fundraiser?.goal)}
                    </Text>
                    <ProgressCircle.Root value={(fundraiser?.total / fundraiser?.goal) * 100}>
                        <ProgressCircle.Circle css={{ "--thickness": "4px" }}>
                            <ProgressCircle.Track />
                            <ProgressCircle.Range stroke={'primaryColor'} />
                        </ProgressCircle.Circle>
                        <AbsoluteCenter>
                            <ProgressCircle.ValueText />
                        </AbsoluteCenter>
                    </ProgressCircle.Root>
                </Flex>
            </Flex>
        </Box>
    )
}

export default FundraiserCard
