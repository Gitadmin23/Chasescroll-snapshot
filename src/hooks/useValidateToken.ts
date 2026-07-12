import httpService from "@/utils/httpService";
import { useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useMutation, useQuery } from "react-query";

const useValidateRoken = () => {
    const [status, setStatus] = React.useState<'PENDING'|'ERROR'|'SUCCESS'>("PENDING");
    const token = localStorage.getItem('token'); 
    const toast = useToast()
    const decodeToken = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) { 
                const currentTime = Math.floor(Date.now() / 1000);
                if (decodedToken.exp < currentTime) {
                    toast({
                        title: 'Session Expired',
                        description: 'Your session has expired. Please login again.',
                        status: 'error',
                        isClosable: true,
                        duration: 5000,
                        position: 'top-right',
                    });
                    localStorage.clear();
                    setStatus('ERROR');
                } else {
                    setStatus('SUCCESS');
                }
            } else {
                toast({
                    title: 'Invalid Token',
                    description: 'Your session token is invalid. Please login again.',
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right',
                });
                localStorage.clear();
                setStatus('ERROR');
            }
        } else {
            setStatus('ERROR')
        }
    }, [token, toast]);
    
    // const { mutate, isLoading, isSuccess, isError } = useMutation({
    //     mutationFn: (info: any) => httpService.post(`/auth/verification/verify-token`, info),
    //     onError: (error) => {
    //         toast({
    //             title: 'An error occured',
    //             description: 'Token Has Expired',
    //             status: 'error',
    //             isClosable: true,
    //             duration: 5000,
    //             position: 'top-right',
    //         });
    //         localStorage.clear();
    //         setStatus('ERROR');
    //     },
    //     onSuccess: (data) => {  
    //         setStatus("SUCCESS");
    //     },

    // });

    // useEffect(()=> {
    //     if (token) {
    //         mutate({
    //             token: token
    //         })
    //     } else {
    //         setStatus('ERROR')
    //     }
    // }, [token, mutate])

    return { 
        status
    };
}

export default useValidateRoken