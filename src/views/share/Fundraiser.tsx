'use client';
import { IDonationList } from '@/models/donation';
import { PaginatedResponse } from '@/models/PaginatedResponse';
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
import { Avatar, Box, Button, Container, Flex, Heading, HStack, Skeleton, VStack, Image, Text, ProgressCircle, AbsoluteCenter } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Head from 'next/head'
import React from 'react'
import ChasescrollBox from '@/components/Custom/ChasescrollBox';
import { RESOURCE_URL } from '@/constants';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { ArrowLeft2, Calendar1, ArrowDown2 } from 'iconsax-reactjs';
import { DateTime } from 'luxon';
import CustomText from '@/components/Custom/CustomText';
import { useAtom, useSetAtom } from 'jotai';
import { activeFundRaiserAtom } from '@/states/activeFundraiser';
import FundRaiserModal from '@/components/Custom/modals/FundRaiserModal/Index';
import { formatNumber } from '@/utils/formatNumber';
import { STORAGE_KEYS } from '@/utils/StorageKeys';
import { ticketurchaseStepAtom } from '@/states/activeTicket';
import useCustomTheme from '@/hooks/useTheme';
import BreadCrumbs from '@/components/Custom/breadcrumbs';
import { CalendarIcon } from '@/components/svg';
import { dateFormat, timeFormat } from '@/utils/dateFormat';
import DescriptionCard from '@/components/Custom/description';
import DonationGraph from '@/components/donationGraph';
import ProductImageScroller from '@/components/Custom/productImageScroller';
import { textLimit } from '@/utils/textlimiter';
import GetCreatorData from '@/components/getCreatorData';

