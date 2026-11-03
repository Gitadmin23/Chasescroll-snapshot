"use client";

import React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Add, Minus, ShoppingCart } from "iconsax-reactjs";
import { useAtom, useSetAtom } from "jotai";
import {
  activeEventAtom,
  selectedTicketsAtom,
  ticketCountAtom,
  ticketurchaseStepAtom,
  totalAmountForSelectedTicketsAtom,
} from "@/states/activeTicket";
import { IProductTypeData } from "@/models/Event";
import { toaster } from "@/components/ui/toaster";
import { formatNumber } from "@/utils/formatNumber";
import { dateFormat, timeFormat } from "@/utils/dateFormat";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import useCustomTheme from "@/hooks/useTheme";

interface TicketSelectionProps {
  eventTitle?: string;
  eventDate?: string;
  eventImage?: string;
}

const TicketSelection: React.FC<TicketSelectionProps> = ({
  eventTitle,
  eventDate,
  eventImage,
}) => {
  const [event] = useAtom(activeEventAtom);
  const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom);
  const setStep = useSetAtom(ticketurchaseStepAtom);
  const setTotalSelectedTicketPrice = useSetAtom(
    totalAmountForSelectedTicketsAtom
  );
  const [, setQuantity] = useAtom(ticketCountAtom);

  const { primaryColor } = useCustomTheme();

  const ticketsList: IProductTypeData[] = React.useMemo(() => {
    return event?.productTypeData || [];
  }, [event?.productTypeData]);

  // Safe quantity helper
  const getSelectedQuantity = React.useCallback(
    (ticketType: string) => {
      const found = (selectedTickets || []).find(
        (item) => item.ticketType === ticketType
      );
      return found?.quantity || 0;
    },
    [selectedTickets]
  );

  const getTicketPrice = React.useCallback(
    (ticketType: string) => {
      const ticket = ticketsList.find((item) => item.ticketType === ticketType);
      return Number(ticket?.ticketPrice) || 0;
    },
    [ticketsList]
  );

  // Total calculation
  const totalAmount = React.useMemo(() => {
    let total = 0;
    let count = 0;
    (selectedTickets || []).forEach((item) => {
      total += getTicketPrice(item.ticketType) * item.quantity;
      count += item.quantity;
    });
    setTotalSelectedTicketPrice(total);
    setQuantity(count > 0 ? count : 1);
    return total;
  }, [selectedTickets, getTicketPrice, setTotalSelectedTicketPrice, setQuantity]);

  // Quantity modification
  const increment = (ticketType: string) => {
    const eventTicket = ticketsList.find((item) => item.ticketType === ticketType);
    if (!eventTicket) return;

    const currentQty = getSelectedQuantity(ticketType);
    const maxBuy = Number(eventTicket.maxTicketBuy) || 10;
    const totalAvail =
      Number(eventTicket.totalNumberOfTickets) - Number(eventTicket.ticketsSold || 0);

    if (currentQty + 1 > maxBuy) {
      toaster.create({
        title: "Purchase Limit",
        description: `Maximum ${maxBuy} tickets allowed per person for this type.`,
        type: "error",
      });
      return;
    }

    if (currentQty + 1 > totalAvail) {
      toaster.create({
        title: "Sold Out",
        description: `Only ${totalAvail} tickets remaining.`,
        type: "error",
      });
      return;
    }

    const currentList = selectedTickets || [];
    const exists = currentList.find((item) => item.ticketType === ticketType);

    if (exists) {
      setSelectedTickets(
        currentList.map((item) =>
          item.ticketType === ticketType
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedTickets([...currentList, { ticketType, quantity: 1 }]);
    }
  };

  const decrement = (ticketType: string) => {
    const currentList = selectedTickets || [];
    const exists = currentList.find((item) => item.ticketType === ticketType);
    if (!exists) return;

    if (exists.quantity <= 1) {
      setSelectedTickets(currentList.filter((item) => item.ticketType !== ticketType));
    } else {
      setSelectedTickets(
        currentList.map((item) =>
          item.ticketType === ticketType
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const isTicketDisabled = (item: IProductTypeData) => {
    const now = new Date();
    if (item.endDate && new Date(Number(item.endDate)) < now) {
      return true;
    }
    const remaining =
      Number(item.totalNumberOfTickets) - Number(item.ticketsSold || 0);
    return remaining <= 0;
  };

  const handleNext = () => {
    if (!selectedTickets || selectedTickets.length === 0) {
      toaster.create({
        title: "Select a Ticket",
        description: "Please select at least one ticket to proceed.",
        type: "error",
      });
      return;
    }
    setStep(2);
  };

  const title = eventTitle || event?.eventName || "Event Tickets";
  const dateStr = eventDate || event?.startDate;

  return (
    <Box w="full" bg="white" p={["4", "6"]}>
      {/* Event Header Card */}
      <Flex
        w="full"
        pb="4"
        mb="5"
        borderBottomWidth="1px"
        borderColor="gray.100"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack gap="3.5">
          {eventImage && (
            <Image
              src={eventImage}
              alt={title}
              w="54px"
              h="54px"
              borderRadius="10px"
              objectFit="cover"
            />
          )}
          <VStack align="start" gap="0">
            <Text fontSize={["md", "lg"]} fontWeight="bold" color="gray.800">
              {capitalizeFLetter(title)}
            </Text>
            {dateStr && (
              <Text fontSize="xs" color="gray.500">
                {dateFormat(dateStr)} • {timeFormat(dateStr)}
              </Text>
            )}
          </VStack>
        </HStack>
      </Flex>

      {/* Main Layout: Tickets on left, summary on right */}
      <Flex w="full" flexDir={["column", "column", "row"]} gap="6">
        {/* Ticket Tiers List */}
        <VStack flex="1" align="stretch" gap="3.5">
          <Text fontSize="sm" fontWeight="semibold" color="gray.600">
            Available Tickets ({ticketsList.length})
          </Text>

          {ticketsList.length === 0 && (
            <Box py="8" textAlign="center">
              <Text color="gray.400" fontSize="sm">
                No tickets are currently listed for this event.
              </Text>
            </Box>
          )}

          {ticketsList.map((item, index) => {
            const qty = getSelectedQuantity(item.ticketType);
            const isSelected = qty > 0;
            const disabled = isTicketDisabled(item);
            const price = Number(item.ticketPrice) || 0;
            const remaining =
              Number(item.totalNumberOfTickets) - Number(item.ticketsSold || 0);

            return (
              <Flex
                key={index}
                p="4"
                borderRadius="14px"
                borderWidth="1.5px"
                borderColor={isSelected ? "primaryColor" : "gray.200"}
                bgColor={disabled ? "gray.50" : isSelected ? "blue.50/20" : "white"}
                justifyContent="space-between"
                alignItems="center"
                transition="all 0.2s ease"
                _hover={!disabled ? { borderColor: "primaryColor" } : undefined}
                opacity={disabled ? 0.6 : 1}
              >
                {/* Ticket Details */}
                <VStack align="start" gap="1" flex="1" pr="3">
                  <HStack gap="2">
                    <Text fontWeight="bold" fontSize="sm" color="gray.800">
                      {capitalizeFLetter(item.ticketType)}
                    </Text>
                    {item.ticketType?.toLowerCase().includes("early") && (
                      <Badge colorPalette="blue" size="sm" variant="subtle">
                        Early Bird
                      </Badge>
                    )}
                    {disabled && (
                      <Badge colorPalette="red" size="sm" variant="subtle">
                        Sold Out
                      </Badge>
                    )}
                  </HStack>

                  <Text fontSize="sm" fontWeight="bold" color={primaryColor}>
                    {price === 0 ? "Free" : `NGN ${formatNumber(price)}`}
                  </Text>

                  {item.description && (
                    <Text fontSize="xs" color="gray.500" lineClamp={2}>
                      {item.description}
                    </Text>
                  )}

                  {!disabled && remaining > 0 && remaining <= 10 && (
                    <Text fontSize="11px" color="orange.500" fontWeight="medium">
                      Only {remaining} left!
                    </Text>
                  )}
                </VStack>

                {/* Quantity Controls */}
                {!disabled ? (
                  <HStack gap="2.5" alignItems="center">
                    <IconButton
                      aria-label="Decrease quantity"
                      size="xs"
                      rounded="full"
                      variant="outline"
                      borderColor="gray.300"
                      disabled={qty === 0}
                      onClick={() => decrement(item.ticketType)}
                    >
                      <Minus size="14" />
                    </IconButton>

                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      minW="20px"
                      textAlign="center"
                    >
                      {qty}
                    </Text>

                    <IconButton
                      aria-label="Increase quantity"
                      size="xs"
                      rounded="full"
                      variant="solid"
                      bgColor="primaryColor"
                      color="white"
                      disabled={remaining <= qty}
                      onClick={() => increment(item.ticketType)}
                    >
                      <Add size="14" />
                    </IconButton>
                  </HStack>
                ) : (
                  <Text fontSize="xs" color="gray.400" fontWeight="medium">
                    Unavailable
                  </Text>
                )}
              </Flex>
            );
          })}
        </VStack>

        {/* Cart / Order Summary Sidebar */}
        <Box
          w={["full", "full", "320px"]}
          p="5"
          bg="gray.50"
          borderRadius="16px"
          borderWidth="1px"
          borderColor="gray.200"
          h="fit-content"
        >
          <HStack gap="2" mb="3">
            <ShoppingCart size="18" color="#666" />
            <Text fontSize="sm" fontWeight="bold" color="gray.800">
              Selected Tickets
            </Text>
          </HStack>

          {(!selectedTickets || selectedTickets.length === 0) ? (
            <Box py="6" textAlign="center">
              <Text fontSize="xs" color="gray.400">
                No tickets selected yet. Choose your tickets from the list.
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" gap="2.5" mb="4">
              {selectedTickets.map((t, i) => (
                <Flex key={i} justify="space-between" fontSize="xs">
                  <Text color="gray.600">
                    {t.quantity}x {t.ticketType}
                  </Text>
                  <Text fontWeight="semibold" color="gray.800">
                    NGN {formatNumber(getTicketPrice(t.ticketType) * t.quantity)}
                  </Text>
                </Flex>
              ))}

              <Box borderBottomWidth="1px" borderColor="gray.200" my="1" />

              <Flex justify="space-between" fontSize="sm" fontWeight="bold">
                <Text>Total</Text>
                <Text color="primaryColor">
                  {totalAmount === 0 ? "Free" : `NGN ${formatNumber(totalAmount)}`}
                </Text>
              </Flex>
            </VStack>
          )}

          <Button
            w="full"
            h="46px"
            bgColor="primaryColor"
            color="white"
            borderRadius="full"
            fontWeight="semibold"
            fontSize="sm"
            disabled={!selectedTickets || selectedTickets.length === 0}
            onClick={handleNext}
            _hover={{ opacity: 0.9 }}
            transition="all 0.2s"
          >
            Proceed to Details
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default TicketSelection;
