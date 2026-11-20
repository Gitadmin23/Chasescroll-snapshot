'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';
import { Box, Flex, Text, Skeleton } from '@chakra-ui/react';
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
import { currentIdAtom } from './Event';
import { IProduct } from '@/models/product';
import { PaginatedResponse } from '@/models/PaginatedResponse';
import MapComponent from '@/components/Custom/MapComponent';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { formatNumber } from '@/utils/formatNumber';
import { STORAGE_KEYS } from '@/utils/StorageKeys';
import { TruckColoredIcon } from '@/components/svg';
import { IoIosArrowForward } from 'react-icons/io';
import useCustomTheme from '@/hooks/useTheme';
import { useColorMode } from '@/components/ui/color-mode';
import ProductImageScroller from '@/components/Custom/productImageScroller';
import ShareButton from '@/components/Custom/ShareButton';
import DescriptionCard from '@/components/Custom/description';
import GetCreatorData from '@/components/getCreatorData';
import ProductCheckout from '@/components/productCheckout';
import ProductModal from '@/components/Custom/modals/ProductModal/ProductModal';
import {
    activeProductAtom,
    activeProductQuantityAtom,
    activeProductColorAtom,
    activeProductSizeAtom,
} from '@/states/activeProduct';
import { ticketurchaseStepAtom } from '@/states/activeTicket';