function Fundraiser({ id }: { id: string }) {

    const router = useRouter();
    const session = useSession();
    const setFundRaiser = useSetAtom(activeFundRaiserAtom);
    const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);
    const {
        mainBackgroundColor,
        primaryColor,
        borderColor
    } = useCustomTheme()

    const [event, setEvent] = React.useState<IDonationList | any>(null);
    const [showModal, setShowModal] = React.useState(false);


    const { isLoading, data, isError, error } = useQuery({
        queryKey: [`get-external-fundraiser-by-id-${id}`],
        queryFn: () => httpService.get(`${URLS.fundraiser}/search`, {
            params: {
                id
            }
        })
    })

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
            const item: PaginatedResponse<IDonationList> = data?.data;
            setEvent(item?.content[0]);
            setFundRaiser(item?.content[0]);
        }
    }, [data, isError, isLoading]);

    // Dynamically update the page title when event data loads
    React.useEffect(() => {
        if (event?.name) {
            document.title = `Fundraiser | ${event.name}`;
        } else {
            document.title = 'Fundraiser | Fundraiser';
        }
    }, [event?.name]);

    return (
        // <Box w="full" h="full" p={['0px', '0px', 6, 6]}>
        //     <FundRaiserModal isOpen={showModal} onClose={() => setShowModal(false)} type='FUNDRAISER' />
        //     <Head>
        //         <title>Fundraiser | {event?.name || 'Event'}</title>
        //     </Head>
        //     <Container maxW={['100%', '100%', '70%', '70%']} p="10px">
        //         <HStack alignItems={'center'} mb='20px'>
        //             <ArrowLeft2 onClick={() => router.back()} cursor={'pointer'} variant='Outline' size='30px' />
        //             <Heading>Fundraising</Heading>
        //             {!isLoading && !isError && (
        //                 <Heading color='primaryColor'> / {event?.name}</Heading>
        //             )}
        //         </HStack>
        //         {!isLoading && !isError && data?.data && (
        //             <Flex w='full' h="full" spaceX={[1, 1, 6, 6]} mt="10px" direction={['column', 'column', 'row', 'row']}>
        //                 <Box flex={1} h="full">
        //                     <Box width={'full'} h="500px" mb="10xp" borderWidth={'1px'} borderColor="gray.200" borderRadius={'16px'} overflow={'hidden'}>
        //                         <Image w="full" h="full" objectFit="cover" src={(RESOURCE_URL as string) + (event?.bannerImage as string)} />
        //                     </Box>
        //                 </Box>

        //                 <Box flex={1} h="full" mt={['20px', '20px', '0px', '0px']} borderWidth='0px' borderColor="gray.200" p={["0px", "0px", "20px", "20px"]} borderRadius={'16px'}>
        //                     <Heading fontSize={'28px'}>{event?.name}</Heading>
        //                     <HStack w="full" h="auto" p="10px" justifyContent={'space-between'} mt='10px' borderWidth={'1px'} borderColor="gray.200" borderRadius="16px">
        //                         <VStack>
        //                             <CustomText type='MEDIUM' fontSize={'16px'} text="Target" textAlign={'center'} width={'auto'} color="black" />
        //                             <CustomText type='REGULAR' fontSize={'14px'} color='black' text={String(formatNumber(event?.goal || 0))} textAlign={'center'} width={'auto'} />
        //                         </VStack>

        //                         <VStack alignItems={'center'}>
        //                             <CustomText type='MEDIUM' fontSize={'16px'} text="Raised" textAlign={'center'} width={'auto'} color="black" />
        //                             <CustomText type='REGULAR' fontSize={'14px'} color='black' text={String(formatNumber(event?.total) || 0)} textAlign={'center'} width={'auto'} />
        //                         </VStack>

        //                         <ProgressCircle.Root value={(event?.total as number / ((event?.goal as number || 0) || 1)) * 100} size={'lg'}>
        //                             <ProgressCircle.Circle css={{ "--thickness": "4px" }}>
        //                                 <ProgressCircle.Track />
        //                                 <ProgressCircle.Range stroke={'primaryColor'} />
        //                             </ProgressCircle.Circle>
        //                             <AbsoluteCenter>
        //                                 <ProgressCircle.ValueText />
        //                             </AbsoluteCenter>
        //                         </ProgressCircle.Root>
        //                     </HStack>

        //                     <VStack mt='20px' w="full" alignItems={'flex-start'} spaceY={0} p='10px' borderRadius={'16px'} bgColor="gray.100" >
        //                         <Heading fontSize={'16px'}>Fundraiser details</Heading>
        //                         <Text fontSize={'14px'} mt="0px">{event?.description}</Text>
        //                     </VStack>

        //                     <HStack w="full" h="90px" p={2} borderRadius={'16px'} bgColor="gray.100" mt='10px' alignItems={'center'} spaceX={2}>
        //                         <ChasescrollBox width='50px' height='50px' borderRadius='10px' bgColor='lightgrey'>
        //                             <Avatar.Root width={'full'} height={'full'}>
        //                                 <Avatar.Fallback name={`${event?.createdBy?.firstName} ${event?.createdBy?.lastName}`} />
        //                                 <Avatar.Image src={`${RESOURCE_URL}${event?.createdBy?.data?.imgMain?.value}`} />
        //                             </Avatar.Root>
        //                         </ChasescrollBox>
        //                         <VStack spaceX={0} spaceY={-2} alignItems={'flex-start'}>
        //                             <Text fontFamily={'sans-serif'} fontWeight={700} fontSize={'16px'}>{capitalizeFLetter(event?.createdBy?.firstName)} {capitalizeFLetter(event?.createdBy?.lastName)}</Text>
        //                             <Text fontFamily={'sans-serif'} fontWeight={300} fontSize={'14px'}>{capitalizeFLetter(event?.createdBy?.username)}</Text>
        //                         </VStack>
        //                     </HStack>

        //                     <VStack alignItems={'flex-start'} mt='20px' spaceY={2} w={["100%", "100%", "50%", "50%"]}>
        //                         <HStack justifyContent={'space-between'} w="full">
        //                             <Text>End Date</Text>
        //                             <HStack>
        //                                 <Calendar1 size={'25px'} color="blue" variant='Outline' />
        //                                 <Text>{DateTime.fromMillis(event?.endDate || 0).toFormat('dd LLL yyyy') ?? ''} {DateTime.fromMillis(event?.endDate || 0).toFormat('hh:mm a')}</Text>
        //                             </HStack>
        //                         </HStack>

        //                         <Button w="full" h="60px" borderRadius={'full'} color="white" bgColor="primaryColor" onClick={() => {
        //                             setFundRaiser(event);
        //                             setShowModal(true)
        //                         }}>Donate</Button>

        //                     </VStack>

        //                 </Box>
        //             </Flex>
        //         )}

        //         {isLoading && (
        //             <Flex w='full' h="full" spaceX={[0, 0, 6, 6]} mt="10px" flexDirection={['column', 'column', 'row', 'row']}>
        //                 <Box flex={1} h="full">
        //                     <Skeleton w="full" h="500px" borderRadius={'16px'} mb='10px' />
        //                     <Skeleton w="full" h="150px" mb="5px" borderRadius={'16px'} />
        //                 </Box>
        //                 <Box flex={1} h="full">
        //                     <Skeleton w="full" h="50px" mb="5px" borderRadius={'8px'} />
        //                     <Skeleton w="full" h="50px" mb="5px" borderRadius={'8px'} />
        //                 </Box>
        //             </Flex>
        //         )}
        //     </Container>
        // </Box>

        <Flex w={"full"} bgColor={mainBackgroundColor} flexDir={"column"} gap={"4"} px={["4", "4", "6"]} pb={["400px", "400px", "6"]} py={"6"} >
            <FundRaiserModal isOpen={showModal} onClose={() => setShowModal(false)} type='FUNDRAISER' />
            <BreadCrumbs {...event} />

            <Flex w={"full"} gap={"4"} flexDir={["column", "column", "row"]} >
                <Flex flexDir={"column"} w={"full"} gap={"4"} >
                    <ProductImageScroller rounded={"8px"} height={["340px", "340px", "520px"]} images={[event?.bannerImage]} />
                </Flex>

                <Flex w={"full"} flexDir={"column"} gap={"3"} >
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"} >
                        <Text fontWeight={"700"} fontSize={["16px", "16px", "24px"]} >{textLimit(capitalizeFLetter(event?.name), 70)}</Text>
                    </Flex>
                    <Flex display={["none", "none", "flex"]} >
                        <DonationGraph rounded='16px' item={event} />
                    </Flex>
                    <Flex display={["flex", "flex", "none"]} >
                        <DonationGraph rounded='16px' isDonation={true} item={event} />
                    </Flex>
                    <Flex w={"full"} flexDir={["column-reverse", "column-reverse", "column"]} gap={"2"} >
                        <DescriptionCard limit={200} label='Fundraiser Details' description={event?.description + ""} />
                        <Flex w={"full"} gap={"2"} flexDirection={"row"} >
                            <Flex w={["fit-content", "fit-content", "full"]} >
                                <GetCreatorData userData={event?.createdBy} data={event} donation={true} />
                            </Flex>

                            <Flex display={["flex", "flex", "none"]} justifyContent={"end"} flex={"1"} >
                                <Flex bgColor={mainBackgroundColor} w={["full", "full", "full", "450px"]} maxW={["200px"]} shadow={"lg"} borderWidth={"1px"} borderColor={borderColor} rounded={"16px"} flexDir={"column"} overflowX={"hidden"} gap={"3"} p={["3", "3", "5"]}  >
                                    {/* <Text fontSize={"18px"} fontWeight={"600"} >Click to Donate</Text> */}
                                    <Button w="full" h="45px" px={"7"} fontWeight={"semibold"} borderRadius={'full'} color="white" bgColor="primaryColor" onClick={() => {
                                        setFundRaiser(event);
                                        setShowModal(true)
                                    }}>Donate</Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex gap={"2"} alignItems={"center"}>
                        <Text fontWeight={"600"} w={"80px"} >End Date</Text>
                        <CalendarIcon color={primaryColor} />
                        <Text fontSize={["12px", "12px", "14px"]} >{dateFormat(event?.endDate)} {timeFormat(event?.endDate)}</Text>
                    </Flex>
                    <Flex w={"full"} justifyContent={"end"} >
                        <Flex maxW={"600px"} display={["none", "none", "flex"]} >
                            <Flex insetX={"6"} bottom={["14", "14", "0px", "0px", "0px"]} pos={["fixed", "fixed", "relative", "relative"]} w={["auto", "auto", "full", "fit-content"]} display={["none", "none", "flex"]} zIndex={"50"} flexDir={"column"} gap={"4"} pb={"6"} px={["0px", "0px", "6", "6"]} >
                                {/* <DonationPayment data={item} /> */}

                                <Flex bgColor={mainBackgroundColor} w={["full", "full", "full", "450px"]} maxW={["250px"]} shadow={"lg"} borderWidth={"1px"} borderColor={borderColor} rounded={"16px"} flexDir={"column"} overflowX={"hidden"} gap={"3"} p={["3", "3", "5"]}  >
                                    {/* <Text fontSize={"18px"} fontWeight={"600"} >Click to Donate</Text> */}
                                    <Button w="full" h="45px" px={"7"} fontWeight={"semibold"} borderRadius={'full'} color="white" bgColor="primaryColor" onClick={() => {
                                        setFundRaiser(event);
                                        setShowModal(true)
                                    }}>Donate</Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Fundraiser
