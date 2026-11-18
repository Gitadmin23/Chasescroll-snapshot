"use client";

import React from "react";
import {
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Flex,
  Text,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { usePaystackPayment } from "react-paystack";
import httpService from "@/services/httpService";
import { URLS } from "@/services/urls";
import { toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import {
  activeEventAtom,
  activeTicketAtom,
  createdTicketAtom,
  isPaystackOpenAtom,
  paystackDetailsAtom,
  selectedTicketsAtom,
  ticketCountAtom,
  ticketurchaseStepAtom,
  totalAmountForSelectedTicketsAtom,
} from "@/states/activeTicket";
import { ArrowLeft, User } from "iconsax-reactjs";
import { formatNumber } from "@/utils/formatNumber";
import { RESOURCE_URL } from "@/constants";
import useForm from "@/hooks/useForm";
import { accountCreationSchema } from "@/services/validation";
import CustomInput from "../../CustomInput";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { ITicketCreatedModel } from "@/models/TicketCreatedModel";
import { IUser } from "@/models/User";
import useCustomTheme from "@/hooks/useTheme";
import { useRouter, useSearchParams } from "next/navigation";
import { LANDINGPAGE_URL } from "@/helpers/services/urls";

function AccountSetup() {
  const [, setStep] = useAtom(ticketurchaseStepAtom);
  const [ticket] = useAtom(activeTicketAtom);
  const [event] = useAtom(activeEventAtom);
  const [quantity] = useAtom(ticketCountAtom);
  const [, setPaystackDetails] = useAtom(paystackDetailsAtom);
  const [selectedTickets] = useAtom(selectedTicketsAtom);
  const setCreatedTicket = useSetAtom(createdTicketAtom);
  const setIsPaystackOpen = useSetAtom(isPaystackOpenAtom);
  const [totalSelectedTicketPrice, setTotalSelectedTicketPrice] = useAtom(
    totalAmountForSelectedTicketsAtom
  );

  // Reset paystack overlay state on unmount
  React.useEffect(() => {
    return () => {
      setIsPaystackOpen(false);
    };
  }, [setIsPaystackOpen]);

  const { primaryColor } = useCustomTheme();
  const query = useSearchParams();
  const affiliateID = query?.get("affiliateID") || undefined;
  const router = useRouter()

  const [createTicketIsLoading, setCreateTicketIsLoading] = React.useState(false);
  const [showLink, setShowLink] = React.useState(false);
  const [lastOrderCode, setLastOrderCode] = React.useState<string | null>(null);

  const getStoredToken = React.useCallback(() => {
    if (typeof window === "undefined") return null;
    return (
      sessionStorage.getItem(STORAGE_KEYS.token) ||
      sessionStorage.getItem("token") ||
      localStorage.getItem(STORAGE_KEYS.token) ||
      localStorage.getItem("token")
    );
  }, []);

  const getStoredUserId = React.useCallback(() => {
    if (typeof window === "undefined") return null;
    return (
      sessionStorage.getItem(STORAGE_KEYS.USER_ID) ||
      sessionStorage.getItem("user_id") ||
      localStorage.getItem(STORAGE_KEYS.USER_ID) ||
      localStorage.getItem("user_id")
    );
  }, []);

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(() => {
    return Boolean(getStoredToken() && getStoredUserId());
  });

  const [userDetails, setUserDetails] = React.useState<IUser | null>(() => {
    try {
      if (typeof window === "undefined") return null;
      const item =
        sessionStorage.getItem(STORAGE_KEYS.USER_DETAILS) ||
        localStorage.getItem(STORAGE_KEYS.USER_DETAILS);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  // Sync auth & user details on mount
  React.useEffect(() => {
    try {
      const token = getStoredToken();
      const userId = getStoredUserId();
      const logged = Boolean(token && userId);
      setIsLoggedIn(logged);

      const userItem =
        sessionStorage.getItem(STORAGE_KEYS.USER_DETAILS) ||
        localStorage.getItem(STORAGE_KEYS.USER_DETAILS);
      if (userItem) {
        setUserDetails(JSON.parse(userItem));
      } else if (logged && userId) {
        httpService
          .get(`${URLS.GET_PUBLIC_PROIFLE}/${userId}`)
          .then((res) => {
            if (res.data) {
              sessionStorage.setItem(
                STORAGE_KEYS.USER_DETAILS,
                JSON.stringify(res.data)
              );
              setUserDetails(res.data);
            }
          })
          .catch(() => { });
      }
    } catch (e) {
      console.error("Error reading auth state:", e);
    }
  }, [getStoredToken, getStoredUserId]);

  const handleSignOut = React.useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEYS.token);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem(STORAGE_KEYS.refreshToken);
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem(STORAGE_KEYS.USER_ID);
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
      sessionStorage.removeItem(STORAGE_KEYS.GOOGLE_AUTH);
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem("token");
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      localStorage.removeItem("refresh_token");
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      localStorage.removeItem("user_id");
      localStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
      localStorage.removeItem(STORAGE_KEYS.GOOGLE_AUTH);
    }
    setUserDetails(null);
    setIsLoggedIn(false);
  }, []);

  const { data: session } = useSession();

  // Initialize paystack hook
  const initializePayment = usePaystackPayment({
    publicKey:
      process.env.NEXT_PUBLIC_PAYSTACK_KEY ||
      "pk_test_58a8e726bbe3cce8ade3082f4e49f46089046b5d",
    email: "",
    amount: 0,
    reference: "",
  });

  const getTicketPrice = (ticketType: string) => {
    const found = event?.productTypeData?.find((item) => item.ticketType === ticketType);
    return Number(found?.ticketPrice) || 0;
  };

  const calculateTotal = React.useCallback(() => {
    let total = 0;
    selectedTickets?.forEach((item) => {
      total += getTicketPrice(item.ticketType) * item.quantity;
    });
    setTotalSelectedTicketPrice(total);
    return total;
  }, [selectedTickets, event?.productTypeData, setTotalSelectedTicketPrice]);

  React.useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  // Ticket verification after payment
  const validateTicket = useMutation({
    mutationFn: (orderCode: string) =>
      httpService.get("/payments/verifyWebPaystackTx", {
        params: { orderCode },
      }),
    onSuccess: () => {
      toaster.create({
        title: "Success",
        description: "Payment verified successfully!",
        type: "success",
      });
      setStep(4);
    },
    onError: (error: any) => {
      toaster.create({
        title: "Verification Error",
        description: error?.message || "Failed to verify transaction. Please contact support.",
        type: "error",
      });
      // Even if webhook verification is delayed, order was created
      setStep(4);
    },
  });

  // Launch Paystack directly without requiring a second button click
  const triggerPaystack = React.useCallback(
    (orderCode: string, buyerEmail: string, orderTotal: number) => {
      const amountInKobo = Math.round(Number(orderTotal) * 100);
      setLastOrderCode(orderCode);

      try {
        setIsPaystackOpen(true);
        initializePayment({
          config: {
            email: buyerEmail,
            amount: amountInKobo,
            reference: orderCode,
          },
          onSuccess: () => {
            setIsPaystackOpen(false);
            validateTicket.mutate(orderCode);
          },
          onClose: () => {
            setIsPaystackOpen(false);
            setCreateTicketIsLoading(false);
            toaster.create({
              title: "Payment Window Closed",
              description: "Payment was not completed. Click to retry when ready.",
              type: "info",
            });
          },
        });
      } catch (err: any) {
        setIsPaystackOpen(false);
        setCreateTicketIsLoading(false);
        toaster.create({
          title: "Payment Gateway Error",
          description: err?.message || "Could not launch Paystack. Please try again.",
          type: "error",
        });
      }
    },
    [initializePayment, validateTicket, setIsPaystackOpen]
  );

  // Ticket creation handler
  const createTicket = async (data: {
    eventID: string;
    ticketBuyObjectList: { ticketType: string; numberOfTickets: number }[];
    affiliateID?: string;
  }) => {
    setCreateTicketIsLoading(true);
    try {
      const res = await httpService.post(`${URLS.event}/create-multi-ticket`, data);
      const json: ITicketCreatedModel = res.data;

      setCreatedTicket(json);

      if (!json?.content) {
        toaster.create({
          title: "Error",
          description: json?.message || "Failed to create ticket order",
          type: "error",
        });
        setCreateTicketIsLoading(false);
        return;
      }

      // If free ticket (0 total), advance directly to step 4
      if (totalSelectedTicketPrice === 0 || json.content.orderTotal === 0) {
        toaster.create({
          title: "Success",
          description: "Free ticket registered successfully!",
          type: "success",
        });
        setStep(4);
        return;
      }

      // Automatically launch Paystack popup
      const orderCode: string = String(json.content.orderCode || "");
      const buyerEmail: string = String(
        json.content.email ||
        json.content.buyer?.email ||
        values?.email ||
        userDetails?.email ||
        ""
      );
      const orderTotal: number = Number(json.content.orderTotal || 0);

      setPaystackDetails({
        email: buyerEmail,
        reference: orderCode,
        amount: orderTotal * 100,
      });

      triggerPaystack(orderCode, buyerEmail, orderTotal);
    } catch (error: any) {
      setIsPaystackOpen(false);
      toaster.create({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to create ticket",
        type: "error",
      });
      setCreateTicketIsLoading(false);
    }
  };

  const getPublicProfile = useMutation({
    mutationFn: (uId: string) => httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${uId}`),
    onSuccess: (data) => {
      const details: IUser = data?.data;
      if (details && typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
      }
      setUserDetails(details);
      setIsLoggedIn(true);

      createTicket({
        eventID: event?.id as string,
        ticketBuyObjectList: (selectedTickets || []).map((item) => ({
          ticketType: item.ticketType,
          numberOfTickets: item.quantity,
        })),
        ...(affiliateID ? { affiliateID } : {}),
      });
    },
    onError: () => {
      setCreateTicketIsLoading(false);
    },
  });

  const checkEmailMutation = useMutation({
    mutationFn: async (formData: any) =>
      httpService.post(`${URLS.auth}/temporary-signup`, formData),
    onError: (error: any) => {
      setCreateTicketIsLoading(false);
      toaster.create({
        title: "Error",
        description: error?.message || "Could not proceed with checkout details",
        type: "error",
      });
    },
    onSuccess: (data) => {
      if (data?.data?.["stackTrace"]) {
        setShowLink(true);
        setCreateTicketIsLoading(false);
      } else {
        const accessToken = data?.data?.access_token;
        const refreshToken = data?.data?.refresh_token;
        const userId = data?.data?.user_id;

        if (typeof window !== "undefined") {
          sessionStorage.setItem(STORAGE_KEYS.token, accessToken);
          sessionStorage.setItem("token", accessToken);
          sessionStorage.setItem(STORAGE_KEYS.USER_ID, userId);
          sessionStorage.setItem("user_id", userId);
          sessionStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
          sessionStorage.setItem("refresh_token", refreshToken);
        }
        getPublicProfile.mutate(userId);
      }
    },
  });

  // Start with clean, non-prefilled fields for guest checkout
  const { renderForm, values } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    onSubmit: (formData: { firstName: string; lastName: string; email: string }) => {
      if (lastOrderCode && totalSelectedTicketPrice > 0) {
        triggerPaystack(lastOrderCode, formData.email, totalSelectedTicketPrice);
        return;
      }

      checkEmailMutation.mutate(formData);
    },
    validationSchema: accountCreationSchema,
  });

  const handlePaySignedIn = () => {
    const buyerEmail =
      userDetails?.email ||
      session?.user?.email ||
      "";

    if (lastOrderCode && totalSelectedTicketPrice > 0) {
      triggerPaystack(lastOrderCode, buyerEmail, totalSelectedTicketPrice);
      return;
    }

    createTicket({
      eventID: event?.id as string,
      ticketBuyObjectList: (selectedTickets || []).map((item) => ({
        ticketType: item.ticketType,
        numberOfTickets: item.quantity,
      })),
      ...(affiliateID ? { affiliateID } : {}),
    });
  };

  const isFormLoading =
    createTicketIsLoading ||
    checkEmailMutation.isPending ||
    getPublicProfile.isPending ||
    validateTicket.isPending;

  const isFormValid = Boolean(values?.email && values?.firstName && values?.lastName);

  const eventBannerUrl = event?.currentPicUrl
    ? event.currentPicUrl.startsWith("http")
      ? event.currentPicUrl
      : `${RESOURCE_URL}${event.currentPicUrl}`
    : "/images/tech-event.jpg";

  const routeToLandingPage = () => {

    const queryParams = new URLSearchParams({
      eventId: event?.id || '',
    });
    router.push(`${LANDINGPAGE_URL}/auth?${queryParams.toString()}`);
  }

  // --- SIGNED-IN PREVIEW VIEW ---
  // Preview ticket selection and buyer profile before initiating payment
  if (isLoggedIn) {
    return (
      <Box w="full" bg="white" borderRadius="2xl" overflow="hidden">
        {/* Top Header */}
        <HStack
          px={["4", "6"]}
          py="4"
          borderBottomWidth="1px"
          borderColor="gray.100"
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack gap="3">
            <IconButton
              aria-label="Go back to ticket selection"
              variant="ghost"
              size="sm"
              rounded="full"
              onClick={() => setStep(1)}
            >
              <ArrowLeft size="18" />
            </IconButton>
            <VStack align="start" gap="0">
              <Text fontSize="lg" fontWeight="bold">
                Review & Confirm Selection
              </Text>
              <Text fontSize="xs" color="gray.500">
                Preview your ticket order before proceeding to payment
              </Text>
            </VStack>
          </HStack>
        </HStack>

        <Box p={["4", "6"]}>
          {/* User Account Card */}
          <Flex
            mb="4"
            p="3.5"
            borderRadius="12px"
            borderWidth="1px"
            borderColor="gray.200"
            bgColor="gray.50"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap="3"
          >
            <HStack gap="3">
              <Flex
                w="38px"
                h="38px"
                borderRadius="full"
                bgColor="primaryColor"
                color="white"
                alignItems="center"
                justifyContent="center"
              >
                <User size="20" color="#fff" />
              </Flex>
              <VStack align="start" gap="0">
                <HStack gap="2">
                  <Text fontWeight="bold" fontSize="sm">
                    {userDetails
                      ? `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim() || "Signed In User"
                      : "Signed In User"}
                  </Text>
                  <Badge colorPalette="green" size="sm" rounded="full">
                    Signed In
                  </Badge>
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  {userDetails?.email || session?.user?.email || "Account verified"}
                </Text>
              </VStack>
            </HStack>

            <Button
              variant="ghost"
              size="xs"
              color="gray.500"
              _hover={{ color: "red.500" }}
              onClick={handleSignOut}
            >
              Switch Account
            </Button>
          </Flex>

          {/* Event Preview Pill */}
          <HStack
            mb="4"
            p="3.5"
            borderRadius="12px"
            borderWidth="1px"
            borderColor="gray.200"
            bgColor="white"
            gap="3"
            alignItems="center"
          >
            <Image
              src={eventBannerUrl}
              alt={event?.eventName || "Event"}
              w="52px"
              h="52px"
              objectFit="cover"
              borderRadius="8px"
            />
            <VStack align="start" gap="0.5" flex="1">
              <Text fontWeight="semibold" fontSize="sm" lineClamp={1}>
                {event?.eventName || "Event"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {event?.startDate
                  ? new Date(event.startDate).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                  : "Upcoming"}
              </Text>
              {event?.location?.locationDetails && (
                <Text fontSize="xs" color="gray.400" lineClamp={1}>
                  📍 {event.location.locationDetails}
                </Text>
              )}
            </VStack>
            <Text fontWeight="bold" fontSize="sm" color="primaryColor">
              {totalSelectedTicketPrice === 0
                ? "Free"
                : `NGN ${formatNumber(totalSelectedTicketPrice)}`}
            </Text>
          </HStack>

          {/* Selected Tickets Breakdown */}
          <Box
            mb="5"
            p="4"
            borderRadius="12px"
            borderWidth="1px"
            borderColor="gray.200"
            bgColor="gray.50"
          >
            <Flex justifyContent="space-between" alignItems="center" mb="2.5">
              <Text fontSize="xs" fontWeight="bold" color="gray.600" textTransform="uppercase">
                Selected Tickets ({selectedTickets?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) || 0})
              </Text>
              <Button
                variant="ghost"
                size="xs"
                color="primaryColor"
                onClick={() => setStep(1)}
              >
                Edit Selection
              </Button>
            </Flex>

            <VStack align="stretch" gap="2">
              {selectedTickets?.map((item, idx) => (
                <Flex key={idx} justify="space-between" fontSize="sm" py="1">
                  <HStack gap="2">
                    <Badge size="sm" variant="subtle" colorPalette="blue" rounded="md">
                      {item.quantity}x
                    </Badge>
                    <Text fontWeight="medium" color="gray.800">
                      {item.ticketType}
                    </Text>
                  </HStack>
                  <Text fontWeight="semibold" color="gray.700">
                    NGN {formatNumber(getTicketPrice(item.ticketType) * item.quantity)}
                  </Text>
                </Flex>
              ))}

              <Box my="2" borderBottomWidth="1px" borderColor="gray.200" />

              <Flex justify="space-between" fontSize="md" fontWeight="bold">
                <Text>Total to Pay</Text>
                <Text color="primaryColor" fontSize="lg">
                  {totalSelectedTicketPrice === 0
                    ? "Free"
                    : `NGN ${formatNumber(totalSelectedTicketPrice)}`}
                </Text>
              </Flex>
            </VStack>
          </Box>

          {/* Pay Button */}
          <Button
            w="full"
            h="48px"
            bgColor="primaryColor"
            size="lg"
            color="white"
            borderRadius="full"
            fontWeight="semibold"
            disabled={createTicketIsLoading}
            loading={createTicketIsLoading}
            loadingText="Processing..."
            onClick={handlePaySignedIn}
            _hover={{ opacity: 0.9 }}
            transition="all 0.2s"
          >
            {totalSelectedTicketPrice === 0
              ? "Get Free Ticket"
              : `Pay NGN ${formatNumber(totalSelectedTicketPrice)}`}
          </Button>

          <HStack w="full" justifyContent="center" mt="3">
            <Text color="gray.400" fontSize="12px">
              Secured by
            </Text>
            <Text color="primaryColor" fontSize="12px" fontWeight={600}>
              Paystack
            </Text>
          </HStack>
        </Box>
      </Box>
    );
  }

  // --- GUEST CHECKOUT VIEW ---
  return renderForm(
    <Box w="full" bg="white" borderRadius="2xl" overflow="hidden">
      {/* Top Header */}
      <HStack
        px={["4", "6"]}
        py="4"
        borderBottomWidth="1px"
        borderColor="gray.100"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack gap="3">
          <IconButton
            aria-label="Go back"
            variant="ghost"
            size="sm"
            rounded="full"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          >
            <ArrowLeft size="18" />
          </IconButton>
          <VStack align="start" gap="0">
            <Text fontSize="lg" fontWeight="bold">
              Buyer Details
            </Text>
            <Text fontSize="xs" color="gray.500">
              Provide attendee details to complete your order
            </Text>
          </VStack>
        </HStack>
      </HStack>

      <Flex w="full" flexDir={["column", "column", "row"]} gap="0">
        {/* Left Side: Form */}
        <Box flex="1" p={["4", "6"]}>
          {/* Sign In Banner for Existing Users */}
          <Flex
            mb="4"
            p="3"
            borderRadius="12px"
            bgColor="blue.50"
            borderWidth="1px"
            borderColor="blue.100"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize="xs" color="blue.700">
              Have a Chasescroll account?
            </Text>
            <Button
              size="xs"
              variant="outline"
              colorPalette="blue"
              borderRadius="full"
              onClick={() => routeToLandingPage()}
            >
              Sign In
            </Button>
          </Flex>

          {/* Compact Event Pill */}
          <HStack
            mb="4"
            p="3"
            borderRadius="12px"
            borderWidth="1px"
            borderColor="gray.200"
            bgColor="gray.50"
            gap="3"
            alignItems="center"
          >
            <Image
              src={eventBannerUrl}
              alt={event?.eventName || "Event"}
              w="50px"
              h="50px"
              objectFit="cover"
              borderRadius="8px"
            />
            <VStack align="start" gap="0" flex="1">
              <Text fontWeight="semibold" fontSize="sm" lineClamp={1}>
                {event?.eventName || "Event"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {event?.startDate
                  ? new Date(event.startDate).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                  : "Upcoming"}
              </Text>
            </VStack>
            <Text fontWeight="bold" fontSize="sm" color="primaryColor">
              {totalSelectedTicketPrice === 0
                ? "Free"
                : `NGN ${formatNumber(totalSelectedTicketPrice)}`}
            </Text>
          </HStack>

          {/* Form Fields */}
          <VStack align="stretch" gap="3.5" mb="5">
            <Flex gap="3" flexDir={["column", "row"]}>
              <Box flex="1">
                <CustomInput
                  name="firstName"
                  type="text"
                  label="First Name"
                  placeholder="Enter first name"
                  autoComplete="off"
                />
              </Box>
              <Box flex="1">
                <CustomInput
                  name="lastName"
                  type="text"
                  label="Last Name"
                  placeholder="Enter last name"
                  autoComplete="off"
                />
              </Box>
            </Flex>

            <Box w="full">
              <CustomInput
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                autoComplete="off"
              />
              {showLink && (
                <Box mt="2" p="2.5" borderRadius="8px" bg="red.50" borderWidth="1px" borderColor="red.200">
                  <Text fontSize="xs" color="red.600">
                    An account already exists with this email. For security, please{" "}
                    <Text
                      as="span"
                      onClick={() => routeToLandingPage()}
                      cursor="pointer"
                      color="primaryColor"
                      fontWeight="bold"
                      textDecoration="underline"
                    >
                      Sign In
                    </Text>{" "}
                    to continue.
                  </Text>
                </Box>
              )}
            </Box>
          </VStack>

          {/* Mobile Order Summary */}
          <Box display={["block", "block", "none"]} mb="4" p="3" bg="gray.50" rounded="12px" borderWidth="1px" borderColor="gray.100">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb="2" textTransform="uppercase">
              Order Summary
            </Text>
            {selectedTickets?.map((item, idx) => (
              <Flex key={idx} justify="space-between" fontSize="sm" py="1">
                <Text color="gray.700">
                  {item.quantity}x {item.ticketType}
                </Text>
                <Text fontWeight="medium">
                  NGN {formatNumber(getTicketPrice(item.ticketType) * item.quantity)}
                </Text>
              </Flex>
            ))}
          </Box>

          {/* Primary Action Button */}
          <Button
            w="full"
            h="48px"
            bgColor="primaryColor"
            size="lg"
            color="white"
            borderRadius="full"
            fontWeight="semibold"
            disabled={!isFormValid || isFormLoading}
            loading={isFormLoading}
            loadingText="Processing..."
            type="submit"
            _hover={{ opacity: 0.9 }}
            transition="all 0.2s"
          >
            {totalSelectedTicketPrice === 0
              ? "Get Free Ticket"
              : `Pay NGN ${formatNumber(totalSelectedTicketPrice)}`}
          </Button>

          <HStack w="full" justifyContent="center" mt="3">
            <Text color="gray.400" fontSize="12px">
              Secured by
            </Text>
            <Text color="primaryColor" fontSize="12px" fontWeight={600}>
              Paystack
            </Text>
          </HStack>
        </Box>

        {/* Right Side: Desktop Order Summary */}
        <Box
          w="300px"
          bg="gray.50"
          p="6"
          borderLeftWidth="1px"
          borderColor="gray.200"
          display={["none", "none", "flex"]}
          flexDir="column"
          justifyContent="space-between"
        >
          <Box>
            <Text fontSize="md" fontWeight="bold" mb="4">
              Order Summary
            </Text>

            <VStack align="stretch" gap="3">
              {selectedTickets?.map((item, index) => (
                <Flex key={index} justify="space-between" fontSize="sm">
                  <Text color="gray.600">
                    {item.quantity}x {item.ticketType}
                  </Text>
                  <Text fontWeight="semibold">
                    NGN {formatNumber(getTicketPrice(item.ticketType) * item.quantity)}
                  </Text>
                </Flex>
              ))}

              <Box my="2" borderBottomWidth="1px" borderColor="gray.200" />

              <Flex justify="space-between" fontSize="md" fontWeight="bold">
                <Text>Total</Text>
                <Text color="primaryColor">
                  {totalSelectedTicketPrice === 0
                    ? "Free"
                    : `NGN ${formatNumber(totalSelectedTicketPrice)}`}
                </Text>
              </Flex>
            </VStack>
          </Box>

          <Text fontSize="11px" color="gray.400" textAlign="center">
            Tickets will be delivered to the provided email address upon confirmation.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

export default AccountSetup;
