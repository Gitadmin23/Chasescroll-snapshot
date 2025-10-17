import {
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import httpService from "@/services/httpService";
import { URLS } from "@/services/urls";
import { toaster } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { currentIdAtom } from "@/views/share/Event";
import {
  activeEventAtom,
  activeTicketAtom,
  affiliateIDAtom,
  canPayAtom,
  createdTicketAtom,
  currentUrlAtom,
  paystackDetailsAtom,
  selectedTicketsAtom,
  ticketCountAtom,
  ticketurchaseStepAtom,
  totalAmountForSelectedTicketsAtom,
} from "@/states/activeTicket";
import { ArrowLeft } from "iconsax-reactjs";
import { formatNumber } from "@/utils/formatNumber";
import { RESOURCE_URL } from "@/constants";
import useForm from "@/hooks/useForm";
import { accountCreationSchema } from "@/services/validation";
import CustomInput from "../../CustomInput";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { ITicketCreatedModel } from "@/models/TicketCreatedModel";
import PaymentButton from "../../PaymentButton";
import { IUser } from "@/models/User";
import useCustomTheme from "@/hooks/useTheme";

function AccountSetup() {
  const [step, setStep] = useAtom(ticketurchaseStepAtom);
  const [ticket, setTicket] = useAtom(activeTicketAtom);
  const [event, setActiveEvent] = useAtom(activeEventAtom);
  const [quantity, setQuantity] = useAtom(ticketCountAtom);
  const [canPay, setCanPay] = useAtom(canPayAtom);
  const [paystackDetails, setPaystackDetails] = useAtom(paystackDetailsAtom);
  const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom);

  const { primaryColor } = useCustomTheme()

  const [createTicketIsLoading, setCreateTicketIsLoading] =
    React.useState(false);
  const setCreatedTicket = useSetAtom(createdTicketAtom);
  const [totalSelectedTicketPrice, setTotalSelectedTicketPrice] = useAtom(
    totalAmountForSelectedTicketsAtom
  );
  const affiliateID = useAtomValue(affiliateIDAtom);
  const [showLink, setShowLink] = React.useState(false);

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
  const [googleAuthUsed, setGoogleAuthUsed] = React.useState(() => {
    const googleUsed = localStorage.getItem(STORAGE_KEYS.GOOGLE_AUTH);
    if (googleUsed) {
      return true;
    } else {
      return false;
    }
  });
  const [renderCount, setRenderCount] = React.useState(0);

  const { data: session, status } = useSession();

  const { renderForm, values, setFieldValue, setValues } = useForm({
    defaultValues: {
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
      email: userDetails?.email || "",
    },
    onSubmit: (data: { 
    firstName: string,
    lastName: string,
    email: string
  }) => {
      if (isLoggedIn) {
        if (affiliateID) {
          createTicket({
            eventID: event?.id as string,
            ticketBuyObjectList: selectedTickets?.map((item) => ({
              ticketType: item.ticketType,
              numberOfTickets: item.quantity,
            })) as any,
            affiliateID,
          });
        } else {
          createTicket({
            eventID: event?.id as string,
            ticketBuyObjectList: selectedTickets?.map((item) => ({
              ticketType: item.ticketType,
              numberOfTickets: item.quantity,
            })) as any,
          });
        }

        return;
      } else if (googleAuthUsed) {
        // LOGIN USER
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

  const createTicketFunc = React.useCallback(() => {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (userId !== null && !createTicketIsLoading) {
      // setIsLoggedIn(true);
      if (affiliateID) {
        createTicket({
          eventID: event?.id as string,
          ticketBuyObjectList: selectedTickets?.map((item) => ({
            ticketType: item.ticketType,
            numberOfTickets: item.quantity,
          })) as any,
          affiliateID,
        });
        return;
      } else {
        createTicket({
          eventID: event?.id as string,
          ticketBuyObjectList: selectedTickets?.map((item) => ({
            ticketType: item.ticketType,
            numberOfTickets: item.quantity,
          })) as any,
        });
        return;
      }
    }
  }, []);

  React.useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, []); // Empty dependency array to run only

  React.useEffect(() => {
    if (renderCount === 2) {
      createTicketFunc();
    }
  }, [renderCount]);

  const getTicketPrice = (ticketType: string) => {
    const ticket = event?.productTypeData.filter(
      (item) => item.ticketType === ticketType
    )[0];
    return ticket?.ticketPrice;
  };

  const calculateTotal = () => {
    let total = 0;
    selectedTickets?.forEach((item) => {
      total += (getTicketPrice(item.ticketType) as number) * item.quantity;
    });
    setTotalSelectedTicketPrice(total);
    return formatNumber(total);
  };

  const validateTicket = useMutation({
    mutationFn: (data: string) =>
      httpService.get(`/payments/verifyWebPaystackTx`, {
        params: {
          orderCode: data,
        },
      }),
    onSuccess: (data) => {
      toaster.create({
        title: "Success",
        description: "Ticket verification successful",
        type: "success",
      });
      setStep(4);
    },
    onError: (error) => {
      toaster.create({
        title: "Error",
        description: error?.message,
        type: "error",
      });
    },
  });

  const createTicket = async (data: {
    eventID: string;
    ticketBuyObjectList: { ticketType: string; numberOfTickets: number }[];
    affiliateID?: string;
  }) => {
    setCreateTicketIsLoading(true);
    try {
      const res = await httpService.post(
        `${URLS.event}/create-multi-ticket`,
        data
      );
      const json: ITicketCreatedModel = res.data;

      console.log(json);
      setCreatedTicket(json);
      if (res?.data) {
        if (!json.content) {
          toaster.create({
            title: "An error occured",
            description: json?.message,
            type: "error",
          });
          setCreateTicketIsLoading(false);
          return;
        }
        if (totalSelectedTicketPrice === 0) {
          toaster.create({
            title: "Success",
            description: "Ticket purchase was successful!!!!",
            type: "success",
          });
          setStep(4);
          return;
        } else {
          setCanPay(true);
          setPaystackDetails({
            email: json?.content?.buyer?.email,
            reference: json.content?.orderCode,
            amount: json.content?.orderTotal * 100,
          });
          return;
        }
      } else {
        console.log(res);
        toaster.create({
          title: "An error occured",
          description: "Failed to create ticket",
          type: "error",
        });
      }
      // you can call this function anything
      setCreateTicketIsLoading(false);
    } catch (error) {
      console.log("An error occured while trying to create the tickets");
      console.log(error);
    }
  };

  const getPublicProfile = useMutation({
    mutationFn: (data: any) =>
      httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${data}`),
    onError: (error) => {},
    onSuccess: (data) => {
      const details: IUser = data?.data;
      console.log(`User details`, details);
      localStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
      setUserDetails(details);
      if (affiliateID) {
        createTicket({
          eventID: event?.id as string,
          ticketBuyObjectList: selectedTickets?.map((item) => ({
            ticketType: item.ticketType,
            numberOfTickets: item.quantity,
          })) as any,
          affiliateID,
        });
        return;
      } else {
        createTicket({
          eventID: event?.id as string,
          ticketBuyObjectList: selectedTickets?.map((item) => ({
            ticketType: item.ticketType,
            numberOfTickets: item.quantity,
          })) as any,
        });
      }
      // setCanPay(true);
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
        localStorage.setItem(STORAGE_KEYS.EVENT, JSON.stringify(event));
        localStorage.setItem(
          STORAGE_KEYS.ACTIVE_TICKET,
          JSON.stringify(ticket)
        );
        localStorage.setItem(STORAGE_KEYS.QUANTITY, quantity.toString());
        localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, step.toString());
        localStorage.setItem(
          STORAGE_KEYS.SELECTED_TICKETS,
          JSON.stringify(selectedTickets)
        );
        setShowLink(true);
      } else {
        setUserId(data?.data?.user_id);
        setToken(data?.data?.access_token);
        localStorage.setItem(STORAGE_KEYS.token, data?.data?.access_token);
        localStorage.setItem(STORAGE_KEYS.USER_ID, data?.data?.user_id);
        const user_id = localStorage.getItem(STORAGE_KEYS.USER_ID);
        getPublicProfile.mutate(user_id);
      }
    },
  });

  return renderForm(
    <Box
      w="full"
      bg="white"
      maxH={["100vh", "100vh", "650px"]}
      borderRadius="xl"
      overflow="hidden"
    >
      <Flex w="full" flexDir={["column", "column", "row", "row"]}>
        {/* Left Side - Checkout Form */}
        <Box flex="0.6">
          {/* Header */}
          <HStack
            mb={6}
            borderBottomWidth={"1px"}
            spaceX={6}
            borderBottomColor={"lightgrey"}
            p="10px"
          >
            <IconButton
              aria-label="Go back"
              variant="ghost"
              size="sm"
              onClick={() => setStep((prev) => prev - 1)}
            >
              <ArrowLeft size="20" />
            </IconButton>
            <VStack align="start" spaceY={0}>
              <Text fontSize="xl" fontWeight="bold">
                Checkout
              </Text>
            </VStack>
          </HStack>

          <Box p={["10px", "10px", "20px", "20px"]}>
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
                  RESOURCE_URL + "/" + event?.currentPicUrl ||
                  "/images/tech-event.jpg"
                }
                alt={event?.eventName}
                w="120px"
                h="120px"
                objectFit="cover"
                borderRadius="md"
              />
              <VStack align="start" spaceY={1} flex="1">
                <Text fontWeight="semibold">
                  {event?.eventName || "Tech Submit"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {event?.startDate
                    ? new Date(event.startDate).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Thu, Aug 14 • 7:00 pm"}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  NGN {totalSelectedTicketPrice}
                </Text>
                {/* <HStack>
                                    <Text fontSize="xs" color="gray.500">Ticket Selected</Text>
                                    <Badge colorScheme="red" fontSize="xs">{ticket?.ticketType}</Badge>
                                </HStack> */}
              </VStack>
            </HStack>

            {/* Contact Information */}
            {!canPay && !isLoggedIn && (
              <VStack align="start" spaceY={[0, 0, 6, 6]} mb={8}>
                <Flex
                  spaceX={[0, 0, 4, 4]}
                  w="full"
                  flexDir={["column", "column", "row", "row"]}
                >
                  <Box w="full">
                    <CustomInput
                      name="firstName"
                      type="text"
                      label="First Name"
                      isPassword={false}
                    />
                  </Box>

                  <Box w="full" mt={["10px", "10px", "0px", "0px"]}>
                    <CustomInput
                      name="lastName"
                      type="text"
                      label="Last Name"
                      isPassword={false}
                    />
                  </Box>
                </Flex>
                <Box w="full">
                  <CustomInput
                    name="email"
                    type="email"
                    label="Email"
                    isPassword={false}
                  />
                  {showLink && (
                    <HStack mt="10px">
                      <Text color="red">
                        You already have an account on chasecroll, For security
                        reasons <span onClick={() => setStep(3)} style={{ cursor: "pointer", color: primaryColor, textDecoration: "underline", fontWeight: "bold" }} >{("Login")?.replace("", " ")}</span>
                      </Text>
                      {/* <Text
                        color="primaryColor"
                        cursor={"pointer"}
                        
                        fontWeight={"black"}
                        textDecorationLine={"underline"}
                      >
                      </Text> */}
                    </HStack>
                  )}
                </Box>
              </VStack>
            )}

            {/* Footer */}
            <HStack justify="space-between" align="center">
              {!canPay && (
                <Button
                  w="full"
                  h="60px"
                  bgColor="primaryColor"
                  size="lg"
                  color={"white"}
                  borderRadius="full"
                  px={8}
                  disabled={values?.email && values?.firstName && values?.lastName ? false : true}
                  loading={
                    isPending ||
                    createTicketIsLoading ||
                    googleAuth.isPending ||
                    getPublicProfile.isPending
                  }
                  type={"submit"}
                >
                  {totalSelectedTicketPrice === 0 &&
                    "Verify Details to get ticket"}
                  {totalSelectedTicketPrice > 0 &&
                    isLoggedIn &&
                    "Proceed to make payment"}

                  {totalSelectedTicketPrice > 0 &&
                    !isLoggedIn &&
                    "Confirm Details"}
                </Button>
              )}
              {canPay && (
                <PaymentButton
                  onSucces={() =>
                    validateTicket.mutate(paystackDetails?.reference as string)
                  }
                  reference={paystackDetails?.reference as string}
                  email={paystackDetails?.email as string}
                  amount={paystackDetails?.amount as number}
                  text={"Pay"}
                />
              )}
            </HStack>

            <HStack
              fontFamily={"Raleway-Regular"}
              w="full"
              justifyContent={"center"}
              mt="20px"
            >
              <Text color="grey" fontSize={"14px"}>
                Powered by
              </Text>
              <Text color="primaryColor" fontSize={"16px"} fontWeight={600}>
                Chasescroll
              </Text>
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
          {/* Event Image */}
          <Box w="100%" h="300px" overflow="hidden">
            <Image
              src={
                RESOURCE_URL + "/" + event?.currentPicUrl ||
                "/images/tech-event.jpg"
              }
              alt={event?.eventName}
              w="100%"
              h="300px"
              objectFit="cover"
            />
          </Box>

          {/* Order Summary */}
          <Box p={6}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Order summary
            </Text>

            <VStack spaceY={3} align="stretch">
              {selectedTickets !== null &&
                selectedTickets.length > 0 &&
                selectedTickets.map((item) => (
                  <Flex justify="space-between" mb="10px">
                    <Text>
                      {item?.quantity} x {item?.ticketType}
                    </Text>
                    <Text fontWeight="semibold">
                      {formatNumber(
                        (getTicketPrice(item.ticketType) as number) *
                          item.quantity
                      )}
                    </Text>
                  </Flex>
                ))}

              {/* <Divider /> */}

              <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                <Text>Total</Text>
                <Text>NGN {calculateTotal()}</Text>
              </Flex>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default AccountSetup;
