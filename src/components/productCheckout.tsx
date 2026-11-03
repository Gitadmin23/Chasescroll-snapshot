import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { IoIosAdd, IoIosRemove } from 'react-icons/io'
import useCustomTheme from '@/hooks/useTheme'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/models/product'
import { LANDINGPAGE_URL } from '@/services/urls'

export default function ProductCheckout({
    item,
    qty,
    setQty,
    color,
    size,
}: {
    item: IProduct;
    qty: number;
    setQty: any;
    color?: string;
    size?: string;
}) {
    const { secondaryBackgroundColor, borderColor, mainBackgroundColor, primaryColor } =
        useCustomTheme()
    const { push } = useRouter()

    const isSoldOut = Boolean(
        (item?.quantity !== undefined && item.quantity < 1) || item?.outOfStock
    )

    const clickHandler = () => {
        if (isSoldOut) return
        const queryParams = new URLSearchParams({
            productId: item?.id || '',
            qty: String(qty || 1),
            ...(color ? { color } : {}),
            ...(size ? { size } : {}),
        })
        push(`${LANDINGPAGE_URL}/auth?${queryParams.toString()}`)
    }

    const increase = () => {
        if (isSoldOut) return
        if (item?.quantity && qty >= item.quantity) return
        setQty((prev: any) => prev + 1)
    }

    const decrease = () => {
        if (isSoldOut) return
        setQty((prev: any) => (prev <= 1 ? 1 : prev - 1))
    }

    return (
        <Flex
            w={['full', 'full', 'full']}
            alignItems={'center'}
            p={['2', '2', '0px']}
            borderWidth={['1px', '1px', '0px']}
            rounded={'16px'}
            borderColor={borderColor}
            flexDir={['column', 'column', 'row']}
            gap={'4'}
        >
            <Flex gap={'4'} alignItems={'center'} w={'full'} opacity={isSoldOut ? 0.6 : 1}>
                <Text fontWeight={'500'}>QTY</Text>
                <Flex
                    bgColor={mainBackgroundColor}
                    rounded={'39px'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    padding={'12px'}
                    borderWidth={'1px'}
                    gap={'3'}
                >
                    <Flex
                        cursor={isSoldOut ? 'not-allowed' : 'pointer'}
                        as={'button'}
                        onClick={decrease}
                        w={'46px'}
                        h={'39px'}
                        rounded={'78px'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        bgColor={secondaryBackgroundColor}
                    >
                        <IoIosRemove />
                    </Flex>
                    <Text fontSize={'18px'}>{isSoldOut ? 0 : qty}</Text>
                    <Flex
                        cursor={isSoldOut ? 'not-allowed' : 'pointer'}
                        as={'button'}
                        onClick={increase}
                        w={'46px'}
                        h={'39px'}
                        rounded={'78px'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        bgColor={secondaryBackgroundColor}
                    >
                        <IoIosAdd />
                    </Flex>
                </Flex>
            </Flex>
            <Button
                onClick={clickHandler}
                disabled={isSoldOut || qty === 0}
                height={'60px'}
                bgColor={isSoldOut ? 'gray.400' : primaryColor}
                color="white"
                maxW={'300px'}
                fontWeight={'semibold'}
                w={'full'}
                fontSize={'sm'}
                borderRadius={'9999px'}
                cursor={isSoldOut ? 'not-allowed' : 'pointer'}
                _hover={{ opacity: isSoldOut ? 1 : 0.9 }}
            >
                {isSoldOut ? 'Sold Out' : 'Check out'}
            </Button>
        </Flex>
    )
}
