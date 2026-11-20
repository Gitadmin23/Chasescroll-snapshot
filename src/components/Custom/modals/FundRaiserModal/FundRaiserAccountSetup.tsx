"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Flex,
  Text,
  Input,
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
  isPaystackOpenAtom,
  paystackDetailsAtom,
  ticketurchaseStepAtom,
} from "@/states/activeTicket";
import { User } from "iconsax-reactjs";
import { formatNumber } from "@/utils/formatNumber";
import { RESOURCE_URL } from "@/constants";
import useForm from "@/hooks/useForm";
import { accountCreationSchema } from "@/services/validation";
import CustomInput from "../../CustomInput";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { ITicketCreatedModel } from "@/models/TicketCreatedModel";
import { IUser } from "@/models/User";
import {
  activeFundRaiserAtom,
  donationAmountAtom,
} from "@/states/activeFundraiser";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import useCustomTheme from "@/hooks/useTheme";

export interface ICustomOrderDto {
  seller: string;
  price: number;
  currency: "NGN";
  orderType: "DONATION" | "PPRODUCT";
  typeID: string;
}

function FundRaiserAccountSetup() {
  const [, setStep] = useAtom(ticketurchaseStepAtom);
  const [activeFundRaider] = useAtom(activeFundRaiserAtom);
  const [amount, setAmount] = useAtom(donationAmountAtom);
  const [paystackDetails, setPaystackDetails] = useAtom(paystackDetailsAtom);
  const setIsPaystackOpen = useSetAtom(isPaystackOpenAtom);

  const { primaryColor } = useCustomTheme();
  const { data: session } = useSession();

  const [donationIsLoading, setDonationIsLoading] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [lastOrderCode, setLastOrderCode] = useState<string | null>(null);

  // Reset paystack overlay state on unmount
  React.useEffect(() => {
    return () => {
      setIsPaystackOpen(false);
    };
  }, [setIsPaystackOpen]);

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

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(getStoredToken() && getStoredUserId());
  });

  const [userDetails, setUserDetails] = useState<IUser | null>(() => {
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

  // Sync auth state & public profile
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
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);

      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem("token");
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      localStorage.removeItem("refresh_token");
      localStorage.removeItem(STORAGE_KEYS.USER_ID);
      localStorage.removeItem("user_id");
      localStorage.removeItem(STORAGE_KEYS.USER_DETAILS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
    }
    setUserDetails(null);
    setIsLoggedIn(false);
    setLastOrderCode(null);
  }, []);

  const paystackConfig = React.useMemo(
    () => ({
      email: paystackDetails?.email || "",
      amount: paystackDetails?.amount || 0,
      reference: paystackDetails?.reference || "",
      publicKey:
        process.env.NEXT_PUBLIC_PAYSTACK_KEY ||
        "pk_test_58a8e726bbe3cce8ade3082f4e49f46089046b5d",
    }),
    [paystackDetails]
  );

  const initializePayment = usePaystackPayment(paystackConfig);

  const createDonation = useMutation({
    mutationFn: (data: {
      userID: string;
      fundRaiserID: string;
      amount: number;
    }) => httpService.post(`${URLS.donation}/create-donation`, data),
    onError: (error: any) => {
      toaster.create({
        title: "Notice",
        description: error?.message || "Payment recorded. If not reflected, please refresh.",
        type: "info",
      });
      setDonationIsLoading(false);
      setStep(3);
    },
    onSuccess: () => {
      toaster.create({
        title: "Success",
        description: "Donation completed successfully!",
        type: "success",
      });
      setDonationIsLoading(false);
      setStep(3);
    },
  });

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
            const uId = userDetails?.userId || getStoredUserId() || "";
            createDonation.mutate({
              userID: uId,
              fundRaiserID: activeFundRaider?.id as string,
              amount: Number(orderTotal),
            });
          },
          onClose: () => {
            setIsPaystackOpen(false);
            setDonationIsLoading(false);
            toaster.create({
              title: "Payment Window Closed",
              description: "Donation was not completed. Click to retry when ready.",
              type: "info",
            });
          },
        });
      } catch (err: any) {
        setIsPaystackOpen(false);
        setDonationIsLoading(false);
        toaster.create({
          title: "Payment Gateway Error",
          description: err?.message || "Could not launch Paystack. Please try again.",
          type: "error",
        });
      }
    },
    [initializePayment, createDonation, userDetails, getStoredUserId, activeFundRaider, setIsPaystackOpen]
  );

  const handleInitiateDonation = async (buyerEmail: string) => {
    if (!amount || amount <= 0) {
      toaster.create({
        title: "Amount is required",
        description: "Please enter a valid donation amount.",
        type: "error",
      });
      return;
    }

    setDonationIsLoading(true);

    try {
      const sellerId =
        activeFundRaider?.createdBy?.userId ||
        activeFundRaider?.creatorID ||
        activeFundRaider?.user?.userId ||
        "";

      const orderPayload: ICustomOrderDto = {
        seller: sellerId,
        price: Number(amount),
        currency: "NGN",
        orderType: "DONATION",
        typeID: activeFundRaider?.id || "",
      };

      const res = await httpService.post(`${URLS.payments}/createCustomOrder`, orderPayload);
      const item: ITicketCreatedModel = res.data;

      if (!item?.content?.orderCode) {
        toaster.create({
          title: "Error",
          description: item?.message || "Failed to create donation order.",
          type: "error",
        });
        setDonationIsLoading(false);
        return;
      }

      const orderCode = item.content.orderCode;
      const orderTotal = item.content.orderTotal || amount;

      setPaystackDetails({
        amount: orderTotal * 100,
        email: buyerEmail,
        reference: orderCode,
      });

      triggerPaystack(orderCode, buyerEmail, orderTotal);
    } catch (err: any) {
      setDonationIsLoading(false);
      toaster.create({
        title: "Error",
        description:
          err?.response?.data?.message || err?.message || "Failed to initiate donation payment.",
        type: "error",
      });
    }
  };

  const getPublicProfile = useMutation({
    mutationFn: (uId: string) => httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${uId}`),
    onSuccess: (data) => {
      const details: IUser = data?.data;
      if (details && typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
        localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
      }
      setUserDetails(details);
      setIsLoggedIn(true);

      const email = details?.email || values?.email || "";
      handleInitiateDonation(email + "");
    },
    onError: () => {
      const email = values?.email || "";
      handleInitiateDonation(email + "");
    },
  });

  const checkEmailMutation = useMutation({
    mutationFn: async (formData: any) =>
      httpService.post(`${URLS.auth}/temporary-signup`, formData),
    onError: (error: any) => {
      setDonationIsLoading(false);
      toaster.create({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Could not proceed with temporary account setup",
        type: "error",
      });
    },
    onSuccess: (data) => {
      if (data?.data?.["stackTrace"]) {
        setShowLink(true);
        setDonationIsLoading(false);
        toaster.create({
          title: "Account exists",
          description: data?.data?.message || "This email already exists. Please sign in.",
          type: "info",
        });
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

          localStorage.setItem(STORAGE_KEYS.token, accessToken);
          localStorage.setItem("token", accessToken);
          localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
          localStorage.setItem("user_id", userId);
        }

        getPublicProfile.mutate(userId);
      }
    },
  });

  // Clean guest checkout form without prefilled user data
  const { renderForm, values } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    onSubmit: (formData: { firstName: string; lastName: string; email: string }) => {
      if (!amount || amount <= 0) {
        toaster.create({
          title: "Amount is required",
          description: "Please enter a valid donation amount.",
          type: "error",
        });
        return;
      }

      if (lastOrderCode) {
        triggerPaystack(lastOrderCode, formData.email, amount);
        return;
      }

      setDonationIsLoading(true);
      checkEmailMutation.mutate(formData);
    },
    validationSchema: accountCreationSchema,
  });

  const bannerImageUrl = activeFundRaider?.bannerImage
    ? activeFundRaider.bannerImage.startsWith("http")
      ? activeFundRaider.bannerImage
      : `${RESOURCE_URL}${activeFundRaider.bannerImage}`
    : "/images/tech-event.jpg";

  const isFormLoading =
    donationIsLoading ||
    checkEmailMutation.isPending ||
    getPublicProfile.isPending ||
    createDonation.isPending;

  // --- SIGNED-IN PREVIEW VIEW ---
  if (isLoggedIn) {
    const buyerEmail = userDetails?.email || session?.user?.email || "";
    const buyerName =
      userDetails?.firstName || userDetails?.lastName
        ? `${userDetails.firstName || ""} ${userDetails.lastName || ""}`.trim()
        : buyerEmail || "Donor";

    return (
      <Box w="full" bg="white" borderRadius="2xl" overflow="hidden">
        {/* Top Header */}
        <HStack
          px={["4", "6"]}
          py={3}
          borderBottomWidth="1px"
          borderColor="gray.100"
          justifyContent="space-between"
          bg="gray.50"
        >
          <HStack spaceX={2}>
            <Box p={1.5} borderRadius="full" bg="blue.50" color="blue.600">
              <User size="16" />
            </Box>
            <VStack align="start" spaceY={0}>
              <Text fontSize="xs" color="gray.500">
                Signed in as
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color="gray.800" lineClamp={1}>
                {buyerName}
              </Text>
            </VStack>
          </HStack>
          <Button
            size="xs"
            variant="outline"
            colorPalette="gray"
            borderRadius="full"
            onClick={handleSignOut}
            fontWeight="medium"
          >
            Change Account
          </Button>
        </HStack>

        <Flex w="full" flexDir={["column", "column", "row"]}>
          {/* Main Info & Checkout */}
          <Box flex={[1, 1, "0.6", "0.6"]} p={["4", "6"]}>
            <VStack align="stretch" spaceY={4}>
              <HStack
                p={4}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.200"
                spaceX={4}
              >
                <Image
                  src={bannerImageUrl}
                  w="100px"
                  h="100px"
                  objectFit="cover"
                  borderRadius="lg"
                  alt={activeFundRaider?.name || "Fundraiser"}
                />
                <VStack align="start" spaceY={1} flex="1">
                  <Text fontWeight="bold" fontSize="md" color="gray.900" lineClamp={2}>
                    {capitalizeFLetter(activeFundRaider?.name) || "Fundraiser"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Goal: NGN {formatNumber(Number(activeFundRaider?.goal || 0))}
                  </Text>
                  <HStack>
                    <Text fontSize="xs" color="gray.500">
                      Raised:
                    </Text>
                    <Badge colorPalette="green" fontSize="xs">
                      NGN {formatNumber(Number(activeFundRaider?.total || 0))}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>

              {/* Amount Input */}
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                  Donation Amount (NGN)
                </Text>
                <Input
                  type="text"
                  value={amount === 0 ? "" : amount}
                  placeholder="Enter donation amount"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setAmount(Number(value));
                    }
                  }}
                  width="full"
                  height="45px"
                  color="black"
                  borderWidth="2px"
                  borderColor="#E5E5E5"
                  bgColor="#F5F5F5"
                  borderRadius="full"
                />
              </Box>

              {/* Donation Summary */}
              <Box p={4} bg="gray.50" borderRadius="xl">
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.600">
                    Total Contribution
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.900">
                    NGN {formatNumber(amount)}
                  </Text>
                </Flex>
              </Box>

              {/* Action Button */}
              <Button
                w="full"
                h="50px"
                bgColor="primaryColor"
                color="white"
                borderRadius="full"
                fontWeight="semibold"
                fontSize="md"
                onClick={() => handleInitiateDonation(buyerEmail)}
                loading={isFormLoading}
                disabled={amount <= 0 || isFormLoading}
                _hover={{ opacity: 0.9 }}
              >
                {amount > 0 ? `Donate NGN ${formatNumber(amount)}` : "Enter Donation Amount"}
              </Button>
            </VStack>
          </Box>

          {/* Right Summary Sidebar */}
          <Box
            flex="0.4"
            bg="gray.50"
            p={6}
            display={["none", "none", "block"]}
            borderLeftWidth="1px"
            borderColor="gray.100"
          >
            <Box w="full" h="200px" overflow="hidden" borderRadius="xl" mb={4}>
              <Image
                src={bannerImageUrl}
                w="100%"
                h="100%"
                objectFit="cover"
                alt="Banner"
              />
            </Box>
            <Text fontSize="md" fontWeight="bold" mb={2} color="gray.800">
              Contribution Summary
            </Text>
            <VStack spaceY={2} align="stretch">
              <Flex justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Donor
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                  {buyerName}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontSize="sm" color="gray.600">
                  Donation
                </Text>
                <Text fontSize="sm" fontWeight="bold" color={primaryColor}>
                  NGN {formatNumber(amount)}
                </Text>
              </Flex>
            </VStack>
          </Box>
        </Flex>
      </Box>
    );
  }

  // --- GUEST / TEMPORARY ACCOUNT VIEW ---
  return renderForm(
    <Box w="full" bg="white" borderRadius="xl" overflow="hidden">
      <Flex w="full">
        {/* Left Side - Checkout Form */}
        <Box flex={[1, 1, "0.6", "0.6"]} p="20px">
          <VStack align="start" spaceY={1} mb={6} borderBottomWidth="1px" borderColor="gray.100" pb={3}>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              Donation Checkout
            </Text>
            <Text fontSize="xs" color="gray.500">
              Enter your details to make a donation as guest
            </Text>
          </VStack>

          {/* Event Info Card */}
          <HStack
            mb={6}
            p={4}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            spaceX={4}
          >
            <Image
              src={bannerImageUrl}
              w="80px"
              h="80px"
              objectFit="cover"
              borderRadius="md"
              alt={activeFundRaider?.name || "Fundraiser"}
            />
            <VStack align="start" spaceY={1} flex="1">
              <Text fontWeight="semibold" fontSize="sm" color="gray.900" lineClamp={2}>
                {capitalizeFLetter(activeFundRaider?.name) || "Fundraiser"}
              </Text>
              <Text fontSize="xs" color="gray.600">
                Goal: NGN {formatNumber(Number(activeFundRaider?.goal || 0))}
              </Text>
              <HStack>
                <Text fontSize="xs" color="gray.500">
                  Raised:
                </Text>
                <Badge colorPalette="green" fontSize="xs">
                  NGN {formatNumber(Number(activeFundRaider?.total || 0))}
                </Badge>
              </HStack>
            </VStack>
          </HStack>

          {/* Donation Form */}
          <VStack align="stretch" spaceY={4} mb={6}>
            <Box>
              <Flex justify="space-between" align="center" mb={1}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  Donation Amount (NGN)
                </Text>
                {amount > 0 && (
                  <Text fontSize="xs" fontWeight="bold" color={primaryColor}>
                    NGN {formatNumber(amount)}
                  </Text>
                )}
              </Flex>
              <Input
                type="text"
                value={amount === 0 ? "" : amount}
                placeholder="0"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setAmount(Number(value));
                  }
                }}
                width="full"
                height="45px"
                color="black"
                borderWidth="2px"
                borderColor="#E5E5E5"
                bgColor="#F5F5F5"
                borderRadius="full"
              />
            </Box>

            <Flex flexDir={["column", "column", "row"]} gap="4" w="full">
              <Box w="full">
                <CustomInput
                  name="firstName"
                  label="First Name"
                  isPassword={false}
                  type="text"
                />
              </Box>

              <Box w="full">
                <CustomInput
                  name="lastName"
                  label="Last Name"
                  isPassword={false}
                  type="text"
                />
              </Box>
            </Flex>

            <Box w="full">
              <CustomInput
                name="email"
                label="Email"
                isPassword={false}
                type="email"
              />
              {showLink && (
                <Flex flexDir="row" w="full" justifyContent="space-between" gap="2" mt="10px">
                  <Text color="red.500" fontSize="sm">
                    This email address already exists.{" "}
                    <span
                      onClick={() => setStep(2)}
                      style={{
                        textDecoration: "underline",
                        color: primaryColor,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Sign in
                    </span>
                  </Text>
                </Flex>
              )}
            </Box>
          </VStack>

          {/* Submit Button */}
          <Button
            w="full"
            h="50px"
            bgColor="primaryColor"
            color="white"
            size="lg"
            borderRadius="full"
            px={8}
            loading={isFormLoading}
            type="submit"
            fontWeight="semibold"
            disabled={amount <= 0 || isFormLoading}
            _hover={{ opacity: 0.9 }}
          >
            Confirm & Donate
          </Button>
        </Box>

        {/* Right Side - Event Image & Summary */}
        <Box
          flex="0.4"
          position="relative"
          bgColor="gray.50"
          display={["none", "none", "block"]}
          borderLeftWidth="1px"
          borderColor="gray.100"
          p={6}
        >
          <Box w="100%" h="250px" overflow="hidden" borderRadius="xl" mb={4}>
            <Image
              src={bannerImageUrl}
              w="100%"
              h="100%"
              objectFit="cover"
              alt="Banner"
            />
          </Box>

          <Text fontSize="md" fontWeight="bold" mb={3} color="gray.800">
            Donation Summary
          </Text>

          <VStack spaceY={3} align="stretch">
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Amount
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.900">
                NGN {formatNumber(amount)}
              </Text>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default FundRaiserAccountSetup;
