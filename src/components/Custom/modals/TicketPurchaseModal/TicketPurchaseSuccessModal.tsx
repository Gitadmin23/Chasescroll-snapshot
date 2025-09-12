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
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { useAtomValue } from "jotai";
import { activeEventAtom, ticketCountAtom } from "@/states/activeTicket";
import { CloseSquare, DocumentDownload, TickCircle } from "iconsax-reactjs";
import { ITicketCreatedModel } from "@/models/TicketCreatedModel";
import { IEventTicket, IProductTypeData } from "@/models/Event";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { useQuery } from "@tanstack/react-query";
import httpService from "@/services/httpService";
import { URLS } from "@/services/urls";
import { QrCode } from "@chakra-ui/react";
import { RESOURCE_URL } from "@/constants";
import { IUser } from "@/models/User";
import { IPurchaseTicket } from "@/models/PurchaseTicket";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import { textLimit } from "@/utils/textlimiter";
import { useColorMode } from "@/components/ui/color-mode";
import useCustomTheme from "@/hooks/useTheme";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import { IoClose } from "react-icons/io5";
import CustomButton from "../../customButton";
import EventImage from "../../eventDetails/EventImage";
import { dateFormat, timeFormat } from "@/helpers/utils/dateFormat";
import EventPrice from "../../eventDetails/EventPrice";
import UserImage from "../../eventDetails/UserImage";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { DownloadTwoIcon } from "@/components/svg";

interface TicketPurchaseSuccessModalProps {
  onClose?: () => void;
  orderNumber?: string;
  email?: string;
  type?: "EVENT" | "FUNDRAISER" | "PRODUCT";
}

