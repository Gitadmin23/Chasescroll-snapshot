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
import { accountCreationSchema } from '@/services/validation'
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
    orderType: 'DONATION' | 'PPRODUCT';
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


function ProductReviewPage() {

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
    const [googleAuthUsed, setGoogleAuthUsed] = React.useState(() => localStorage.getItem(STORAGE_KEYS.GOOGLE_AUTH));
    const [showLink, setShowLink] = React.useState(false);


    const { data: session, status } = useSession();


    const { renderForm, values, setFieldValue, setValues } = useForm({
        defaultValues: {
            firstName: userDetails?.firstName || '',
            lastName: userDetails?.lastName || '',
            email: userDetails?.email || ''
        },
        onSubmit: (data) => {
            if (isLoggedIn) {
                localStorage.setItem(STORAGE_KEYS.PRODUCT, JSON.stringify(product));
                localStorage.setItem(STORAGE_KEYS.PRODUCT_QUANTITY, String(amount));
                setStep(2);
                return;
            } else if (googleAuthUsed) {
                // login with google
                const idToken = session?.token?.idToken;
                googleAuth.mutate(idToken);
            } else {
                localStorage.setItem(STORAGE_KEYS.PRODUCT, JSON.stringify(product));
                localStorage.setItem(STORAGE_KEYS.PRODUCT_QUANTITY, String(amount));
                checkEmailMutation(data);
            }
        },
        validationSchema: accountCreationSchema,
    });

    React.useEffect(() => {
        if (status === 'authenticated') {
            // LOGIN USER
            const idToken = session.token?.idToken;
            googleAuth.mutate(idToken);
        }
    }, [status])

    React.useEffect(() => {
        if (userDetails) {
            setFieldValue('firstName', userDetails?.firstName || '', true).then();
            setFieldValue('lastName', userDetails?.lastName || '', true).then();
            setFieldValue('email', userDetails?.email || '', true).then();
        }
    }, [userDetails])

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

    const getPublicProfile = useMutation({
        mutationFn: (data: any) => httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${data}`),
        onError: (error) => { },
        onSuccess: (data) => {
            const details: IUser = data?.data;
            console.log(`User details`, details);
            localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
            setUserDetails(details);
        },
    })

    const googleAuth = useMutation({
        mutationFn: async (data: any) => httpService.get(`${URLS.auth}/signinWithCredentials`, {
            headers: {
                Authorization: `Bearer ${data}`
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
            console.log('Login successful', data?.data);
            localStorage.setItem(STORAGE_KEYS.USER_ID, data?.data?.user_id);
            localStorage.setItem(STORAGE_KEYS.token, data?.data?.access_token);
            localStorage.setItem(STORAGE_KEYS.refreshToken, data?.data?.refresh_token);
            const user_id = localStorage.getItem(STORAGE_KEYS.USER_ID);
            getPublicProfile.mutate(user_id);
        }
    });

    const { mutate: checkEmailMutation, isPending } = useMutation({
        mutationFn: async (data: any) => httpService.post(`${URLS.auth}/temporary-signup`, data),
        onError: (error) => {
            toaster.create({
                title: 'An error occured',
                description: error?.message,
                type: 'error',
            });
            // setStep((prev) => prev + 1);
        },
        onSuccess: (data) => {
            console.log('data', data?.data);
            if (data?.data['stackTrace']) {
                // save everything in local storage
                localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
                toaster.create({
                    title: 'Infor',
                    description: data?.data?.message,
                    type: 'info',
                });
                setShowLink(true);
            } else {
                setUserId(data?.data?.id);
                setToken(data?.data?.token);
                localStorage.setItem(STORAGE_KEYS.token, data?.data?.access_token);
                localStorage.setItem(STORAGE_KEYS.USER_ID, data?.data?.user_id);
                setStep(2);

            }
        }
    });

    return renderForm(
        <Box w="full" bg="white" borderRadius="xl" overflow="hidden">
            <Flex w="full" flexDir={['column', 'column', 'row', 'row']}>
                {/* Left Side - Checkout Form */}
                <Box flex="0.6">
                    {/* Header */}
                    <HStack mb={[0, 0, 6, 6]} borderBottomWidth={'1px'} spaceX={6} borderBottomColor={'lightgrey'} p="10px">
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

                    <Box p="20px" display={['none', 'none', 'block', 'block']}>

                        {/* Event Info */}
                        <HStack mb={8} p={4} borderRadius="lg" borderWidth="1px" borderColor={'lightgrey'} display={['none', 'none', 'flex', 'flex']}>

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

                        <Box display={['none', 'none', 'block', 'block']}>
                            {/* Contact Information */}
                            {!canPay && (
                                <VStack align="start" spaceY={6} mb={8}>

                                    <HStack spaceX={4} w="full">

                                        <Box w="full">
                                            <CustomInput name="firstName" type='text' label='First Name' isPassword={false} />
                                        </Box>

                                        <Box w="full">
                                            <CustomInput name="lastName" type='text' label='Last Name' isPassword={false} />
                                        </Box>
                                    </HStack>
                                    <Box w="full">
                                        <CustomInput name="email" type='email' label='Email' isPassword={false} />
                                        {showLink && (
                                            <HStack mt="10px">
                                                <Text color="red">You already have an account on chasecroll, for security reasons</Text>
                                                <Text color="primaryColor" cursor={'pointer'} onClick={() => setStep(3)} textDecorationLine={'underline'}>Sign in</Text>
                                            </HStack>
                                        )}
                                    </Box>

                                </VStack>
                            )}

                            {/* Footer */}
                            <HStack justify="space-between" align="center">
                                {!canPay && (
                                    <Button
                                        w="full"
                                        h="60px"
                                        bgColor="primaryColor"
                                        size="lg"
                                        borderRadius="full"
                                        px={8}
                                        loading={isPending || createCustomOrder.isPending || googleAuth.isPending || getPublicProfile.isPending}
                                        type={'submit'}
                                    >
                                        Confirm Details
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
                </Box>

                {/* Right Side - Event Image & Order Summary */}
                <Box flex="0.4" position="relative" bgColor="whitesmoke">

                    {/* Event Image */}
                    <Box w="100%" h="300px" overflow="hidden" bg="red">
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

                        <Box display={['block', 'block', 'none', 'none']} mt="20px" borderTopWidth={'1px'} borderTopColor={'lightgrey'} pt="20px">
                            {/* Contact Information */}
                            {!canPay && (
                                <VStack align="start" spaceY={6} mb={8}>

                                    <HStack spaceX={4} w="full">

                                        <Box w="full">
                                            <CustomInput name="firstName" label='First Name' isPassword={false} />
                                        </Box>

                                        <Box w="full">
                                            <CustomInput name="lastName" label='Last Name' isPassword={false} />
                                        </Box>
                                    </HStack>
                                    <Box w="full">
                                        <CustomInput name="email" label='Email' isPassword={false} />
                                    </Box>

                                </VStack>
                            )}

                            {/* Footer */}
                            <HStack justify="space-between" align="center">
                                {!canPay && (
                                    <Button
                                        w="full"
                                        h="60px"
                                        bgColor="primaryColor"
                                        size="lg"
                                        borderRadius="full"
                                        px={8}
                                        loading={isPending || createCustomOrder.isPending || googleAuth.isPending || getPublicProfile.isPending}
                                        type={'submit'}
                                    >
                                        Confirm Details
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
                </Box>
            </Flex>
        </Box>
    )
}

export default ProductReviewPage;