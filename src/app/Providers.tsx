'use client';
import React, { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import THEME from '../../theme';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function Providers({ children }: PropsWithChildren) {
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <ChakraProvider value={THEME}>
                    <Toaster />
                    {children}
                </ChakraProvider>
            </QueryClientProvider>
        </div>
    )
}

export default Providers
