'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Flex, Portal, Text } from '@chakra-ui/react';
import { IoIosAdd, IoIosClose, IoIosRemove } from 'react-icons/io';
import useCustomTheme from '@/hooks/useTheme';
import { useRouter } from 'next/navigation';
import { IRental } from '@/models/product';
import { formatNumber } from '@/utils/formatNumber';
import { LANDINGPAGE_URL } from '@/services/urls';

export function RentalTermAndCondition() {
    const { primaryColor, mainBackgroundColor, borderColor, headerTextColor, bodyTextColor } =
        useCustomTheme();
    const [open, setOpen] = useState(false);

    return (
        <>
            <Text
                role="button"
                onClick={() => setOpen(true)}
                fontSize="12px"
                color={primaryColor}
                textDecor="underline"
                cursor="pointer"
                fontWeight="500"
            >
                Terms and Conditions
            </Text>

            {open && (
                <Portal>
                    <Box
                        position="fixed"
                        inset="0"
                        zIndex="99999"
                        bgColor="rgba(0, 0, 0, 0.6)"
                        backdropFilter="blur(4px)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p="4"
                        onClick={() => setOpen(false)}
                    >
                        <Box
                            bgColor={mainBackgroundColor}
                            maxW="520px"
                            w="full"
                            rounded="16px"
                            p="6"
                            shadow="2xl"
                            borderWidth="1px"
                            borderColor={borderColor}
                            onClick={(e) => e.stopPropagation()}
                            display="flex"
                            flexDir="column"
                            gap="4"
                        >
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text fontSize="18px" fontWeight="700" color={headerTextColor}>
                                    Rental Terms & Conditions
                                </Text>
                                <Box
                                    role="button"
                                    cursor="pointer"
                                    onClick={() => setOpen(false)}
                                    p="1"
                                    rounded="full"
                                    _hover={{ bg: 'gray.100' }}
                                >
                                    <IoIosClose size="24px" />
                                </Box>
                            </Flex>

                            <Box
                                fontSize="13px"
                                color={bodyTextColor}
                                maxH="320px"
                                overflowY="auto"
                                display="flex"
                                flexDir="column"
                                gap="3"
                                pr="2"
                            >
                                <Text fontWeight="600" color={headerTextColor}>
                                    1. Rental Period & Returns
                                </Text>
                                <Text>
                                    Items must be picked up and returned at the agreed times. Overstaying
                                    the agreed rental period without prior written consent may incur
                                    additional charges based on hourly or daily rates.
                                </Text>

                                <Text fontWeight="600" color={headerTextColor}>
                                    2. Care & Proper Usage
                                </Text>
                                <Text>
                                    The renter agrees to use the item solely for its intended purpose and
                                    maintain its proper condition. Any damage beyond standard wear and
                                    tear will be assessed and billed to the renter.
                                </Text>

                                <Text fontWeight="600" color={headerTextColor}>
                                    3. Verification & Security
                                </Text>
                                <Text>
                                    Valid identification may be required by the vendor or platform prior to
                                    item collection or delivery.
                                </Text>

                                <Text fontWeight="600" color={headerTextColor}>
                                    4. Cancellation & Dispute Resolution
                                </Text>
                                <Text>
                                    Cancellations made within permissible booking windows adhere to standard
                                    Chasescroll safety policies. All rental disputes are mediated through
                                    Chasescroll Support.
                                </Text>
                            </Box>

                            <Button
                                onClick={() => setOpen(false)}
                                bgColor={primaryColor}
                                color="white"
                                rounded="full"
                                h="42px"
                                w="full"
                                fontWeight="600"
                            >
                                I Understand
                            </Button>
                        </Box>
                    </Box>
                </Portal>
            )}
        </>
    );
}

