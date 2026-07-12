import React, { PropsWithChildren } from 'react'
import { Box } from '@chakra-ui/react';

function ExternalLayout({ children }: PropsWithChildren) {
    return (
        <Box
            px={5}
            py={10}
            display='flex'
            flexDirection='column'
            w='full'
            h='100vh'
        >
            {children}
        </Box>
    )
}

export default ExternalLayout;