function TicketPurchaseSuccessModal({
  onClose,
  orderNumber = "#12844567363",
  email = "otuekongdomino@gmail.com",
  type = "EVENT",
}: TicketPurchaseSuccessModalProps) {
  const {
    bodyTextColor,
    primaryColor,
    secondaryBackgroundColor,
    mainBackgroundColor,
    ticketBackgroundColor,
    headerTextColor,
  } = useCustomTheme();

  const { colorMode } = useColorMode();

  const [open, setOpen] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const event = useAtomValue(activeEventAtom);
  const quantity = useAtomValue(ticketCountAtom);
  const [tickets, setTicket] = React.useState<IPurchaseTicket[]>([]);
  const [userDetails, setUserDetails] = React.useState<IUser>(() => {
    const item = localStorage.getItem(STORAGE_KEYS.USER_DETAILS);
    if (item) {
      return JSON.parse(item);
    } else {
      return null;
    }
  });
  const [userId, setUserId] = React.useState(() => {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (userId) {
      return userId;
    } else {
      return null;
    }
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({ contentRef });

  // Inject print styles
  React.useEffect(() => {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const { isError, isFetching, data } = useQuery({
    queryKey: [`get-tickets-${userDetails?.userId}`, userDetails?.userId],
    queryFn: () =>
      httpService.get(`${URLS.event}/get-users-tickets`, {
        params: {
          userID: userId ? userId : userDetails?.userId,
          eventID: event?.id,
        },
      }),
  });

  // EFFECTS
  React.useEffect(() => {
    if (!isFetching && !isError && data?.data) {
      console.log(
        "This is the data my people",
        data?.data?.content[0]?.event?.productTypeData
      );
      const item: IPurchaseTicket[] = data?.data?.content;
      setTicket(item);
      setTotal(data?.data?.content?.length);
    }
  }, [isFetching, isError, data]);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const checkEventDay = (item: any) => {
    return (
      new Date(item[item?.length - 1])?.getDate() >=
        new Date(event?.startDate)?.getDate() &&
      new Date(item[item?.length - 1])?.getDate() <=
        new Date(event?.endDate)?.getDate()
    );
  };

  const isToDay = (item: any) => {
    return (
      new Date()?.getDate() === new Date(item)?.getDate() ||
      new Date(event?.endDate)?.getDate() === new Date(item)?.getDate()
    );
  };

  const ref: any = React.useRef(null);

  const scroll = (scrolloffset: number) => {
    ref.current.scrollLeft += scrolloffset;
  };

  return (
    <Box w="full" borderRadius="2xl" overflow="hidden" position="relative">
      <Box p={[2, 2, 8, 8]}>
        {/* Event Details Section */}

        <Flex
          p={"4"}
          position={"relative"}
          h={"80vh"}
          flexDirection={"column"}
          bg={mainBackgroundColor}
          roundedTop={"md"}
          width={"full"}
          alignItems={"center"}
          px={"2"}
          gap={"2"}
        >
          <Flex
            bg={mainBackgroundColor}
            w={"full"}
            h={"50px"}
            display={["none", "none", "flex"]}
            position={"relative"}
            gap={"4"}
            px={"4"}
            mb={"2"}
            width={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Flex
              pos={"absolute"}
              display={["none", "none", "flex"]}
              w={"full"}
              justifyContent={"center"}
            >
              <Text fontSize={"20px"} fontWeight={"bold"} textAlign={"center"}>
                Ticket Details
              </Text>
            </Flex>
            <Box display={["none", "none", "block"]}>
              <CustomButton
                width={"fit"}
                px={"3"}
                borderRadius={"full"}
                onClick={() => reactToPrintFn()}
                text="Download Ticket"
              />
            </Box>
          </Flex>

          <Box
            w={"full"}
            bg={mainBackgroundColor}
            h={"full"}
            pos={"relative"}
            flex={"1"}
            display={["none", "none", "flex"]}
          >
            <Flex
              ref={contentRef}
              width={"full"}
              position={"absolute"}
              inset={"0px"}
              flex={"1"}
              overflowY={"auto"}
              flexDirection={"column"}
              gap={"4"}
              px={["4", "4", "0px"]}
            >
              {/* {eventData.length > 0 && ( */}
              <Flex
                w={"full"}
                h={"fit-content"}
                flexDir={"column"}
                alignItems={"center"}
                gap={"4"}
              >
                {tickets?.map((item, index: number) => {
                  return (
                    <Flex
                      key={index}
                      maxW={"750px"}
                      w={"full"}
                      flexDir={["row"]}
                      rounded={"16px"}
                      pb={"4"}
                      p={["4"]}
                      bg={
                        index === 0
                          ? secondaryBackgroundColor
                          : ticketBackgroundColor
                      }
                      alignItems={["center"]}
                      justifyContent={"center"}
                      gap={"4"}
                    >
                      <Flex w={["fit-content"]} gap={"4"}>
                        <EventImage
                          width={["201px"]}
                          height={["201px"]}
                          data={event}
                        />
                      </Flex>
                      <Flex
                        flexDir={"column"}
                        pos={"relative"}
                        gap={"4"}
                        px={["4", "4", "0px"]}
                      >
                        <Text
                          fontSize={"24px"}
                          lineHeight={"18px"}
                          fontWeight={"bold"}
                        >
                          {capitalizeFLetter(textLimit(event?.eventName, 20))}
                        </Text>

                        {isToDay(
                          item?.scanTimeStamp
                            ? Array.isArray(item?.scanTimeStamp) &&
                              item?.scanTimeStamp.length > 0
                              ? item?.scanTimeStamp[
                                  item?.scanTimeStamp.length - 1
                                ]
                              : ""
                            : ""
                        ) && (
                          <>
                            {checkEventDay(item?.scanTimeStamp) && (
                              <Box
                                width={"fit-content"}
                                height={"fit-content"}
                                position={"absolute"}
                                bottom={"50px"}
                                right={"0"}
                                bg={"transparent"}
                              >
                                <Image
                                  src={"/images/approved.svg"}
                                  alt={"approved"}
                                  width={"100px"}
                                  height={"100px"}
                                  objectFit={"cover"}
                                />
                              </Box>
                            )}
                          </>
                        )}
                        <Flex gap={"4"} alignItems={"center"}>
                          <Flex
                            border={`0.5px solid ${
                              index === 0 ? bodyTextColor : "#5465E0"
                            }`}
                            h={"34px"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            px={"3"}
                            color={
                              colorMode === "light" ? "#5B5858" : bodyTextColor
                            }
                            fontSize={"10px"}
                            lineHeight={"13.68px"}
                            rounded={"full"}
                          >
                            {dateFormat(event?.startDate)}
                          </Flex>
                          <Flex
                            border={`0.5px solid ${
                              index === 0 ? bodyTextColor : "#5465E0"
                            }`}
                            h={"34px"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            px={"3"}
                            color={
                              colorMode === "light" ? "#5B5858" : bodyTextColor
                            }
                            fontSize={"10px"}
                            lineHeight={"13.68px"}
                            rounded={"full"}
                          >
                            {timeFormat(event?.startDate)}
                          </Flex>
                        </Flex>
                        <Flex gap={"4"}>
                          <Flex flexDirection={"column"}>
                            <Text
                              fontWeight={"bold"}
                              fontSize={"10.26px"}
                              lineHeight={"16.42px"}
                              color={"brand.chasescrollBlue"}
                            >
                              Ticket Type
                            </Text>
                            <Text
                              color={bodyTextColor}
                              fontWeight={"semibold"}
                              fontSize={"10.26px"}
                              lineHeight={"13.68px"}
                            >
                              {item.ticketType}
                            </Text>
                          </Flex>
                          <Flex flexDirection={"column"}>
                            <Text
                              fontWeight={"bold"}
                              fontSize={"10.26px"}
                              lineHeight={"16.42px"}
                              color={"brand.chasescrollBlue"}
                            >
                              Ticket fee
                            </Text>
                            <Text
                              color={bodyTextColor}
                              fontSize={"10.26px"}
                              lineHeight={"13.68px"}
                            >
                              <EventPrice
                                minPrice={item?.boughtPrice}
                                maxPrice={item?.boughtPrice}
                                currency={event?.currency}
                              />
                            </Text>
                          </Flex>
                          <Flex flexDirection={"column"} alignItems={"center"}>
                            <Text
                              fontWeight={"bold"}
                              fontSize={"10.26px"}
                              lineHeight={"16.42px"}
                              color={"brand.chasescrollBlue"}
                            >
                              Quantity
                            </Text>
                            <Text
                              color={bodyTextColor}
                              fontSize={"10.26px"}
                              lineHeight={"13.68px"}
                            >
                              {index + 1}/{total}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex gap={"4"} fontSize={"xs"}>
                          <UserImage size={"lg"} user={event?.createdBy} />
                          <Flex flexDirection={"column"}>
                            <Text fontWeight={"bold"} color={headerTextColor}>
                              Name
                            </Text>
                            <Text color={bodyTextColor}>
                              {event?.createdBy?.firstName +
                                " " +
                                event?.createdBy?.lastName}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>

                      <Flex
                        gap={"1"}
                        borderLeft={["1px dashed black"]}
                        w={["fit-content"]}
                        alignItems={"center"}
                        border={""}
                        pl={["4"]}
                        flexDir={"column"}
                      >
                        <Box
                          bg={"white"}
                          p={"3"}
                          w={"fit-content"}
                          rounded={"16px"}
                        >
                          <QRCode
                            style={{
                              height: "200px",
                              width: "200px",
                              zIndex: 20,
                            }}
                            value={item?.id}
                            viewBox={`0 0 256 256`}
                          />
                        </Box>
                        <Text textAlign={"center"} fontSize={"xs"}>
                          Powered by Chasescroll
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
              {/* )} */}
            </Flex>
          </Box>

          {total > 1 && (
            <Flex
              w={"full"}
              top={"200px"}
              position={"fixed"}
              display={["flex", "flex", "none"]}
              zIndex={"1000"}
              justifyContent={"space-between"}
              gap={"4"}
              px={"2"}
            >
              <Flex
                onClick={() => scroll(-400)}
                as="button"
                position={"relative"}
                bgColor={mainBackgroundColor}
                w={"40px"}
                h={"40px"}
                borderWidth={"1px"}
                borderColor={bodyTextColor}
                justifyContent={"center"}
                alignItems={"center"}
                rounded={"full"}
              >
                <FaChevronLeft color={bodyTextColor} />
              </Flex>
              <Flex
                onClick={() => scroll(400)}
                as="button"
                bgColor={mainBackgroundColor}
                w={"40px"}
                h={"40px"}
                borderWidth={"1px"}
                borderColor={bodyTextColor}
                justifyContent={"center"}
                alignItems={"center"}
                rounded={"full"}
              >
                <FaChevronRight color={bodyTextColor} />
              </Flex>
            </Flex>
          )}

          <Flex
            ref={ref}
            position={"relative"}
            width={"full"}
            h={"full"}
            display={["flex", "flex", "none"]}
            scrollBehavior={"smooth"}
            className="hide-scrollbar"
            flexDirection={"row"}
            overflowX={"auto"}
            alignItems={"center"}
            gap={"4"}
            pl={["2", "1", "0px"]}
          >
            <Flex width={"full"} gap={"6"}>
              {tickets.map((item, index: number) => {
                return (
                  <Flex
                    key={index}
                    minW={"90vw"}
                    flexDir={["column", "column", "row"]}
                    rounded={"16px"}
                    pb={"4"}
                    pt={["4"]}
                    p={["0px", "0px", "4"]}
                    bg={
                      index === 0
                        ? secondaryBackgroundColor
                        : ticketBackgroundColor
                    }
                    alignItems={["start", "start", "center"]}
                    justifyContent={"center"}
                  >
                    <Flex
                      width={"full"}
                      justifyContent={"space-between"}
                      pos={"relative"}
                      px={"4"}
                      pt={"4"}
                      position={"relative"}
                      mb={"20px"}
                    >
                      <Flex
                        pos={"absolute"}
                        width={"full"}
                        pr={"6"}
                        justifyContent={"center"}
                      >
                        <Text
                          fontSize={"16px"}
                          fontWeight={"bold"}
                          textAlign={"center"}
                        >
                          Ticket Details
                        </Text>
                      </Flex>
                      <Box
                        ml={"auto"}
                        cursor={"pointer"}
                        pos={"absolute"}
                        zIndex={"10"}
                        onClick={() => reactToPrintFn()}
                        display={["block", "block", "none"]}
                      >
                        <DownloadTwoIcon />
                      </Box>
                    </Flex>
                    <Flex
                      pos={"relative"}
                      w={["full", "full", "fit-content"]}
                      gap={"4"}
                      mt={["4", "4", "0px"]}
                      px={["4", "4", ""]}
                    >
                      <EventImage
                        width={["full", "full", "201px"]}
                        height={["201px", "201px", "201px"]}
                        data={event}
                      />
                      {isToDay(
                        item?.scanTimeStamp
                          ? Array.isArray(item?.scanTimeStamp) &&
                            item?.scanTimeStamp.length > 0
                            ? item?.scanTimeStamp[
                                item?.scanTimeStamp.length - 1
                              ]
                            : ""
                          : ""
                      ) && (
                        <>
                          {checkEventDay(item?.scanTimeStamp) && (
                            <Box
                              width={"fit-content"}
                              height={"fit-content"}
                              position={"absolute"}
                              bottom={"-50px"}
                              right={"3"}
                              bg={"transparent"}
                            >
                              <Image
                                src={"/assets/approved.svg"}
                                alt={"approved"}
                                width={"100px"}
                                height={"100px"}
                                objectFit={"cover"}
                              />
                            </Box>
                          )}
                        </>
                      )}
                    </Flex>
                    <Flex
                      pos={"relative"}
                      flexDir={"column"}
                      mt={"2"}
                      gap={"3"}
                      px={["4", "4", "0px"]}
                    >
                      <Text fontSize={"18px"} fontWeight={"semibold"}>
                        {capitalizeFLetter(textLimit(event?.eventName, 20))}
                      </Text>

                      <Flex
                        gap={"4"}
                        display={["flex", "flex", "none"]}
                        fontSize={"xs"}
                      >
                        <UserImage size={"lg"} user={event?.createdBy} />
                        <Flex flexDirection={"column"}>
                          <Text
                            fontWeight={"bold"}
                            color={"brand.chasescrollBlue"}
                          >
                            Name
                          </Text>
                          <Text color={bodyTextColor}>
                            {event?.createdBy?.firstName +
                              " " +
                              event?.createdBy?.lastName}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex gap={"4"} alignItems={"center"}>
                        <Flex
                          border={`0.5px solid ${
                            index === 0 ? "#CDD3FD" : "#5465E0"
                          }`}
                          h={"34px"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          px={"3"}
                          color={bodyTextColor}
                          fontSize={"10px"}
                          lineHeight={"13.68px"}
                          rounded={"full"}
                        >
                          {dateFormat(event?.startDate)}
                        </Flex>
                        <Flex
                          border={`0.5px solid ${
                            index === 0 ? "#CDD3FD" : "#5465E0"
                          }`}
                          h={"34px"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          px={"3"}
                          color={bodyTextColor}
                          fontSize={"10px"}
                          lineHeight={"13.68px"}
                          rounded={"full"}
                        >
                          {timeFormat(event?.startDate)}
                        </Flex>
                      </Flex>
                      <Flex gap={"4"}>
                        <Flex flexDirection={"column"}>
                          <Text
                            fontWeight={"bold"}
                            fontSize={"10.26px"}
                            lineHeight={"16.42px"}
                            color={"brand.chasescrollBlue"}
                          >
                            Ticket Type
                          </Text>
                          <Text
                            color={bodyTextColor}
                            fontSize={"10.26px"}
                            lineHeight={"13.68px"}
                          >
                            {item.ticketType}
                          </Text>
                        </Flex>
                        <Flex flexDirection={"column"}>
                          <Text
                            fontWeight={"bold"}
                            fontSize={"10.26px"}
                            lineHeight={"16.42px"}
                            color={"brand.chasescrollBlue"}
                          >
                            Ticket fee
                          </Text>
                          <Text
                            color={bodyTextColor}
                            fontSize={"10.26px"}
                            lineHeight={"13.68px"}
                          >
                            <EventPrice
                              minPrice={item?.boughtPrice}
                              maxPrice={item?.boughtPrice}
                              currency={event?.currency}
                            />
                          </Text>
                        </Flex>
                        <Flex flexDirection={"column"}>
                          <Text
                            fontWeight={"bold"}
                            fontSize={"10.26px"}
                            lineHeight={"16.42px"}
                            color={"brand.chasescrollBlue"}
                          >
                            Number
                          </Text>
                          <Text
                            color={bodyTextColor}
                            fontSize={"10.26px"}
                            lineHeight={"13.68px"}
                          >
                            {index + 1}/{total}
                          </Text>
                        </Flex>
                      </Flex>
                      <Flex
                        gap={"4"}
                        display={["none", "none", "flex"]}
                        fontSize={"xs"}
                      >
                        <UserImage size={"lg"} user={event?.createdBy} />
                        <Flex flexDirection={"column"} gap={"2"}>
                          <Text
                            fontWeight={"bold"}
                            color={"brand.chasescrollBlue"}
                          >
                            Name
                          </Text>
                          <Text color={bodyTextColor}>
                            {event?.createdBy?.firstName +
                              " " +
                              event?.createdBy?.lastName}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>

                    <Flex
                      gap={"1"}
                      borderLeft={["", "", "1px dashed black"]}
                      mt={"2"}
                      borderTop={[
                        "1px dashed black",
                        "1px dashed black",
                        "0px",
                      ]}
                      w={["full", "full", "fit-content"]}
                      alignItems={"center"}
                      border={""}
                      py={["4", "4", "0px"]}
                      pl={["0px", "0px", "4"]}
                      flexDir={"column"}
                    >
                      <Box
                        bg={"white"}
                        p={"3"}
                        w={"fit-content"}
                        rounded={"16px"}
                      >
                        <QRCode
                          style={{
                            height: "200px",
                            width: "200px",
                            zIndex: 20,
                          }}
                          value={item?.id}
                          viewBox={`0 0 256 256`}
                        />
                      </Box>
                      <Text textAlign={"center"} fontSize={"xs"}>
                        Powered by Chasescroll
                      </Text>
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

export default TicketPurchaseSuccessModal;