export default function RentalCheckout({
    setQty,
    qty,
    item,
}: {
    setQty: React.Dispatch<React.SetStateAction<number>> | ((cb: any) => void);
    qty: number;
    item: IRental;
}) {
    const { borderColor, secondaryBackgroundColor, primaryColor, mainBackgroundColor } =
        useCustomTheme();
    const router = useRouter();

    const [selectType, setSelectType] = useState<string>('');

    // Preselect timeline
    useEffect(() => {
        if (!item?.dailyPrice && item?.hourlyPrice) {
            setSelectType('HOURLY');
        } else if (!item?.hourlyPrice && item?.dailyPrice) {
            setSelectType('DAILY');
        } else if (item?.frequency === 'HOURLY') {
            setSelectType('HOURLY');
        } else if (item?.frequency === 'DAILY') {
            setSelectType('DAILY');
        }
    }, [item?.dailyPrice, item?.hourlyPrice, item?.frequency]);

    const unitPrice = useMemo(() => {
        if (selectType === 'HOURLY') {
            return item?.hourlyPrice || item?.price || 0;
        }
        if (selectType === 'DAILY') {
            return item?.dailyPrice || item?.price || 0;
        }
        return item?.price || item?.dailyPrice || item?.hourlyPrice || 0;
    }, [selectType, item?.hourlyPrice, item?.dailyPrice, item?.price]);

    const totalPrice = useMemo(() => {
        return Number(unitPrice) * Number(qty || 1);
    }, [unitPrice, qty]);

    const clickHandler = () => {
        const queryParams = new URLSearchParams({
            rentalId: item?.id || '',
            qty: String(qty || 1),
            frequency: selectType || item?.frequency || 'DAILY',
            price: String(totalPrice),
        });
        router.push(`${LANDINGPAGE_URL}/auth?${queryParams.toString()}`);
    };

    const hasBothOptions =
        Boolean(item?.dailyPrice && item?.hourlyPrice) || item?.frequency === 'BOTH';

    return (
        <Flex
            w="full"
            bgColor={mainBackgroundColor}
            rounded="16px"
            flexDirection="column"
            borderWidth="1px"
            p={['4', '4', '24px']}
            gap="3"
            borderColor={borderColor}
            boxShadow="0px 20px 70px 0px rgba(194, 194, 194, 0.1)"
        >
            <Flex
                gap="2"
                flexDir={['column', 'column', 'row']}
                alignItems={['flex-start', 'flex-start', 'center']}
            >
                <Text fontSize="14px" fontWeight="medium">
                    Starting Price:
                </Text>
                <Flex flexDir="column" gap="1">
                    {item?.dailyPrice && (
                        <Text fontSize="14px">
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                {formatNumber(item.dailyPrice)}
                            </span>
                            {' /Per day'}
                        </Text>
                    )}
                    {item?.hourlyPrice && (
                        <Text fontSize="14px">
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                {formatNumber(item.hourlyPrice)}
                            </span>
                            {' /Per hour'}
                        </Text>
                    )}
                    {!item?.dailyPrice && !item?.hourlyPrice && item?.price && (
                        <Text fontSize="14px">
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                {formatNumber(item.price)}
                            </span>
                            {item?.frequency === 'DAILY' ? ' /Per day' : ' /Per hour'}
                        </Text>
                    )}
                </Flex>
            </Flex>

            {hasBothOptions && (
                <select
                    value={selectType}
                    onChange={(e) => setSelectType(e.target.value)}
                    style={{
                        borderRadius: '9999px',
                        fontSize: '14px',
                        border: `1px solid ${borderColor}`,
                        backgroundColor: mainBackgroundColor,
                        padding: '10px 16px',
                        width: '100%',
                        outline: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <option value="">Select Timeline</option>
                    <option value="HOURLY">Hourly</option>
                    <option value="DAILY">Daily</option>
                </select>
            )}

            <Flex
                alignItems="center"
                flexDir={['column', 'column', 'row']}
                gap={['2', '2', '3']}
            >
                <Text fontSize={['12px', '12px', '14px']} fontWeight="500">
                    Number of {selectType === 'HOURLY' ? 'hours' : 'days'}
                </Text>
                <Flex
                    rounded="full"
                    alignItems="center"
                    padding="6px 12px"
                    gap="3"
                    borderWidth="1px"
                    borderColor={borderColor}
                >
                    <button
                        type="button"
                        onClick={() => setQty((prev: any) => (prev <= 1 ? 1 : prev - 1))}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '9999px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: secondaryBackgroundColor,
                            cursor: 'pointer',
                            border: 'none',
                        }}
                    >
                        <IoIosRemove size="18px" />
                    </button>
                    <Text fontSize="16px" fontWeight="600" minW="20px" textAlign="center">
                        {qty}
                    </Text>
                    <button
                        type="button"
                        disabled={Boolean(
                            item?.maximiumNumberOfDays &&
                                qty >= item.maximiumNumberOfDays &&
                                selectType !== 'HOURLY'
                        )}
                        onClick={() =>
                            setQty((prev: any) => {
                                if (
                                    item?.maximiumNumberOfDays &&
                                    selectType !== 'HOURLY' &&
                                    prev >= item.maximiumNumberOfDays
                                ) {
                                    return prev;
                                }
                                return prev + 1;
                            })
                        }
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '9999px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: secondaryBackgroundColor,
                            cursor: Boolean(
                                item?.maximiumNumberOfDays &&
                                    qty >= item.maximiumNumberOfDays &&
                                    selectType !== 'HOURLY'
                            )
                                ? 'not-allowed'
                                : 'pointer',
                            opacity: Boolean(
                                item?.maximiumNumberOfDays &&
                                    qty >= item.maximiumNumberOfDays &&
                                    selectType !== 'HOURLY'
                            )
                                ? 0.5
                                : 1,
                            border: 'none',
                        }}
                    >
                        <IoIosAdd size="18px" />
                    </button>
                </Flex>
            </Flex>

            <Flex flexDir="column" gap="2" alignItems="center" mt="2">
                <Button
                    onClick={clickHandler}
                    disabled={hasBothOptions && !selectType}
                    w="full"
                    h={['45px', '45px', '52px']}
                    rounded="full"
                    bgColor={primaryColor}
                    color="white"
                    fontWeight="semibold"
                    fontSize="15px"
                    _hover={{ opacity: 0.9 }}
                >
                    {`Rent for ${formatNumber(totalPrice)}`}
                </Button>
                <RentalTermAndCondition />
            </Flex>
        </Flex>
    );
}
