"use client"
import useCustomTheme from '@/hooks/useTheme';
import { Flex, HStack, Image, Text } from '@chakra-ui/react';
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation';  
// import UserImage from './userImage';
// import Cookies from "js-cookie"
import { useColorMode } from '../ui/color-mode';
import { RESOURCE_URL } from '@/constants';

export default function ProductImageScroller({ images, createdDate, height, rounded, objectFit }: { images: Array<any>, createdDate?: string, height?: any, rounded?: string, objectFit?: string }) {


    const [activeImageIndex, setActiveImageIndex] = React.useState(0);
    const { colorMode } = useColorMode();

    const { push } = useRouter()
    const query = useSearchParams();
    const frame = query?.get('frame');

    const { secondaryBackgroundColor } = useCustomTheme()

    React.useEffect(() => {
        if (images?.length > 1) {
            const interval = setInterval(() => {
                setActiveImageIndex((prev) => {
                    if (prev === images.length - 1) {
                        return 0;
                    }
                    return prev + 1;
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, []) 
    // const token = Cookies.get("chase_token") 

    const clickHandler = (e: any) => {
        // if (!frame) {
        //     e.stopPropagation() 
        //     window.location.href = `${DASHBOARDPAGE_URL}/dashboard/profile/${userData?.userId}?token=${token}&theme=${colorMode}`; 
        // }
    }

    return (
        <Flex cursor='pointer' w='full' h={"fit-content"} bgColor={secondaryBackgroundColor} p={objectFit ? "0px" : ["3px", "3px", "2"]} borderTopRadius={rounded ?? '10px'} borderBottomRadius={rounded ?? "0px"} overflow={'hidden'} justifyContent={"center"} alignItems={"center"} position={'relative'} >
            {images?.length > 1 && (
                <Flex position={"absolute"} zIndex={"10"} bottom={"10px"} height={"15px"} width={'full'} justifyContent={"center"} gap={1}>
                    {images.map((image, index) => (
                        <Flex key={index.toString()} cursor={'pointer'} onClick={() => setActiveImageIndex(index)} width={activeImageIndex === index ? "10px" : "5px"} height={activeImageIndex === index ? "10px" : "5px"} borderRadius={activeImageIndex === index ? "10px" : "5px"} bg={activeImageIndex === index ? "white" : "white"} scale={activeImageIndex === index ? 1 : 1} ></Flex>
                    ))}
                </Flex>
            )}

            {images?.length > 0 && (
                <Image rounded={rounded ?? "8px"} cursor='pointer' src={images[activeImageIndex]?.startsWith('https://') ? images[activeImageIndex] : (RESOURCE_URL as string) + images[activeImageIndex]} alt="bannerimage" h={height ?? ["144px", "174px", "174px"]} w={"auto"} objectFit={objectFit ?? "contain"} />
            )}
            <Flex bgColor={"#000"} opacity={"10%"} pos={"absolute"} inset={"0px"} borderTopRadius={rounded ?? '10px'} />
        </Flex>
    )
}
