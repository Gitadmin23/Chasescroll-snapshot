'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Box, Flex, Grid, Image, Text, Skeleton } from '@chakra-ui/react';
import ShareButton from '@/components/Custom/ShareButton';
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
import { IRental } from '@/models/product';
import { RESOURCE_URL } from '@/constants';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { dateFormat, timeFormat } from '@/utils/dateFormat';
import useCustomTheme from '@/hooks/useTheme';
import DescriptionCard from '@/components/Custom/description';
import GetCreatorData from '@/components/getCreatorData';
import MapComponent from '@/components/Custom/MapComponent';
import RentalCheckout from '@/components/rentalCheckout';
import { CalendarIcon } from '@/components/svg';
import { IoIosArrowForward } from 'react-icons/io';

function getImageUrl(src?: string) {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    return `${RESOURCE_URL}${src}`;
}

export function RentalDetail({ id }: { id: string }) {
    const router = useRouter();
    const [item, setItem] = useState<IRental>({} as IRental);
    const [qty, setQty] = useState<number>(1);
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

    const {
        primaryColor,
        secondaryBackgroundColor,
        borderColor,
        bodyTextColor,
    } = useCustomTheme();

    const { isLoading, data: queryData } = useQuery({
        queryKey: ['rental', id],
        queryFn: () =>
            httpService.get(`${URLS.rental}/search`, {
                params: { id },
            }),
    });

    useEffect(() => {
        const content = queryData?.data?.content;
        if (Array.isArray(content) && content.length > 0) {
            setItem(content[0]);
        }
    }, [queryData]);

    // Dynamically update document title
    useEffect(() => {
        if (item?.name) {
            document.title = `${capitalizeFLetter(item.name)} | Chasescroll Rental`;
        } else {
            document.title = 'Rental Details | Chasescroll';
        }
    }, [item?.name]);

    // Parse coordinates for MapComponent
    const coordinates = useMemo(() => {
        if (!item?.location?.latlng) return null;
        const [latStr, lngStr] = item.location.latlng.split(' ');
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
        }
        return null;
    }, [item?.location?.latlng]);

    const activeImage =
        item?.images && item.images.length > 0
            ? getImageUrl(item.images[activeImageIndex] || item.images[0])
            : '';

    if (isLoading) {
        return (
            <Flex
                w="full"
                flexDir="column"
                gap="6"
                overflowY="auto"
                h="full"
                px={['4', '4', '6']}
                py="6"
            >
                <Skeleton h="24px" w="220px" rounded="md" />
                <Flex w="full" gap="4" flexDir={['column', 'column', 'row']}>
                    <Skeleton h={['340px', '340px', '520px']} w="full" rounded="16px" />
                    <Flex w="full" flexDir="column" gap="4">
                        <Skeleton h="36px" w="75%" rounded="md" />
                        <Skeleton h="20px" w="45%" rounded="md" />
                        <Skeleton h="120px" w="full" rounded="12px" />
                        <Skeleton h="70px" w="full" rounded="12px" />
                    </Flex>
                </Flex>
            </Flex>
        );
    }

    return (
        <Flex
            w="full"
            flexDir="column"
            gap="6"
            pos="relative"
            overflowY="auto"
            h="full"
            px={['4', '4', '6']}
            pb={['12', '12', '6']}
            py="6"
        >
            {/* Breadcrumb Navigation */}
            <Flex gap="1" alignItems="center" pb="1" flexWrap="wrap">
                <Text
                    role="button"
                    onClick={() => router.back()}
                    fontSize="14px"
                    color={primaryColor}
                    fontWeight="500"
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                >
                    Back
                </Text>
                <IoIosArrowForward />
                <Text fontSize="14px" fontWeight="500">
                    Rental details
                </Text>
                {item?.name && (
                    <>
                        <IoIosArrowForward />
                        <Text
                            fontSize="14px"
                            fontWeight="500"
                            maxW="260px"
                            truncate
                        >
                            {capitalizeFLetter(item.name)}
                        </Text>
                    </>
                )}
            </Flex>

            {/* Top Details Section */}
            <Flex w="full" gap="6" flexDir={['column', 'column', 'row']}>
                {/* Images Scroller / Grid */}
                <Flex
                    w="full"
                    h={['340px', '340px', '580px']}
                    bgColor={secondaryBackgroundColor}
                    pos="relative"
                    rounded="16px"
                    borderWidth="1px"
                    borderColor={borderColor}
                    p="2"
                    justifyContent="center"
                    alignItems="center"
                    overflow="hidden"
                >
                    <ShareButton itemLabel="Rental" right="3" bottom="3" />
                    {activeImage ? (
                        <Image
                            src={activeImage}
                            alt={item?.name || 'Rental item'}
                            rounded="12px"
                            maxH="100%"
                            maxW="100%"
                            objectFit="contain"
                            transition="all 0.2s ease"
                        />
                    ) : (
                        <Box
                            w="full"
                            h="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="gray.400"
                        >
                            <Text fontSize="14px">No image available</Text>
                        </Box>
                    )}

                    {/* Thumbnail navigation */}
                    {item?.images && item.images.length > 1 && (
                        <Grid
                            templateColumns="repeat(4, 1fr)"
                            pos="absolute"
                            gap="2"
                            insetX="4"
                            bottom="4"
                            zIndex="2"
                        >
                            {item.images.slice(0, 4).map((subitem: string, index: number) => {
                                const isSelected = index === activeImageIndex;
                                return (
                                    <Flex
                                        key={index}
                                        role="button"
                                        onClick={() => setActiveImageIndex(index)}
                                        w="full"
                                        h={['60px', '75px', '90px']}
                                        bgColor={secondaryBackgroundColor}
                                        rounded="8px"
                                        borderWidth="2px"
                                        borderColor={isSelected ? primaryColor : 'transparent'}
                                        overflow="hidden"
                                        shadow="md"
                                        cursor="pointer"
                                        opacity={isSelected ? 1 : 0.8}
                                        _hover={{ opacity: 1 }}
                                        transition="all 0.2s"
                                    >
                                        <Image
                                            src={getImageUrl(subitem)}
                                            alt={`Rental preview ${index + 1}`}
                                            w="full"
                                            h="full"
                                            objectFit="cover"
                                        />
                                    </Flex>
                                );
                            })}
                        </Grid>
                    )}
                </Flex>

                {/* Right Column: Information & Checkout */}
                <Flex w="full" flexDir="column" gap="4">
                    <Flex w="full" flexDir="column" gap="1">
                        <Text
                            fontSize={['22px', '24px', '28px']}
                            fontWeight="700"
                            lineHeight="1.2"
                        >
                            {capitalizeFLetter(item?.name || 'Rental item')}
                        </Text>
                        {item?.category && (
                            <Text
                                fontSize="13px"
                                fontWeight="600"
                                color={primaryColor}
                                textTransform="capitalize"
                            >
                                {item.category.replaceAll('_', ' ')}
                            </Text>
                        )}
                        {item?.creator?.data?.mobilePhone?.value && (
                            <Text fontWeight="medium" fontSize="14px" color={bodyTextColor} mt="1">
                                Phone: {item.creator.data.mobilePhone.value}
                            </Text>
                        )}
                    </Flex>

                    {/* Description */}
                    {item?.description && (
                        <DescriptionCard
                            limit={200}
                            label="Rental Details"
                            description={item.description}
                        />
                    )}

                    {/* Joined Date */}
                    {item?.createdDate && (
                        <Flex gap="2" alignItems="center">
                            <Text fontWeight="600" fontSize="14px" w="60px">
                                Joined
                            </Text>
                            <CalendarIcon color={primaryColor} />
                            <Text fontSize={['12px', '12px', '14px']}>
                                {dateFormat(item.createdDate)} {timeFormat(item.createdDate)}
                            </Text>
                        </Flex>
                    )}

                    {/* Creator Info */}
                    {item?.creator && (
                        <Flex w="full">
                            <GetCreatorData userData={item.creator} />
                        </Flex>
                    )}

                    {/* Mobile Rental Checkout */}
                    <Flex display={['flex', 'flex', 'none']} w="full" mt="2">
                        <RentalCheckout setQty={setQty} qty={qty} item={item} />
                    </Flex>

                    {/* Desktop Rental Checkout */}
                    <Flex display={['none', 'none', 'flex']} w="fit" mt="auto">
                        <RentalCheckout setQty={setQty} qty={qty} item={item} />
                    </Flex>
                </Flex>
            </Flex>
            {/* Map Section */}
            {(coordinates || item?.location?.locationDetails) && (
                <Flex w="full" flexDir="column" gap="2" mt="2">
                    {item?.location?.locationDetails && (
                        <Text fontSize="sm" color={bodyTextColor} fontWeight="medium">
                            {item.location.locationDetails}
                        </Text>
                    )}
                    {coordinates && (
                        <Box
                            rounded="16px"
                            overflow="hidden"
                            borderWidth="1px"
                            borderColor={borderColor}
                        >
                            <MapComponent
                                lat={coordinates.lat}
                                lng={coordinates.lng}
                                width="100%"
                                height="260px"
                                borderRadius="16px"
                                markerTitle={item?.name || 'Rental Location'}
                            />
                        </Box>
                    )}
                </Flex>
            )}
        </Flex>
    );
}

export default RentalDetail;
