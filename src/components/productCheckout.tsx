import { Button, Flex, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoIosAdd, IoIosRemove } from 'react-icons/io'
import useCustomTheme from '@/hooks/useTheme'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/models/product'
import { LANDINGPAGE_URL } from '@/services/urls'

export default function ProductCheckout({ item, qty, setQty, color, size }: { item: IProduct, qty: number, setQty: any, color?: string, size?: string }) {

    const { secondaryBackgroundColor, borderColor, mainBackgroundColor, primaryColor } = useCustomTheme()
    const { push } = useRouter()


    const clickHandler = () => {
        push(`${LANDINGPAGE_URL}/auth?productId=${item?.id}&qty=${qty}`)
    }

    const increase = () => {
        if(qty !== item?.quantity) {
            setQty((prev: any) => prev + 1)
        }
    }

    return (
        <Flex w={["full", "full", "full"]} alignItems={"center"} p={["2", "2", "0px"]} borderWidth={["1px", "1px", "0px"]} rounded={"16px"} borderColor={borderColor} flexDir={["column", "column", "row"]} gap={"4"} >
            <Flex gap={"4"} alignItems={"center"} w={"full"} >
                <Text fontWeight={"500"} >QTY</Text>
                <Flex bgColor={mainBackgroundColor} rounded={"39px"} alignItems={"center"} justifyContent={"center"} padding={"12px"} borderWidth={"1px"} gap={"3"} >
                    <Flex cursor={"pointer"} as={"button"} onClick={() => setQty((prev: any) => prev === 1 ? 1 : prev - 1)} w={"46px"} h={"39px"} rounded={"78px"} justifyContent={"center"} alignItems={"center"} bgColor={secondaryBackgroundColor}  >
                        <IoIosRemove />
                    </Flex>
                    <Text fontSize={"18px"} >{qty}</Text>
                    <Flex cursor={"pointer"} as={"button"} onClick={increase} w={"46px"} h={"39px"} rounded={"78px"} justifyContent={"center"} alignItems={"center"} bgColor={secondaryBackgroundColor}  >
                        <IoIosAdd />
                    </Flex>
                </Flex>
            </Flex>
            <Button onClick={clickHandler} disabled={item?.quantity === 0 ? true : false} height={"60px"} bgColor={primaryColor} maxW={"300px"} fontWeight={"semibold"} w={"full"} fontSize={"sm"} borderRadius={"9999px"} >
                Check out
            </Button>
        </Flex>
    )
}
