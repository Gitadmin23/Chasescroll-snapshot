import {
    Box,
    Button,
    Image,
    VStack,
    HStack,
    Text,
} from '@chakra-ui/react'
import React from 'react' 
import { signIn, useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'
import httpService from '@/services/httpService'
import { URLS } from '@/services/urls'
import { toaster } from '@/components/ui/toaster'
import useForm from '@/hooks/useForm'
import { loginSchema } from '@/services/validation'
import CustomInput from '../../CustomInput'
import { STORAGE_KEYS } from '@/utils/StorageKeys'
import { canPayAtom, ticketurchaseStepAtom } from '@/states/activeTicket'
import { useAtom } from 'jotai'
import { IUser } from '@/models/User'

interface LoginModalProps {
    onClose?: () => void;
    onSignUpClick?: () => void;
}

function LoginModal({ onLoggedIn, callbackUrl }: { onLoggedIn: () => void, callbackUrl: string }) {
    const { data: session, status } = useSession();
    const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);


    const { renderForm } = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
        onSubmit: (data) => {
            loginMutation(data);
        },
        validationSchema: loginSchema,
    });

    React.useEffect(() => {
        if (status === 'authenticated') {
            console.log(`this is the token`, session.token);
        }
    }, [status])

    const { mutate: loginMutation, isPending } = useMutation({
        mutationFn: async (data: any) => httpService.post(`${URLS.auth}/signin`, data),
        onError: (error) => {
            toaster.create({
                title: 'Login failed',
                description: error?.message || 'Invalid credentials',
                type: 'error',
            })
        },
        onSuccess: (data) => {
            localStorage.setItem(STORAGE_KEYS.USER_ID, data?.data?.user_id);
            localStorage.setItem(STORAGE_KEYS.token, data?.data?.access_token);
            localStorage.setItem(STORAGE_KEYS.refreshToken, data?.data?.refresh_token);
            const user_id = localStorage.getItem(STORAGE_KEYS.USER_ID);
            getPublicProfile.mutate(user_id);
        }
    });

    const getPublicProfile = useMutation({
        mutationFn: (data: any) => httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${data}`),
        onError: (error) => { },
        onSuccess: (data) => {
            const details: IUser = data?.data;
            console.log(`User details`, details);
            localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
            onLoggedIn();
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
            localStorage.setItem(STORAGE_KEYS.GOOGLE_AUTH, 'GOOGLE');
            getPublicProfile.mutate(user_id);
        }
    });

    const handleGoogleSignIn = async () => {
        try {
            if (status === 'authenticated') {
                const idToken = session.token?.idToken;
                googleAuth.mutate(idToken);
                return;
            }
            const result = await signIn('google', {
                callbackUrl,
            });

            if (result?.ok) {
                localStorage.setItem(STORAGE_KEYS.GOOGLE_AUTH, 'GOOGLE');
            }
        } catch (error) {
            toaster.create({
                title: 'An error occurred',
                description: 'Failed to sign in with Google',
                type: 'error',
            });
        }
    };

    return renderForm(
        <Box
            w="400px"
            bg="white"
            borderRadius="2xl"
            p={8}
            mx="auto"
        >
            <VStack spaceY={6} align="stretch">
                {/* Header */}
                <VStack spaceY={2}>
                    <Text fontSize="2xl" fontWeight="bold" color="black">
                        Chasescroll
                    </Text>
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                        Login and set get your snapshot
                    </Text>
                </VStack>

                {/* Login Form */}
                <VStack spaceY={4}>

                    <Box w="full">
                        <CustomInput label='Username' type='email' name="username" isPassword={false} />
                    </Box>

                    <Box w="full">
                        <CustomInput label='Password' type="email" name="password" isPassword />
                    </Box>

                    {/* Login Button */}
                    <Button
                        type="submit"
                        w="full"
                        h="50px"
                        bg="blue.500"
                        color="white"
                        borderRadius="full"
                        fontSize="md"
                        fontWeight="semibold"
                        loading={isPending}
                        loadingText="Logging in..."
                        _hover={{ bg: 'blue.600' }}
                        _active={{ bg: 'blue.700' }}
                    >
                        Login
                    </Button>

                    {/* Divider */}
                    <HStack w="full" my={2} justifyContent={'center'}>
                        <Text fontSize="sm" color="gray.400" px={3} textAlign={'center'}>
                            Or
                        </Text>
                    </HStack>

                    {/* Google Sign In */}
                    <Button
                        w="full"
                        h="50px"
                        bg="gray.50"
                        color="gray.700"
                        borderRadius="full"
                        fontSize="sm"
                        fontWeight="medium"
                        onClick={handleGoogleSignIn}
                        _hover={{ bg: 'gray.100' }}
                    >
                        <Image
                            src="/images/googleicon.png"
                            alt="Google"
                            w="20px"
                            h="20px"
                        />
                        CONTINUE WITH GOOGLE
                    </Button>

                    <HStack fontFamily={'Raleway-Regular'}>
                        <Text color="grey" fontSize={'14px'}>Powered by</Text>
                        <Text color="primaryColor" fontSize={'16px'} fontWeight={600}>Chasescroll</Text>
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    )
}

export default LoginModal