function Product({ id }: { id: string }) {
    const router = useRouter();
    const setCurrentId = useSetAtom(currentIdAtom);
    const { colorMode } = useColorMode();

    const {
        primaryColor,
        secondaryBackgroundColor,
        mainBackgroundColor,
        headerTextColor,
        borderColor,
    } = useCustomTheme();

    const [quantity, setQuantity] = useAtom(activeProductQuantityAtom);
    const [, setCurrentStep] = useAtom(ticketurchaseStepAtom);
    const [product, setProduct] = useAtom(activeProductAtom);
    const [, setAmount] = useAtom(activeProductQuantityAtom);
    const [, setActiveColor] = useAtom(activeProductColorAtom);
    const [, setActiveSize] = useAtom(activeProductSizeAtom);
    const [showModal, setShowModal] = useState(false);

    // Selected color and size states
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');

    // Safely sync currentId without render-phase side effects
    useEffect(() => {
        if (id) {
            setCurrentId(id);
        }
    }, [id, setCurrentId]);

    const { isLoading, data, isError } = useQuery({
        queryKey: [`get-external-product-single-${id}`],
        queryFn: () =>
            httpService.get(`${URLS.product}/search`, {
                params: {
                    id,
                },
            }),
    });

    useEffect(() => {
        // Initialize saved values if they exist
        try {
            const step = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
            if (step) {
                setCurrentStep(Number(step) || 1);
                if (Number(step) > 1) {
                    setShowModal(true);
                }
            }

            const savedProduct = localStorage.getItem(STORAGE_KEYS.PRODUCT);
            if (savedProduct) {
                setProduct(JSON.parse(savedProduct));
            }

            const savedQty = localStorage.getItem(STORAGE_KEYS.PRODUCT_QUANTITY);
            if (savedQty) {
                setQuantity(Number(savedQty) || 1);
                setAmount(Number(savedQty) || 1);
            } else {
                setQuantity(1);
                setAmount(1);
            }

            const savedColor = localStorage.getItem(STORAGE_KEYS.PRODUCT_COLOR);
            if (savedColor) {
                setSelectedColor(savedColor);
                setActiveColor(savedColor);
            }

            const savedSize = localStorage.getItem(STORAGE_KEYS.PRODUCT_SIZE);
            if (savedSize) {
                setSelectedSize(savedSize);
                setActiveSize(savedSize);
            }
        } catch (e) {
            console.error('Failed to read from localStorage:', e);
        }
    }, [setCurrentStep, setProduct, setQuantity, setAmount, setActiveColor, setActiveSize]);

    useEffect(() => {
        if (!isLoading && !isError && data?.data) {
            const item: PaginatedResponse<IProduct> = data?.data;
            if (item?.content && item.content.length > 0) {
                setProduct(item.content[0]);
            }
        }
    }, [data, isError, isLoading, setProduct]);

    // Dynamically update the page title when product data loads
    useEffect(() => {
        if (product?.name) {
            document.title = `Product | ${capitalizeFLetter(product.name)}`;
        } else {
            document.title = 'Product';
        }
    }, [product?.name]);

    // Provision available sizes (product sizes or default sizes)
    const availableSizes: string[] = useMemo(() => {
        if (Array.isArray(product?.size) && product.size.length > 0) {
            return product.size.map((s: any) =>
                typeof s === 'string' ? s : s?.label || s?.name || String(s)
            );
        }
        return ['S', 'M', 'L', 'XL', 'XXL'];
    }, [product?.size]);

    // Provision available colors (product colors or default colors)
    const availableColors = useMemo(() => {
        if (Array.isArray(product?.color) && product.color.length > 0) {
            return product.color.map((item: any) => {
                if (typeof item === 'string') {
                    return { label: item, color: item.toLowerCase() };
                }
                return {
                    label: item?.label || item?.name || 'Color',
                    color: item?.color || item?.hex || '#333333',
                };
            });
        }
        return [
            { label: 'Black', color: '#1A202C' },
            { label: 'Navy Blue', color: '#2B6CB0' },
            { label: 'Charcoal Gray', color: '#4A5568' },
            { label: 'Burgundy', color: '#881337' },
            { label: 'Classic White', color: '#FFFFFF' },
        ];
    }, [product?.color]);

    // Mark default size (first option) if none selected
    useEffect(() => {
        if (availableSizes.length > 0 && !selectedSize) {
            const defaultSize = availableSizes[0];
            setSelectedSize(defaultSize);
            setActiveSize(defaultSize);
            try {
                localStorage.setItem(STORAGE_KEYS.PRODUCT_SIZE, defaultSize);
            } catch { }
        }
    }, [availableSizes, selectedSize, setActiveSize]);

    // Mark default color (first option) if none selected
    useEffect(() => {
        if (availableColors.length > 0 && !selectedColor) {
            const defaultColor = availableColors[0].label;
            setSelectedColor(defaultColor);
            setActiveColor(defaultColor);
            try {
                localStorage.setItem(STORAGE_KEYS.PRODUCT_COLOR, defaultColor);
            } catch { }
        }
    }, [availableColors, selectedColor, setActiveColor]);

    // Size selection handler
    const handleSizeClick = (sizeVal: string) => {
        setSelectedSize(sizeVal);
        setActiveSize(sizeVal);
        try {
            localStorage.setItem(STORAGE_KEYS.PRODUCT_SIZE, sizeVal);
        } catch { }
    };

    // Color selection handler
    const handleColorClick = (colorLabel: string) => {
        setSelectedColor(colorLabel);
        setActiveColor(colorLabel);
        try {
            localStorage.setItem(STORAGE_KEYS.PRODUCT_COLOR, colorLabel);
        } catch { }
    };

    // Validated coordinates for Google Maps
    const coordinates = useMemo(() => {
        if (!product?.location?.latlng) return null;
        const [latStr, lngStr] = product.location.latlng.split(' ');
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
        }
        return null;
    }, [product?.location?.latlng]);

    // Check if the product is sold out
    const isSoldOut = useMemo(() => {
        return Boolean(
            (product?.quantity !== undefined && product.quantity < 1) ||
            product?.outOfStock
        );
    }, [product?.quantity, product?.outOfStock]);

    // Loading skeleton placeholder
    if (isLoading) {
        return (
            <Flex w="full" px="6" pt="6" pb="12" gap="6" flexDir="column">
                <Flex w="full" gap="4" flexDir={['column', 'column', 'row']}>
                    <Flex w="full" flexDir="column" gap="4">
                        <Skeleton h="20px" w="220px" rounded="md" />
                        <Skeleton h={['340px', '340px', '520px']} w="full" rounded="8px" />
                    </Flex>
                    <Flex w="full" flexDir="column" gap="4">
                        <Skeleton h="32px" w="75%" rounded="md" />
                        <Skeleton h="28px" w="40%" rounded="md" />
                        <Skeleton h="80px" w="full" rounded="8px" />
                        <Skeleton h="60px" w="full" rounded="full" />
                        <Skeleton h="50px" w="full" rounded="8px" />
                        <Skeleton h="50px" w="full" rounded="8px" />
                    </Flex>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex
            pos={'relative'}
            w={'full'}
            px={'6'}
            pt={['6', '6', '6', '6']}
            pb={'12'}
            gap={'6'}
            flexDir={'column'}
            overflowY={'auto'}
            overflowX={'hidden'}
        >
            {showModal && (
                <ProductModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    type="PRODUCT"
                />
            )}

            <Flex w={'full'} gap={'4'} flexDir={['column', 'column', 'row']}>
                {/* Left Column: Breadcrumb, Image Scroller & Desktop Map */}
                <Flex w={'full'} flexDir={'column'} gap={'4'}>
                    <Flex gap={'1'} alignItems={'center'}>
                        <Text
                            role="button"
                            onClick={() => router.back()}
                            fontSize={'14px'}
                            color={primaryColor}
                            fontWeight={'500'}
                            cursor="pointer"
                            _hover={{ textDecoration: 'underline' }}
                        >
                            Back
                        </Text>
                        <IoIosArrowForward />
                        <Text fontSize={'14px'} fontWeight={'500'}>
                            Product details
                        </Text>
                        <IoIosArrowForward />
                        <Text fontSize={'14px'} fontWeight={'500'}>
                            {product?.name}
                        </Text>
                    </Flex>

                    <Flex w={'full'} pos={'relative'}>
                        <ProductImageScroller
                            rounded={'8px'}
                            height={['340px', '340px', '520px']}
                            images={product?.images}
                        />
                        <ShareButton itemLabel="Product" />
                    </Flex>

                    <Flex w={'full'} display={['none', 'none', 'flex']}>
                        {coordinates ? (
                            <MapComponent
                                lat={coordinates.lat}
                                lng={coordinates.lng}
                                width="100%"
                                height="200px"
                                zoom={15}
                                borderRadius="16px"
                                markerTitle={product?.name || 'Product Location'}
                            />
                        ) : (
                            <Box w="full" h="200px" mt="20px" borderRadius={'16px'} bgColor="gray.100" />
                        )}
                    </Flex>
                </Flex>

                {/* Right Column: Title, Price, Description, Creator, Checkout, Color & Size */}
                <Flex w={'full'} flexDir={'column'} gap={'4'}>
                    <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'} gap={'2'}>
                        <Text fontWeight={'700'} fontSize={['16px', '16px', '24px']}>
                            {capitalizeFLetter(product?.name)}
                        </Text>
                        {isSoldOut ? (
                            <Flex
                                px={'3'}
                                py={'1'}
                                rounded={'full'}
                                bg={'red.50'}
                                borderWidth={'1px'}
                                borderColor={'red.200'}
                                color={'red.600'}
                                fontSize={'12px'}
                                fontWeight={'bold'}
                                alignItems={'center'}
                                gap={'1.5'}
                            >
                                <Box w={'2'} h={'2'} rounded={'full'} bg={'red.500'} />
                                Sold Out
                            </Flex>
                        ) : (
                            <Flex
                                px={'3'}
                                py={'1'}
                                rounded={'full'}
                                bg={'green.50'}
                                borderWidth={'1px'}
                                borderColor={'green.200'}
                                color={'green.700'}
                                fontSize={'12px'}
                                fontWeight={'medium'}
                                alignItems={'center'}
                                gap={'1.5'}
                            >
                                <Box w={'2'} h={'2'} rounded={'full'} bg={'green.500'} />
                                In Stock ({product?.quantity ?? 1} available)
                            </Flex>
                        )}
                    </Flex>

                    <Flex flexDir={['column-reverse', 'column-reverse', 'column']} gap={'4'}>
                        <Flex display={['none', 'none', 'flex']}>
                            <DescriptionCard
                                limit={200}
                                label="Product Details"
                                description={product?.description}
                            />
                        </Flex>
                        <Flex alignItems={'center'} gap={'3'} flexWrap={'wrap'}>
                            <Text fontSize={'24px'} fontWeight={'700'}>
                                {formatNumber((product?.price || 0) * (quantity || 1))}
                            </Text>
                            {isSoldOut && (
                                <Text fontSize={'sm'} fontWeight={'semibold'} color={'red.500'}>
                                    (Currently Sold Out)
                                </Text>
                            )}
                        </Flex>
                    </Flex>

                    <Flex w={'full'} flexDir={['column-reverse', 'column-reverse', 'column']} gap={'2'}>
                        <Flex display={['flex', 'flex', 'none']}>
                            <DescriptionCard
                                limit={100}
                                label="Product Details"
                                description={product?.description}
                            />
                        </Flex>
                        <Flex w={'full'} gap={'2'}>
                            <Flex w={['fit-content', 'fit-content', 'full']}>
                                <GetCreatorData userData={product?.creator} />
                            </Flex>
                            <Flex display={['flex', 'flex', 'none']} w={'full'}>
                                <ProductCheckout
                                    qty={quantity}
                                    setQty={setQuantity}
                                    item={product}
                                    color={selectedColor}
                                    size={selectedSize}
                                />
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Desktop Checkout */}
                    <Flex display={['none', 'none', 'flex']}>
                        <ProductCheckout
                            qty={quantity}
                            setQty={setQuantity}
                            item={product}
                            color={selectedColor}
                            size={selectedSize}
                        />
                    </Flex>

                    {/* ================= COLOR AND SIZE SELECTORS (UNDER QTY & CHECKOUT) ================= */}
                    <Flex w={'full'} gap={'4'} flexDir={['column', 'row']} mt={'1'}>
                        {/* Sizes */}
                        {availableSizes?.length > 0 && (
                            <Flex w={'full'} flexDir={'column'} gap={'2'}>
                                <Text fontWeight={'600'} fontSize={'14px'} color={headerTextColor}>
                                    Size:{' '}
                                    <Text as="span" color={primaryColor} fontWeight="bold">
                                        {selectedSize}
                                    </Text>
                                </Text>
                                <Flex gap={'2'} flexWrap={'wrap'}>
                                    {availableSizes.map((item: string) => {
                                        const isSelected = selectedSize === item;
                                        return (
                                            <Flex
                                                key={item}
                                                w={'fit-content'}
                                                minW={'42px'}
                                                h={'36px'}
                                                px={'3'}
                                                borderWidth={'1.5px'}
                                                borderColor={isSelected ? primaryColor : borderColor}
                                                cursor={'pointer'}
                                                onClick={() => handleSizeClick(item)}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                rounded={'lg'}
                                                fontSize={'xs'}
                                                fontWeight={isSelected ? '700' : '500'}
                                                color={isSelected ? 'white' : headerTextColor}
                                                bgColor={
                                                    isSelected
                                                        ? primaryColor
                                                        : colorMode === 'dark'
                                                            ? 'gray.800'
                                                            : mainBackgroundColor
                                                }
                                                transition="all 0.15s ease"
                                                _hover={{ borderColor: primaryColor }}
                                            >
                                                {item}
                                            </Flex>
                                        );
                                    })}
                                </Flex>
                            </Flex>
                        )}

                        {/* Colors */}
                        {availableColors?.length > 0 && (
                            <Flex w={'full'} flexDir={'column'} gap={'2'}>
                                <Text fontWeight={'600'} fontSize={'14px'} color={headerTextColor}>
                                    Color:{' '}
                                    <Text as="span" color={primaryColor} fontWeight="bold">
                                        {selectedColor}
                                    </Text>
                                </Text>
                                <Flex gap={'2'} flexWrap={'wrap'}>
                                    {availableColors.map((item: any) => {
                                        const label = item?.label || item;
                                        const hexColor = item?.color || item;
                                        const isSelected = selectedColor === label;
                                        return (
                                            <Flex
                                                key={label}
                                                w={'fit-content'}
                                                gap={'2'}
                                                px={'3'}
                                                h={'36px'}
                                                borderWidth={'1.5px'}
                                                borderColor={isSelected ? primaryColor : borderColor}
                                                cursor={'pointer'}
                                                onClick={() => handleColorClick(label)}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                                rounded={'lg'}
                                                fontSize={'xs'}
                                                fontWeight={isSelected ? '700' : '500'}
                                                color={headerTextColor}
                                                bgColor={
                                                    isSelected
                                                        ? secondaryBackgroundColor
                                                        : colorMode === 'dark'
                                                            ? 'gray.800'
                                                            : mainBackgroundColor
                                                }
                                                transition="all 0.15s ease"
                                                _hover={{ borderColor: primaryColor }}
                                            >
                                                <Flex
                                                    w={'4'}
                                                    h={'4'}
                                                    rounded={'full'}
                                                    borderWidth={'1px'}
                                                    borderColor="gray.300"
                                                    bgColor={hexColor}
                                                />
                                                {label}
                                            </Flex>
                                        );
                                    })}
                                </Flex>
                            </Flex>
                        )}
                    </Flex>

                    {/* Shipping Assurance */}
                    <Flex gap={'3'} mt={'4'}>
                        <Flex w={'28px'} h={'28px'} justifyContent={'center'} alignItems={'center'}>
                            <TruckColoredIcon />
                        </Flex>
                        <Text color={'#0CC23A'} fontWeight={'600'}>
                            Shipping on all orders:
                        </Text>
                    </Flex>
                    <Flex flexDir={'column'} gap={'3'}>
                        <Text fontSize={'14px'} fontWeight={'500'}>
                            {`Seller-Fulfilled Shipping - The seller handles the entire shipping process and not Chasescroll.`}
                        </Text>
                        <Text fontSize={'14px'} fontWeight={'500'}>
                            Verify that items are in good condition and meet the expected quality standards before authorizing payment.
                        </Text>
                        <Text fontSize={'14px'} fontWeight={'500'}>
                            Please inform us if you encounter any issues at support@chasescroll.com
                        </Text>
                    </Flex>

                    {/* Mobile Map Section */}
                    <Flex w={'full'} display={['flex', 'flex', 'none']}>
                        {coordinates ? (
                            <MapComponent
                                lat={coordinates.lat}
                                lng={coordinates.lng}
                                width="100%"
                                height="200px"
                                zoom={15}
                                borderRadius="16px"
                                markerTitle={product?.name || 'Product Location'}
                            />
                        ) : (
                            <Box w="full" h="200px" mt="20px" borderRadius={'16px'} bgColor="gray.100" />
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Product;
