'use client';
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React from 'react'
import { currentIdAtom } from './Event';
import { useSession } from 'next-auth/react';
import { IProduct } from '@/models/product';
import { PaginatedResponse } from '@/models/PaginatedResponse';
import { Avatar, Box, Button, Container, Flex, Heading, HStack, Menu, Portal, Skeleton, VStack, Text, Image } from '@chakra-ui/react';
import ChasescrollBox from '@/components/Custom/ChasescrollBox';
import MapComponent from '@/components/Custom/MapComponent';
import { RESOURCE_URL } from '@/constants';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { formatNumber } from '@/utils/formatNumber';
import { ArrowLeft2, Add, Minus, Truck, Star1 } from 'iconsax-reactjs';
import { toaster } from '@/components/ui/toaster';
import ProductModal from '@/components/Custom/modals/ProductModal/ProductModal';
import { activeProductAtom, activeProductQuantityAtom } from '@/states/activeProduct';
import { ticketurchaseStepAtom } from '@/states/activeTicket';
import { STORAGE_KEYS } from '@/utils/StorageKeys';

function Product({ id }: { id: string }) {

    const router = useRouter();
    const setCurrentId = useSetAtom(currentIdAtom);
    const session = useSession();


    setCurrentId(id);
    const [quantity, setQuantity] = useAtom(activeProductQuantityAtom);
    const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);
    const [product, setProduct] = useAtom(activeProductAtom);
    const [amount, setAmount] = useAtom(activeProductQuantityAtom);
    const [showModal, setShowModal] = React.useState(false);

    const { isLoading, data, isError, error } = useQuery({
        queryKey: [`get-external-product-single-${id}`],
        queryFn: () => httpService.get(`${URLS.product}/search`, {
            params: {
                id
            }
        })
    });

    React.useEffect(() => {
        // INITIALIZE VALUES IF THEY EXIST
        const step = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
        if (step) {
            setCurrentStep(() => {
                return step ? Number(step) : 1;
            });

            if (Number(step) > 1) {
                setShowModal(true);
            }
        }

        setProduct(() => {
            const data = localStorage.getItem(STORAGE_KEYS.PRODUCT);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        });

        setAmount(() => {
            const data = localStorage.getItem(STORAGE_KEYS.PRODUCT_QUANTITY);
            if (data) {
                return Number(data);
            }
            return 1;

        })
    }, [])

    React.useEffect(() => {
        if (!isLoading && !isError && data?.data) {
            const item: PaginatedResponse<IProduct> = data?.data;
            setProduct(item?.content[0]);
        }
    }, [data, isError, isLoading]);

    // Dynamically update the page title when product data loads
    React.useEffect(() => {
        if (product?.name) {
            document.title = `Product | ${product.name}`;
        } else {
            document.title = 'Product';
        }
    }, [product?.name]);

    const handleQuantityChange = React.useCallback(({ type }: { type: 'INC' | 'DEC' }) => {
        if (type === 'INC') {
            if (quantity >= (product?.quantity as number)) {
                toaster.create({
                    title: 'warning',
                    description: 'You cannot select more than the available quantity',
                    type: 'info',
                })
                return;
            }
            setQuantity((prev) => prev + 1);
        }

        if (type === 'DEC') {
            if (quantity === 1) {
                toaster.create({
                    title: 'warning',
                    description: 'You must select at least 1 product to buy',
                    type: 'info',
                });
                return;
            } else {
                setQuantity((prev) => prev - 1);
            }
        }
    }, [quantity, product?.quantity])

    const handleShowModal = () => {
        if ((product?.quantity as number) < 1) {
            toaster.create({
                title: 'Error',
                description: 'This product is OUT OF STOCK',
                type: 'error',
            })
            return;
        }
        if (quantity < 1) {
            toaster.create({
                title: 'Error',
                description: 'You must select at least 1 product to buy',
                type: 'error',
            })
            return;
        }
        setShowModal(true);
    }

    return (
        <Box w="full" h="full" p={['0px', '0px', 6, 6]}>
            <ProductModal isOpen={showModal} onClose={() => setShowModal(false)} type="PRODUCT" />
            <Container maxW={['100%', '100%', '70%', '70%']} p="10px">
                <HStack alignItems={'center'} mb='20px'>
                    <ArrowLeft2 onClick={() => router.back()} cursor={'pointer'} variant='Outline' size='30px' />
                    <Heading>Product</Heading>
                    {!isLoading && !isError && (
                        <Heading color='primaryColor'> / {product?.name}</Heading>
                    )}
                </HStack>
                {!isLoading && !isError && data?.data && (
                    <Flex w='full' h="full" spaceX={[0, 0, 6, 6]} flexDir={['column', 'column', 'row', 'row']} mt="10px">
                        <Box flex={1} h="full">
                            <Box width={'full'} h="500px" mb="10xp" borderWidth={'1px'} borderColor="gray.200" borderRadius={'16px'} overflow={'hidden'}>
                                <Image w="full" h="full" objectFit="cover" src={(RESOURCE_URL as string) + (product?.images[0] as string)} />
                            </Box>

                            <Box display={['none', 'none', 'block', 'block']}>
                                <Button
                                    variant={'solid'}
                                    width="auto"
                                    height="45px"
                                    mt='20px'
                                    borderRadius={'full'}
                                    color="white"
                                    bgColor="primaryColor"
                                    onClick={() => {
                                        if (product?.location?.latlng) {
                                            const [lat, lng] = product.location?.latlng.split(' ');
                                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                                        }
                                    }}
                                    disabled={!product?.location?.latlng}
                                >
                                    Direction
                                </Button>
                                <Box height={'20px'} />
                                {product?.location?.latlng ? (
                                    <MapComponent
                                        lat={parseFloat(product?.location?.latlng.split(' ')[0])}
                                        lng={parseFloat(product?.location?.latlng.split(' ')[1])}
                                        width="100%"
                                        height="200px"
                                        zoom={15}
                                        borderRadius="16px"
                                        markerTitle={product?.name || 'Product Location'}
                                    />
                                ) : (
                                    <Box w='full' h="200px" mt='20px' borderRadius={'16px'} bgColor="gray.100"></Box>
                                )}
                            </Box>
                        </Box>

                        <Box flex={1} h="full" borderWidth='0px' borderColor="gray.200" p="20px" borderRadius={'16px'}>
                            <Heading fontSize={'24px'}>{product?.name}</Heading>
                            <VStack mt='20px' w="full" alignItems={'flex-start'} spaceY={0} borderRadius={'16px'} bgColor={'gray.100'} p='10px'>
                                <Heading fontSize={'20px'}>product details</Heading>
                                <Text fontSize={'16px'} mt="0px">{product?.description}</Text>
                            </VStack>

                            <Text fontSize={'20px'} fontWeight={600} my="10px">{formatNumber(product?.price as number)}</Text>

                            <HStack w="full" h="90px" p={2} borderRadius={'full'} bgColor='gray.100' mt='20px' alignItems={'center'} spaceX={2}>
                                <ChasescrollBox width='50px' height='50px' borderRadius='10px'>
                                    <Avatar.Root width={'full'} height={'full'} borderWidth="1px" borderColor="#233DF3">
                                        <Avatar.Fallback name={`${product?.createdBy?.firstName} ${product?.createdBy?.lastName}`} />
                                        <Avatar.Image src={`${RESOURCE_URL}${product?.createdBy?.data?.imgMain?.value}`} />
                                    </Avatar.Root>
                                </ChasescrollBox>
                                <VStack spaceX={0} spaceY={-2} alignItems={'flex-start'}>
                                    <Text fontFamily={'sans-serif'} fontWeight={700} fontSize={'16px'}>{capitalizeFLetter(product?.createdBy?.firstName)} {capitalizeFLetter(product?.createdBy?.lastName)}</Text>
                                    <Text fontFamily={'sans-serif'} fontWeight={300} fontSize={'14px'}>{capitalizeFLetter(product?.createdBy?.username)}</Text>
                                </VStack>
                            </HStack>

                            <HStack w="full" justifyContent={'space-between'} my="20px">
                                <HStack>
                                    <Text>QTY</Text>
                                    {(product?.quantity as number) > 0 && (
                                        <HStack width="auto" p="5px" borderWidth={'2px'} borderRadius={'full'} borderColor={'gray.200'} spaceX={3}>
                                            <Button onClick={() => handleQuantityChange({ type: 'DEC' })} w="40px" h="40px" borderRadius={'full'} bgColor="gray.200" variant={'subtle'}>
                                                <Minus variant='Outline' color="black" />
                                            </Button>
                                            <Text>{quantity}</Text>
                                            <Button onClick={() => handleQuantityChange({ type: 'INC' })} w="40px" h="40px" borderRadius={'full'} bgColor="gray.200" variant={'subtle'}>
                                                <Add variant='Outline' color="black" />
                                            </Button>
                                        </HStack>
                                    )}
                                    {(product?.quantity as number) < 1 && (
                                        <Text color='red'>OUT OF STOCK</Text>
                                    )}
                                </HStack>

                                {(product?.quantity as number) > 0 && !product?.outOfStock && (
                                    <Button w="150px" h="50px" bgColor="primaryColor" color="white" borderRadius={'full'} onClick={handleShowModal} >Checkout</Button>
                                )}
                                {(product?.quantity as number) < 1 && product?.outOfStock && (
                                    <Text fontFamily={'sans-serif'} fontWeight={600} fontSize={'18px'} color="red">OUT OF STOCK</Text>
                                )}
                            </HStack>

                            <Box display={['block', 'block', 'none', 'none']}>
                                <Box height={'20px'} />
                                {product?.location?.latlng ? (
                                    <MapComponent
                                        lat={parseFloat(product?.location?.latlng.split(' ')[0])}
                                        lng={parseFloat(product?.location?.latlng.split(' ')[1])}
                                        width="100%"
                                        height="200px"
                                        zoom={15}
                                        borderRadius="16px"
                                        markerTitle={product?.name || 'Product Location'}
                                    />
                                ) : (
                                    <Box w='full' h="200px" mt='20px' borderRadius={'16px'} bgColor="gray.100"></Box>
                                )}
                            </Box>

                            <VStack mt={["40px", "40px", "20px", "20px"]} w="full" alignItems={'flex-start'}>
                                <HStack>
                                    <Truck variant='Bold' color='lightgreen' size={'25px'} />
                                    <Text color="green.300" fontSize={'20px'} fontWeight={'700'}>Shipping on all orders:</Text>
                                </HStack>
                                <Text>
                                    Seller-Fulfilled Shipping - The seller handles the entire shipping process and not Chasescroll.

                                    Verify that items are in good condition and meet the expected quality standards before authorizing payment.

                                    Please inform us if you encounter any issues at support@chasescroll.com
                                </Text>
                            </VStack>

                            <HStack mt="20px" alignItems={'center'}>
                                <Star1 variant='Bold' color='gold' size="25px" />
                                <Text fontWeight="bold" fontSize={'18px'}>{product?.rating ?? 0}</Text>
                            </HStack>

                        </Box>
                    </Flex>
                )}

                {isLoading && (
                    <Flex w='full' h="full" spaceX={[0, 0, 6, 6]} mt="10px" flexDirection={['column', 'column', 'row', 'row']}>
                        <Box flex={1} h="full">
                            <Skeleton w="full" h="500px" borderRadius={'16px'} mb='10px' />
                            <Skeleton w="full" h="150px" mb="5px" borderRadius={'16px'} />
                        </Box>
                        <Box flex={1} h="full">
                            <Skeleton w="full" h="50px" mb="5px" borderRadius={'8px'} />
                            <Skeleton w="full" h="50px" mb="5px" borderRadius={'8px'} />
                        </Box>
                    </Flex>
                )}
            </Container>
        </Box>
    )
}

export default Product
