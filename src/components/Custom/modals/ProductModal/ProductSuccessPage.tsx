import {
    Box,
    Button,
    Image,
    VStack,
    HStack,
    Flex,
    Text,
    IconButton,
    Grid,
    GridItem,
    SimpleGrid,
} from '@chakra-ui/react'
import React from 'react'
import { useAtomValue } from 'jotai'
import { activeEventAtom, ticketCountAtom } from '@/states/activeTicket'
import { CloseSquare, TickCircle } from 'iconsax-reactjs'
import { activeProductAtom, activeProductQuantityAtom } from '@/states/activeProduct'
import { formatNumber } from '@/utils/formatNumber'

interface TicketPurchaseSuccessModalProps {
    onClose?: () => void;
    orderNumber?: string;
    email?: string;
    type?: 'EVENT' | 'FUNDRAISER' | 'PRODUCT'
}


function ProductSuccessPage({
    onClose,
    orderNumber = '#12844567363',
    email = 'otuekongdomino@gmail.com',
    type = 'EVENT'
}: TicketPurchaseSuccessModalProps) {
    const event = useAtomValue(activeEventAtom);
    const quantity = useAtomValue(activeProductQuantityAtom);
    const product = useAtomValue(activeProductAtom)

    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatEventTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <Box
            w="full"
            borderRadius="2xl"
            overflow="hidden"
            position="relative"
        >


            <Box p={8}>
                {/* Success Header */}
                <HStack mb={8} spaceX={4}>
                    <Box
                        w="50px"
                        h="50px"
                        bg="green.500"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <TickCircle size="24" color="white" variant="Bold" />
                    </Box>
                    <VStack align="start" spaceY={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="black">
                            Thanks for order!
                        </Text>

                    </VStack>
                </HStack>

                {/* Event Details Section */}
                <Box mb={8}>
                    <Text fontSize="sm" color="gray.600" mb={2} textTransform="uppercase" letterSpacing="wide" textAlign={'center'}>
                        You Bought
                    </Text>

                    <Flex justify="center" align="start" mb={6} w="full">
                        <Text fontSize="3xl" fontWeight="bold" color="primaryColor" textAlign={'center'}>
                            {product?.name || "Tech Submit"}
                        </Text>
                    </Flex>

                    {/* Event Info Grid */}
                    <VStack mb={6} w="full">
                        <VStack align="start" spaceY={4} w="full" >
                            <Text fontSize="sm" color="gray.600" fontWeight="semibold" textTransform="uppercase">
                                Order Summary
                            </Text>
                            <Flex justify="space-between" spaceX={2}>
                                <Text>Product Name</Text>
                                <Text fontWeight="semibold">{product?.name}</Text>
                            </Flex>
                            <Flex justify="space-between" spaceX={2}>
                                <Text>Quantity</Text>
                                <Text fontWeight="semibold">{quantity}</Text>
                            </Flex>
                            <Flex justify="space-between" spaceX={2}>
                                <Text>Amount</Text>
                                <Text fontWeight="semibold">NGN {formatNumber((product?.price as number) * quantity)}</Text>
                            </Flex>
                            <Flex justify="space-between" borderTopWidth={'1px'} borderTopColor={'lightgrey'} pt="10px" w="full">
                                <Text>Total</Text>
                                <Text fontWeight="semibold">NGN {formatNumber((product?.price as number) * quantity)}</Text>
                            </Flex>
                        </VStack>

                        {/* <GridItem>
                            <VStack align="start" spaceY={2}>
                                <Text fontSize="sm" color="gray.600" fontWeight="semibold" textTransform="uppercase">
                                    DATE
                                </Text>
                                <Text fontSize="md" color="black">
                                    {event?.startDate ? formatEventDate(event.startDate) : "Saturday, July 26"}
                                </Text>

                            </VStack>
                        </GridItem> */}

                    </VStack>
                </Box>

                {/* Products Section */}
                {/* <Box>
                    <Flex justify="space-between" align="center" mb={6}>
                        <Text fontSize="xl" fontWeight="bold" color="black">
                            Product available for this event
                        </Text>
                        <Link fontSize="sm" color="blue.500" fontWeight="medium">
                            View Kiosk
                        </Link>
                    </Flex>

                
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    {mockProducts.map((product) => (
                        <GridItem key={product.id}>
                            <Box
                                bg="gray.50"
                                borderRadius="lg"
                                overflow="hidden"
                                _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                                transition="all 0.2s"
                                cursor="pointer"
                            >
                                <Box position="relative">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        w="100%"
                                        h="150px"
                                        objectFit="cover"
                                    />
                                    {product.available && (
                                        <Badge
                                            position="absolute"
                                            top={2}
                                            right={2}
                                            colorScheme="gray"
                                            fontSize="xs"
                                        >
                                            {product.available} Avail
                                        </Badge>
                                    )}
                                </Box>
                                <Box p={4}>
                                    <Text fontSize="lg" fontWeight="bold" color="black" mb={1}>
                                        ₦{formatNumber(product.price)}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {product.name}
                                    </Text>
                                </Box>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            </Box>  */}
            </Box>
        </Box >
    )
}

export default ProductSuccessPage;