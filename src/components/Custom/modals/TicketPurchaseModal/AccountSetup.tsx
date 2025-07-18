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

interface Props {
    params: {
        type: string
    },
    searchParams: {
        id: string
    }
}


function AccountSetup() {

    const [step, setStep] = useAtom(ticketurchaseStepAtom);
    const [currentUrl, setCurrentUrl] = useAtom(currentUrlAtom);
    const [ticket, setTicket] = useAtom(activeTicketAtom);
    const [event, setActiveEvent] = useAtom(activeEventAtom);
    const [quantity, setQuantity] = useAtom(ticketCountAtom);
    const [canPay, setCanPay] = useAtom(canPayAtom)
    const [paystackDetails, setPaystackDetails] = useAtom(paystackDetailsAtom);
    const [createTicketIsLoading, setCreateTicketIsLoading] = React.useState(false)
    const setCreatedTicket = useSetAtom(createdTicketAtom)
    const currentId = useAtomValue(currentIdAtom);

    const [token, setToken] = React.useState(() => localStorage.getItem(STORAGE_KEYS.token));
    const [userId, setUserId] = React.useState(() => localStorage.getItem(STORAGE_KEYS.USER_ID));
    const [userDetails, setUserDetails] = React.useState<IUser | null>(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DETAILS) as string));
    const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
        const token = localStorage.getItem(STORAGE_KEYS.token);
        const user_id = localStorage.getItem(STORAGE_KEYS.USER_ID);
        return token !== null && user_id !== null;
    });
    const [googleAuthUsed, setGoogleAuthUsed] = React.useState(() => {
        const googleUsed = localStorage.getItem(STORAGE_KEYS.GOOGLE_AUTH);
        if (googleUsed) {
            return true;
        } else {
            return false;
        }
    })

    const { data: session, status } = useSession();

    const { renderForm, values, setFieldValue, setValues } = useForm({
        defaultValues: {
            firstName: userDetails?.firstName || '',
            lastName: userDetails?.lastName || '',
            email: userDetails?.email || ''
        },
        onSubmit: (data) => {
            if (isLoggedIn) {
                createTicket({
                    eventID: event?.id as string,
                    ticketType: ticket?.ticketType as string,
                    numberOfTickets: quantity,
                })
                return;
            } else if (googleAuthUsed) {
                // LOGIN USER
                const idToken = session?.token?.idToken;
                googleAuth.mutate(idToken);
            } else {
                checkEmailMutation(data);
            }
        },
        validationSchema: accountCreationSchema,
    });

    React.useEffect(() => {
        if (googleAuthUsed) {
            // LOGIN USER
            const idToken = session?.token?.idToken;
            googleAuth.mutate(idToken);
        }
    }, [googleAuthUsed])

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

    const createTicket = async (data: { eventID: string, ticketType: string, numberOfTickets: number }) => {
        setCreateTicketIsLoading(true);
        try {

            const res = await httpService.post(`${URLS.event}/create-ticket`, data);
            const json: ITicketCreatedModel = res.data;

            console.log(json);
            setCreatedTicket(json);
            if (res?.data) {
                if (!json.content) {
                    toaster.create({
                        title: 'An error occured',
                        description: json?.message,
                        type: 'error',
                    });
                    setCreateTicketIsLoading(false);
                    return;

                }
                setCanPay(true);
                setPaystackDetails({ email: json?.content?.buyer?.email, reference: json.content?.orderId, amount: json.content?.orderTotal * 100 });
                return;
            } else {
                toaster.create({
                    title: 'An error occured',
                    description: 'Failed to create ticket',
                    type: 'error',
                });
            }
            // you can call this function anything
            setCreateTicketIsLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    const getPublicProfile = useMutation({
        mutationFn: (data: any) => httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${data}`),
        onError: (error) => { },
        onSuccess: (data) => {
            const details: IUser = data?.data;
            console.log(`User details`, details);
            localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
            setUserDetails(details);
            // setCanPay(true);
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
                localStorage.setItem(STORAGE_KEYS.EVENT, JSON.stringify(event));
                localStorage.setItem(STORAGE_KEYS.ACTIVE_TICKET, JSON.stringify(ticket));
                localStorage.setItem(STORAGE_KEYS.QUANTITY, quantity.toString());
                localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
                setStep((prev) => prev + 1);
                toaster.create({
                    title: 'Alert!',
                    description: data?.data?.message,
                    type: 'warn',
                })
            } else {
                setUserId(data?.data?.user_id);
                setToken(data?.data?.access_token);
                localStorage.setItem(STORAGE_KEYS.token, data?.data?.access_token);
                localStorage.setItem(STORAGE_KEYS.USER_ID, data?.data?.user_id);
                createTicket({ eventID: event?.id as string, ticketType: ticket?.ticketType as string, numberOfTickets: quantity });
            }
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

                    <Box p={["10px", "10px", "20px", "20px"]}>


                        {/* Event Info */}
                        <HStack mb={8} p={4} borderRadius="lg" borderWidth="1px" borderColor={'lightgrey'}>
                            <Image
                                src={RESOURCE_URL + '/' + event?.currentPicUrl || "/images/tech-event.jpg"}
                                alt={event?.eventName}
                                w="120px"
                                h="120px"
                                objectFit="cover"
                                borderRadius="md"
                            />
                            <VStack align="start" spaceY={1} flex="1">
                                <Text fontWeight="semibold">{event?.eventName || "Tech Submit"}</Text>
                                <Text fontSize="sm" color="gray.600">
                                    {event?.startDate ? new Date(event.startDate).toLocaleString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    }) : "Thu, Aug 14 • 7:00 pm"}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                    NGN {ticket ? formatNumber((ticket.ticketPrice as number) * quantity) : "24000"}
                                </Text>
                                <HStack>
                                    <Text fontSize="xs" color="gray.500">Ticket Selected</Text>
                                    <Badge colorScheme="red" fontSize="xs">{ticket?.ticketType}</Badge>
                                </HStack>
                            </VStack>

                        </HStack>

                        {/* Contact Information */}
                        {!canPay && (
                            <VStack align="start" spaceY={[0, 0, 6, 6]} mb={8}>


                                <Flex spaceX={[0, 0, 4, 4]} w="full" flexDir={['column', 'column', 'row', 'row']}>
                                    <Box w="full">
                                        <CustomInput name="firstName" label='First Name' isPassword={false} />
                                    </Box>

                                    <Box w="full" mt={['10px', '10px', '0px', '0px']}>
                                        <CustomInput name="lastName" label='Last Name' isPassword={false} />
                                    </Box>
                                </Flex>
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
                                    loading={isPending || createTicketIsLoading || googleAuth.isPending || getPublicProfile.isPending}
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

                {/* Right Side - Event Image & Order Summary */}
                <Box flex="0.4" position="relative" bgColor="whitesmoke" display={['none', 'none', 'block', 'block']}>


                    {/* Event Image */}
                    <Box w="100%" h="300px" overflow="hidden">
                        <Image
                            src={RESOURCE_URL + '/' + event?.currentPicUrl || "/images/tech-event.jpg"}
                            alt={event?.eventName}
                            w="100%"
                            h="300px"
                            objectFit="cover"
                        />
                    </Box>

                    {/* Order Summary */}
                    <Box p={6}>
                        <Text fontSize="lg" fontWeight="bold" mb={4}>
                            Order summary
                        </Text>

                        <VStack spaceY={3} align="stretch">
                            <Flex justify="space-between">
                                <Text>{quantity} x {ticket?.ticketType}</Text>
                                <Text fontWeight="semibold">NGN {formatNumber((ticket?.ticketPrice as number) * quantity)}</Text>
                            </Flex>
                            {/* <Flex justify="space-between">
                                <Text>1 x VIP</Text>
                                <Text fontWeight="semibold">NGN 3000</Text>
                            </Flex> */}
                        </VStack>
                    </Box>
                </Box>
            </Flex>
        </Box>
    )
}

export default AccountSetup