import useCustomTheme from '@/hooks/useTheme'
import { Box, Button, Flex, Image, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import usePr from '@/hooks/usePr'
import { IoClose } from 'react-icons/io5'
import { useRouter } from 'next/navigation' 
import { useMutation, useQuery } from '@tanstack/react-query' 
import { URLS } from '@/services/urls'
import { IPinnedFundrasier } from '@/models/PinnedFundraiser'
import { IPinnedProduct } from '@/models/PinnedProduct'
import { IEventType } from '@/models/Event'
import { IDonationList } from '@/models/donation'
import httpService from '@/services/httpService'
import { capitalizeFLetter } from '@/utils/capitalizeLetter'
import { textLimit } from '@/utils/textlimiter'
import ModalLayout from './Custom/modal_layout'
import { RESOURCE_URL } from '@/constants'
import DonationGraph from './donationGraph'

export default function EventDonation({ checkbox, item }: { checkbox?: boolean, item: IEventType }) {

    const { borderColor, bodyTextColor, secondaryBackgroundColor, mainBackgroundColor, primaryColor } = useCustomTheme()
    const router = useRouter()

    const [pinnedFundraiser, setPinnedFundraiser] = React.useState<IPinnedFundrasier[]>([]);
    const [pinnedProducts, setPinnedProducts] = React.useState<IPinnedProduct[]>([]);
    
    const [eventData, setEventData] = useState({} as {
        "id": string,
        "createdDate": number,
        "lastModifiedBy": string,
        "createdBy": string,
        "lastModifiedDate": number,
        "isDeleted": boolean,
        "status": string,
        "statusCode": number,
        "returnMessage": string,
        "user": string,
        "fundRaiser": IDonationList,
        "eventID": string
    })

    // const { deleteFundraising, open, setOpen } = usePr() 


    // const { data, isLoading } = useFetchData<any>({
    //     name: "all-donation", endpoint: `/pinned-fundraisers/get-pinned-event-fundraising/${item?.id}`, id: item?.id, params: {
    //         id: item?.id
    //     }
    // }); 


    const { isLoading: fundRaiserLoading, data: fundRaiserData, isError: fundRaiserError } = useQuery({
        queryKey: [`Get-pinned-fundraisers-${item?.id}`],
        queryFn: () => httpService.get(`${URLS.pinned_fundraiser}/get-pinned-event-fundraising/${item?.id}`, {

        })
    });

    console.log(fundRaiserData);

    React.useEffect(() => {
        if (!fundRaiserLoading && !fundRaiserError && fundRaiserData?.data) {
            setPinnedFundraiser(fundRaiserData?.data);
        }
    }, [fundRaiserLoading, fundRaiserData, fundRaiserError])

    // const removeHandler = () => {
    //     deleteFundraising?.mutate(data[0]?.id + "")
    // }

    // const openHandler = (e: any) => {
    //     e.stopPropagation()
    //     setOpen(true)
    // }

    const clickHandler = (item: any) => {
        router?.push('/share/fundraiser/' + item)
    } 

    return ( 
        <Flex w={"full"} >
            {!fundRaiserLoading && !fundRaiserError && pinnedFundraiser?.length > 0 && (
                <Flex flexDir={"column"} w={"full"} gap={"2"} display={(pinnedFundraiser[0]?.fundRaiser?.name || item?.isOrganizer) ? "flex" : "none"} >
                    <Text fontSize={"14px"} fontWeight={"500"} >{item?.isOrganizer ? "Get Support for your Event" : "Fundraising available"}</Text>
                    {(pinnedFundraiser[0]?.fundRaiser?.name) && (
                        <Flex bgColor={mainBackgroundColor} pos={"relative"} role="button" display={pinnedFundraiser[0]?.fundRaiser?.name ? "flex" : "none"} flexDir={["row"]} w={"full"} rounded={"8px"} gap={["2", "2", "2"]} borderWidth={"1px"} borderColor={borderColor} px={["2", "2", "3"]} h={["auto", "auto", "130px"]} py={"2"} alignItems={"center"} >
                            <Flex onClick={() => clickHandler(pinnedFundraiser[0]?.fundRaiser?.id)} w={"fit-content"} >
                                <Flex w={["80px", "80px", "150px"]} height={["80px", "80px", "100px"]} bgColor={secondaryBackgroundColor} rounded={"8px"} borderWidth={"1px"} borderColor={borderColor} >
                                    <Image rounded={"8px"} objectFit="cover" alt={pinnedFundraiser[0]?.fundRaiser?.name} width={"full"} height={["80px", "80px", "100px"]} src={RESOURCE_URL + pinnedFundraiser[0]?.fundRaiser?.bannerImage} />
                                </Flex>
                            </Flex>
                            <Flex onClick={() => clickHandler(pinnedFundraiser[0]?.fundRaiser?.id)} w={"full"} pos={"relative"} flexDir={"column"} gap={2} pr={"3"} >
                                <Flex w={"full"} justifyContent={"space-between"} gap={"3"} alignItems={"center"} >
                                    <Flex flexDir={"column"} >
                                        <Text fontSize={["10px", "10px", "12px"]} color={bodyTextColor} >Fundraising</Text>
                                        <Text fontWeight={"600"} fontSize={["12px", "12px", "14px"]} >{textLimit(capitalizeFLetter(pinnedFundraiser[0]?.fundRaiser?.name), 30)}</Text>
                                    </Flex>
                                    {/* <ShareEvent newbtn={true} showText={false} size='20px' data={pinnedFundraiser[0]?.fundRaiser} id={pinnedFundraiser[0]?.fundRaiser?.id} type="DONATION" eventName={textLimit(pinnedFundraiser[0]?.fundRaiser?.name, 17)} /> */}
                                </Flex> 
                                <DonationGraph item={pinnedFundraiser[0]?.fundRaiser} IsEvent={true} />
                            </Flex>
                                <Box w={["45px", "45px", "70px"]} pos={"relative"} >
                                    <Box w={["fit-content"]} position={"relative"} top={"0px"} >    
                                        <Button onClick={(e) => clickHandler(pinnedFundraiser[0]?.fundRaiser?.id)} transform={["rotate(-90deg)"]} backgroundColor={"#5D70F9"} left={["-32px", "-32px", "-37px"]} top={["-20px"]} zIndex={"20"} position={["absolute"]} height={["35px", "35px", "45px"]} fontSize={["10px", "10px", "xs"]} width={["80px", "80px", "100px"]} borderRadius={"full"} >
                                            Donate now
                                        </Button>
                                    </Box>
                                </Box>
                        </Flex>
                    )} 
                </Flex>
            )} 
        </Flex>
    )
}