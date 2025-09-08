import {
    Box,
    Button,
    Image,
    VStack,
    HStack,
    Flex,
    Text,
    Input,
    Checkbox,
    Badge,
    IconButton
} from '@chakra-ui/react'
import React, { useState } from 'react'
import CustomText from '../../CustomText'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useMutation } from '@tanstack/react-query'
import httpService from '@/services/httpService'
import { URLS } from '@/services/urls'
import { toaster } from '@/components/ui/toaster'
import { signIn, useSession, getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { currentIdAtom, showTicketModalAtom } from '@/views/share/Event'
import { useGoogleTokens } from '@/hooks/useGoogleTokens';
import { activeEventAtom, activeTicketAtom, canPayAtom, createdTicketAtom, currentUrlAtom, paystackDetailsAtom, ticketCountAtom, ticketurchaseStepAtom } from '@/states/activeTicket'
import { ArrowLeft, CloseSquare, Edit } from 'iconsax-reactjs'
import { formatNumber } from '@/utils/formatNumber'
import { RESOURCE_URL } from '@/constants'
import useForm from '@/hooks/useForm'
import { accountCreationSchema, addressValidationSchema } from '@/services/validation'
import CustomInput from '../../CustomInput'
import { STORAGE_KEYS } from '@/utils/StorageKeys'
import { usePaystackPayment } from 'react-paystack';
import { ITicketCreatedModel } from '@/models/TicketCreatedModel'
import PaymentButton from '../../PaymentButton'
import { IUser } from '@/models/User'
import { activeFundRaiserAtom, donationAmountAtom } from '@/states/activeFundraiser'
import { activeProductAtom, activeProductQuantityAtom } from '@/states/activeProduct'

export interface ICustomOrderDto {
    seller: string;
    price: number;
    currency: 'NGN';
    orderType: 'DONATION' | 'ORDERS';
    typeID: string;
}

interface Props {
    params: {
        type: string
    },
    searchParams: {
        id: string
    }
}


function ProductAddressPage() {

    const [step, setStep] = useAtom(ticketurchaseStepAtom);
    const [amount, setAmount] = useAtom(activeProductQuantityAtom);
    const [canPay, setCanPay] = useAtom(canPayAtom);
    const [paystackDetails, setPaystackDetails] = useAtom(paystackDetailsAtom);
    const [product, setProduct] = useAtom(activeProductAtom)

    const [token, setToken] = React.useState(() => localStorage.getItem(STORAGE_KEYS.token));
    const [userId, setUserId] = React.useState(() => localStorage.getItem(STORAGE_KEYS.USER_ID));
    const [userDetails, setUserDetails] = React.useState<IUser | null>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DETAILS) as string));
    const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
        const token = localStorage.getItem(STORAGE_KEYS.token);
        const user_id = localStorage.getItem(STORAGE_KEYS.USER_ID);
        return token !== null && user_id !== null;
    });

    const { data: session, status } = useSession();


    const { renderForm, values, setFieldValue, setValues } = useForm({
        defaultValues: {
            state: '',
            lga: '',
            address: '',
            phone: '',
        },
        onSubmit: (data) => {
            createAddress.mutate(data);
        },
        validationSchema: addressValidationSchema,
    });


    React.useEffect(() => {
        if (token !== null && userId !== null) {
            setIsLoggedIn(true);
        }
    }, [token, userId, status])

    const createCustomOrder = useMutation({
        mutationFn: (data: ICustomOrderDto) => httpService.post(`${URLS.payments}/createCustomOrder`, data),
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data) => {
            const item: ITicketCreatedModel = data?.data;
            setPaystackDetails({
                amount: item?.content?.orderTotal * 100,
                email: userDetails?.email as string,
                reference: item?.content?.orderCode,
            });
            setCanPay(true);
            console.log('CUSTOM ORDER CREATED', data?.data);
        }
    })

    const createAddress = useMutation({
        mutationFn: async (data: { state: string, phone: string, lga: string, address: string }) => httpService.post(`${URLS.address}/create`, {
            state: data.state,
            lga: data?.lga,
            userId: userDetails?.userId,
            isDefault: true,
            location: {
                phone: data.phone,
                address: data?.address,
                state: data.state,
            }
        }),
        onError: (error) => {
            toaster.create({
                title: 'Login failed',
                description: error?.message || 'Invalid credentials',
                type: 'error',
            })
        },
        onSuccess: (data) => {
            console.log(data?.data);
            createOrder.mutate({
                addressId: data?.data?.id,
                productId: product?.id as string,
                quantity: amount,
                total: (product?.price as number) * amount as number,
                userId: userDetails?.userId as string,
                vendorId: product?.createdBy?.userId as string,

            })
        }
    });

    const createOrder = useMutation({
        mutationFn: async (data: { productId: string, quantity: number, total: number, userId: string, vendorId: string, addressId: string }) => httpService.post(`${URLS.order}/create`, {
            productId: data.productId,
            quantity: data.quantity,
            total: data.total,
            userId: data.userId,
            vendorId: data.vendorId,
            addressId: data.addressId,
        }),
        onError: (error) => {
            toaster.create({
                title: 'Login failed',
                description: error?.message || 'Invalid credentials',
                type: 'error',
            })
        },
        onSuccess: (data) => {
            console.log(data?.data);
            createCustomOrder.mutate({
                currency: 'NGN',
                orderType: 'ORDERS',
                typeID: data?.data?.id,
                price: data?.data?.total,
                seller: product?.createdBy?.userId as string,
            })
        }
    });



    return renderForm(
        <Box w="full" bg="white" borderRadius="xl" overflow="hidden">
            <Flex w="full" flexDir={['column', 'column', 'row', 'row']}>
                {/* Left Side - Checkout Form */}
                <Box flex="0.6">
                    {/* Header */}
                    <HStack mb={6} borderBottomWidth={'1px'} spaceX={6} borderBottomColor={'lightgrey'} p="10px">
                        <IconButton
                            aria-label="Go back"
                            variant="ghost"
                            size="sm"
                            onClick={() => setStep((prev) => prev - 1)}
                        >
                            <ArrowLeft size="20" />
                        </IconButton>
                        <VStack align="start" spaceY={0}>
                            <Text fontSize="xl" fontWeight="bold">Checkout</Text>
                        </VStack>
                    </HStack>

                    <Box p="20px">

                        {/* Event Info */}
                        <HStack mb={8} p={4} borderRadius="lg" borderWidth="1px" borderColor={'lightgrey'}>
                            <Image
                                src={RESOURCE_URL + '/' + product?.images[0] || "/images/tech-event.jpg"}
                                w="120px"
                                h="120px"
                                objectFit="cover"
                                borderRadius="md"
                            />
                            <VStack align="start" spaceY={1} flex="1">
                                <Text fontWeight="semibold">{product?.name || "Tech Submit"}</Text>
                                <Text fontSize="sm" color="gray.600">
                                    {new Date(product?.createdDate as number).toLocaleString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </Text>

                                <HStack>
                                    <Text fontSize="xs" color="gray.500">Price</Text>
                                    <Badge colorScheme="red" fontSize="xs">{formatNumber((product?.price as number))}</Badge>
                                </HStack>
                            </VStack>

                        </HStack>

                        {/* Contact Information */}
                        {!canPay && (
                            <VStack align="start" spaceY={6} mb={8}>

                                <Flex spaceX={4} w="full">

                                    <Box w="full">
                                        <CustomInput name="state" type='text' label='State' isPassword={false} />
                                    </Box>

                                    <Box w="full">
                                        <CustomInput name="lga" type='text' label='Lga' isPassword={false} />
                                    </Box>
                                </Flex>

                                <Flex spaceX={4} w="full">

                                    <Box w="full">
                                        <CustomInput name="address" type='email' label='Address' isPassword={false} />
                                    </Box>

                                    <Box w="full">
                                        <CustomInput name="phone" type='number' label='Phone umber' isPassword={false} />
                                    </Box>
                                </Flex>


                            </VStack>
                        )}

                        {/* Footer */}
                        <HStack justify="space-between" align="center" display={['none', 'none', 'flex', 'flex']}>
                            {!canPay && (
                                <Button
                                    w="full"
                                    h="60px"
                                    bgColor="primaryColor"
                                    size="lg"
                                    borderRadius="full"
                                    px={8}
                                    loading={createCustomOrder.isPending || createOrder.isPending || createAddress.isPending}
                                    type={'submit'}
                                >
                                    Save Address
                                </Button>
                            )}
                            {canPay && (
                                <PaymentButton
                                    reference={paystackDetails?.reference as string}
                                    email={paystackDetails?.email as string}
                                    amount={paystackDetails?.amount as number}
                                    text={'Pay'}
                                />
                            )}
                        </HStack>

                    </Box>
                </Box>

                {/* Right Side - Event Image & Order Summary */}
                <Box flex="0.4" position="relative" bgColor="whitesmoke">

                    {/* Event Image */}
                    <Box w="100%" h="300px" overflow="hidden" display={['none', 'none', 'block', 'block']}>
                        <Image
                            src={RESOURCE_URL + '/' + product?.images[0] || "/images/tech-event.jpg"}
                            w="100%"
                            h="300px"
                            objectFit="cover"
                        />
                    </Box>

                    {/* Order Summary */}
                    <Box p={6}>
                        <Text fontSize="lg" fontWeight="bold" mb={4}>
                            Order Summary
                        </Text>

                        <VStack spaceY={3} align="stretch">
                            <Flex justify="space-between">
                                <Text>Product Name</Text>
                                <Text fontWeight="semibold">{product?.name}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text>Quantity</Text>
                                <Text fontWeight="semibold">{amount}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text>Amount</Text>
                                <Text fontWeight="semibold">NGN {formatNumber((product?.price as number) * amount)}</Text>
                            </Flex>
                            <Flex justify="space-between" borderTopWidth={'1px'} borderTopColor={'lightgrey'} pt="10px">
                                <Text>Total</Text>
                                <Text fontWeight="semibold">NGN {formatNumber((product?.price as number) * amount)}</Text>
                            </Flex>
                        </VStack>

                        <HStack justify="space-between" align="center" display={['flex', 'flex', 'none', 'none']} mt="20px">
                            {!canPay && (
                                <Button
                                    w="full"
                                    h="60px"
                                    bgColor="primaryColor"
                                    size="lg"
                                    borderRadius="full"
                                    px={8}
                                    loading={createCustomOrder.isPending || createOrder.isPending || createAddress.isPending}
                                    type={'submit'}
                                >
                                    Save Address
                                </Button>
                            )}
                            {canPay && (
                                <PaymentButton
                                    reference={paystackDetails?.reference as string}
                                    email={paystackDetails?.email as string}
                                    amount={paystackDetails?.amount as number}
                                    text={'Pay'}
                                />
                            )}
                        </HStack>
                    </Box>
                </Box>
            </Flex>
        </Box>
    )
}

export default ProductAddressPage;