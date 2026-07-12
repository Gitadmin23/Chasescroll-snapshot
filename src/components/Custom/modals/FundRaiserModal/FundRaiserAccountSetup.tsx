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
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import httpService from "@/services/httpService";
import { URLS } from "@/services/urls";
import { toaster } from "@/components/ui/toaster";
import { signIn, useSession, getSession } from "next-auth/react";
import {
  activeEventAtom,
  activeTicketAtom,
  canPayAtom,
  createdTicketAtom,
  currentUrlAtom,
  paystackDetailsAtom,
  ticketCountAtom,
  ticketurchaseStepAtom,
} from "@/states/activeTicket";
import { ArrowLeft, CloseSquare, Edit } from "iconsax-reactjs";
import { formatNumber } from "@/utils/formatNumber";
import { RESOURCE_URL } from "@/constants";
import useForm from "@/hooks/useForm";
import { accountCreationSchema } from "@/services/validation";
import CustomInput from "../../CustomInput";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { ITicketCreatedModel } from "@/models/TicketCreatedModel";
import PaymentButton from "../../PaymentButton";
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

interface Props {
  params: {
    type: string;
  };
  searchParams: {
    id: string;
  };
}

function FundRaiserAccountSetup() {
  const [step, setStep] = useAtom(ticketurchaseStepAtom);
  const [activeFundRaider, setActiveFundRaiser] = useAtom(activeFundRaiserAtom);
  const [amount, setAmount] = useAtom(donationAmountAtom);
  const [canPay, setCanPay] = useAtom(canPayAtom);
  const [paystackDetails, setPaystackDetails] = useAtom(paystackDetailsAtom);

  const {
    primaryColor
  } = useCustomTheme()

  const [token, setToken] = React.useState(() =>
    localStorage.getItem(STORAGE_KEYS.token)
  );
  const [userId, setUserId] = React.useState(() =>
    localStorage.getItem(STORAGE_KEYS.USER_ID)
  );
  const [userDetails, setUserDetails] = React.useState<IUser | null>(() =>
    JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DETAILS) as string)
  );
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    const user_id = localStorage.getItem(STORAGE_KEYS.USER_ID);
    return token !== null && user_id !== null;
  });
  const [googleAuthUsed, setGoogleAuthUsed] = React.useState(() =>
    localStorage.getItem(STORAGE_KEYS.GOOGLE_AUTH)
  );
  const [showLink, setShowLink] = React.useState(false);

  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (userDetails && amount > 0) {
      // setShowLink(true);
      // create custom order
      createCustomOrder.mutate({
        seller: activeFundRaider?.createdBy?.userId || "",
        price: amount,
        currency: "NGN",
        orderType: "DONATION",
        typeID: activeFundRaider?.id || "",
      });
    }
  }, [userDetails]);

  const { renderForm, values, setFieldValue, setValues } = useForm({
    defaultValues: {
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
      email: userDetails?.email || "",
    },
    onSubmit: (data) => {
      if (userDetails) {
        // check the amount
        if (amount === 0) {
          toaster.create({
            title: "Amount is required",
            description: "Please enter an amount",
            type: "error",
          });
          return;
        }
        // create customorder
        createCustomOrder.mutate({
          seller: activeFundRaider?.createdBy?.userId || "",
          price: amount,
          currency: "NGN",
          orderType: "DONATION",
          typeID: activeFundRaider?.id || "",
        });
        return;
      } else if (googleAuthUsed) {
        // login with google
        const idToken = session?.token?.idToken;
        googleAuth.mutate(idToken);
      } else {
        checkEmailMutation(data);
      }
    },
    validationSchema: accountCreationSchema,
  });

  React.useEffect(() => {
    if (googleAuthUsed) {
      // LOGIN USER
      const idToken = session?.token?.idToken;
      googleAuth.mutate(idToken);
    }
  }, [googleAuthUsed]);

  React.useEffect(() => {
    if (userDetails) {
      setFieldValue("firstName", userDetails?.firstName || "", true).then();
      setFieldValue("lastName", userDetails?.lastName || "", true).then();
      setFieldValue("email", userDetails?.email || "", true).then();
    }
  }, [userDetails]);

  React.useEffect(() => {
    if (token !== null && userId !== null) {
      setIsLoggedIn(true);
    }
  }, [token, userId, status]);

  const createCustomOrder = useMutation({
    mutationFn: (data: ICustomOrderDto) =>
      httpService.post(`${URLS.payments}/createCustomOrder`, data),
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      const item: ITicketCreatedModel = data?.data;
      setPaystackDetails({
        amount: item?.content?.orderTotal * 100,
        email: userDetails?.email as string,
        reference: item?.content?.orderCode,
      });
      setCanPay(true);
      console.log("CUSTOM ORDER CREATED", data?.data);
    },
  });

  const createDonation = useMutation({
    mutationFn: (data: {
      userID: string;
      fundRaiserID: string;
      amount: number;
    }) => httpService.post(`${URLS.donation}/create-donation`, data),
    onError: (error) => {
      toaster.create({
        title: "An Error occured",
        description: error?.message,
        type: "error",
      });
    },
    onSuccess: (data) => {
      toaster.create({
        title: "Success",
        description: "Donation created successfully",
        type: "success",
      });
      setStep(3);
    },
  });

  const getPublicProfile = useMutation({
    mutationFn: (data: any) =>
      httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${data}`),
    onError: (error) => { },
    onSuccess: (data) => {
      const details: IUser = data?.data;
      console.log(`User details`, details);
      setUserDetails(details);
      localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
      setUserDetails(details);
      setIsLoggedIn(true);
      createCustomOrder.mutate({
        seller: activeFundRaider?.createdBy?.userId || "",
        price: amount,
        currency: "NGN",
        orderType: "DONATION",
        typeID: activeFundRaider?.id || "",
      });
    },
  });

  const googleAuth = useMutation({
    mutationFn: async (data: any) =>
      httpService.get(`${URLS.auth}/signinWithCredentials`, {
        headers: {
          Authorization: `Bearer ${data}`,
        },
      }),
    onError: (error) => {
      toaster.create({
        title: "Login failed",
        description: error?.message || "Invalid credentials",
        type: "error",
      });
    },
    onSuccess: (data) => {
      console.log("Login successful", data?.data);
      localStorage.setItem(STORAGE_KEYS.USER_ID, data?.data?.user_id);
      localStorage.setItem(STORAGE_KEYS.token, data?.data?.access_token);
      localStorage.setItem(
        STORAGE_KEYS.refreshToken,
        data?.data?.refresh_token
      );
      const user_id = localStorage.getItem(STORAGE_KEYS.USER_ID);
      getPublicProfile.mutate(user_id);
    },
  });

  const { mutate: checkEmailMutation, isPending } = useMutation({
    mutationFn: async (data: any) =>
      httpService.post(`${URLS.auth}/temporary-signup`, data),
    onError: (error) => {
      toaster.create({
        title: "An error occured",
        description: error?.message,
        type: "error",
      });
      // setStep((prev) => prev + 1);
    },
    onSuccess: (data) => {
      console.log("data", data?.data);
      if (data?.data["stackTrace"]) {
        // save everything in local storage
        localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
        localStorage.setItem(STORAGE_KEYS.DONATION_AMOUNT, amount.toString());
        localStorage.setItem(
          STORAGE_KEYS.DONATION_DETAILS,
          JSON.stringify(activeFundRaider)
        );
        setShowLink(true);
        toaster.create({
          title: "Alert!",
          description: data?.data?.message,
          type: "info",
        });
        return;
      } else {
        setUserId(data?.data?.user_id);
        setToken(data?.data?.access_token);
        localStorage.setItem(STORAGE_KEYS.token, data?.data?.access_token);
        localStorage.setItem(STORAGE_KEYS.USER_ID, data?.data?.user_id);
        getPublicProfile.mutate(data?.data?.user_id);
      }
    },
  });

  return renderForm(
    <Box w="full" bg="white" borderRadius="xl" overflow="hidden">
      <Flex w="full">
        {/* Left Side - Checkout Form */}
        <Box flex={[1, 1, "0.6", "0.6"]}>
          {/* Header */}
          <HStack
            mb={6}
            borderBottomWidth={"1px"}
            spaceX={6}
            borderBottomColor={"lightgrey"}
            p="10px"
          >
            {/* <IconButton
                            aria-label="Go back"
                            variant="ghost"
                            size="sm"
                            onClick={() => }
                        >
                            <ArrowLeft size="20" />
                        </IconButton> */}
            <VStack align="start" spaceY={0}>
              <Text fontSize="xl" fontWeight="bold">
                Checkout
              </Text>
            </VStack>
          </HStack>

          <Box p="20px">
            {/* Event Info */}
            <HStack
              mb={8}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={"lightgrey"}
            >
              <Image
                src={
                  RESOURCE_URL + "/" + activeFundRaider?.bannerImage ||
                  "/images/tech-event.jpg"
                }
                w="120px"
                h="120px"
                objectFit="cover"
                borderRadius="md"
              />
              <VStack align="start" spaceY={1} flex="1">
                <Text fontWeight="semibold">
                  {capitalizeFLetter(activeFundRaider?.name) || "Tech Submit"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {new Date(activeFundRaider?.endDate).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  FundRaiser Goal - {" "}
                  {formatNumber(activeFundRaider?.goal as number)}
                </Text>
                <HStack>
                  <Text fontSize="xs" color="gray.500">
                    Amount Raised
                  </Text>
                  <Badge colorScheme="red" fontSize="xs">
                    {formatNumber(activeFundRaider?.total as number)}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>

            {/* Contact Information */}
            {!canPay && (
              <Flex align="start" flexDirection={"column"} gap={"3"} mb={8}>
                <Flex gap={"1"} flexDir={"column"} w="full">
                  <Flex gap={"2"} >
                    <Text>Donation Amount - {formatNumber(amount)}</Text>
                  </Flex>
                  <Input
                    type="text"
                    value={amount === 0 ? "" : amount}
                    placeholder="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow positive numbers
                      if (/^\d*$/.test(value)) {
                        setAmount(Number(value));
                      }
                    }}
                    onKeyDown={(e) => {
                      // Prevent non-numeric keys except backspace, delete, arrows
                      if (
                        !/^\d$/.test(e.key) &&
                        ![
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                        ].includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    width="full"
                    height={"45px"}
                    color="black"
                    borderWidth="2px"
                    borderColor={"#E5E5E5"}
                    bgColor="#F5F5F5"
                    borderRadius={"full"}
                  />
                  {/* <Text
                    fontWeight="semibold"
                    display={["block", "block", "none", "none"]}
                    mt="10px"
                  >
                    NGN {formatNumber(amount)}
                  </Text> */}
                </Flex>

                <Flex
                  flexDir={["column", "column", "row", "row"]}
                  gap={"4"}
                  w="full"
                >
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
                    <Flex flexDir={["row"]} w={"full"} justifyContent={"space-between"} gap={"2"} mt="10px">
                      <Text color="red">
                        This email address already exist. <span onClick={() => setStep(2)} style={{ textDecoration: "underline", color: primaryColor, cursor: "pointer" }} >Sign in</span>
                      </Text>
                      {/* <Text
                        color="primaryColor"
                        cursor={"pointer"}
                        w={""}
                        onClick={() => setStep(2)}
                        textDecorationLine={"underline"}
                      >
                        
                      </Text> */}
                    </Flex>
                  )}
                </Box>
              </Flex>
            )}

            {/* Footer */}
            <HStack justify="space-between" align="center">
              {!canPay && (
                <Button
                  w="full"
                  h="50px"
                  bgColor="primaryColor"
                  size="lg"
                  borderRadius="full"
                  px={8}
                  loading={
                    isPending ||
                    createCustomOrder.isPending ||
                    googleAuth.isPending ||
                    getPublicProfile.isPending
                  }
                  type={"submit"}
                  fontWeight={"semibold"}
                >
                  Confirm Details
                </Button>
              )}
              {canPay && (
                <Flex flexDir={"column"} w={"full"} gap={"4"} >

                  {/* Order Summary */}
                  <Flex display={["flex", "flex", "none"]} flexDir={"column"} gap={"2"} >
                    <Text fontSize="lg" fontWeight="bold">
                      Donation summary
                    </Text> 
                    <Flex gap={"2"} align="stretch">
                      <Flex w={"full"} justify="space-between">
                        <Text>Amount</Text>
                        <Text fontWeight="semibold">NGN {formatNumber(amount)}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <PaymentButton
                    reference={paystackDetails?.reference as string}
                    email={paystackDetails?.email as string}
                    amount={paystackDetails?.amount as number}
                    isLoading={createDonation?.isPending}
                    bgColor={primaryColor}
                    onSucces={() =>
                      createDonation.mutate({
                        userID: userDetails?.userId as string,
                        amount: amount,
                        fundRaiserID: activeFundRaider?.id as string,
                      })
                    }
                    text={"Pay"}
                  />
                </Flex>
              )}
            </HStack>
          </Box>
        </Box>

        {/* Right Side - Event Image & Order Summary */}
        <Box
          flex="0.4"
          position="relative"
          bgColor="whitesmoke"
          display={["none", "none", "block", "block"]}
        >
          {/* Close Button */}
          {/* <IconButton
            aria-label="Close"
            position="absolute"
            top={4}
            right={4}
            zIndex={10}
            variant="ghost"
            color="white"
            _hover={{ bg: "blackAlpha.600" }}
          >
            <CloseSquare size="24" />
          </IconButton> */}

          {/* Event Image */}
          <Box w="100%" h="300px" overflow="hidden">
            <Image
              src={
                RESOURCE_URL + "/" + activeFundRaider?.bannerImage ||
                "/images/tech-event.jpg"
              }
              w="100%"
              h="300px"
              objectFit="cover"
            />
          </Box>

          {/* Order Summary */}
          <Box p={6}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Donation summary
            </Text>

            <VStack spaceY={3} align="stretch">
              <Flex justify="space-between">
                <Text>Amount</Text>
                <Text fontWeight="semibold">NGN {formatNumber(amount)}</Text>
              </Flex>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default FundRaiserAccountSetup;
