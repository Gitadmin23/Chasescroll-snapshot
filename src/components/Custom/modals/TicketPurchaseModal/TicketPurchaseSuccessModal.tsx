import {
  Box,
  Button,
  Image,
  Flex,
  Text,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import React, { useRef, useMemo } from "react";
import { useAtomValue } from "jotai";
import { activeEventAtom, ticketCountAtom, createdTicketAtom } from "@/states/activeTicket";
import { TickCircle } from "iconsax-reactjs";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { useQuery } from "@tanstack/react-query";
import httpService from "@/services/httpService";
import { URLS } from "@/services/urls";
import { IUser } from "@/models/User";
import { IPurchaseTicket } from "@/models/PurchaseTicket";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import { textLimit } from "@/utils/textlimiter";
import { useColorMode } from "@/components/ui/color-mode";
import useCustomTheme from "@/hooks/useTheme";
import { useReactToPrint } from "react-to-print";
import QRCode from "react-qr-code";
import EventImage from "../../eventDetails/EventImage";
import { dateFormat, timeFormat } from "@/helpers/utils/dateFormat";
import EventPrice from "../../eventDetails/EventPrice";
import UserImage from "../../eventDetails/UserImage";
import { DownloadTwoIcon } from "@/components/svg";
import { CheckCircle2, Printer } from "lucide-react";

interface TicketPurchaseSuccessModalProps {
  onClose?: () => void;
  orderNumber?: string;
  email?: string;
  type?: "EVENT" | "FUNDRAISER" | "PRODUCT";
}

export default function TicketPurchaseSuccessModal({
  onClose,
  orderNumber,
  email,
  type = "EVENT",
}: TicketPurchaseSuccessModalProps) {
  const {
    bodyTextColor,
    primaryColor,
    secondaryBackgroundColor,
    mainBackgroundColor,
    ticketBackgroundColor,
    headerTextColor,
    borderColor,
  } = useCustomTheme();

  const { colorMode } = useColorMode();
  const event = useAtomValue(activeEventAtom);
  const quantity = useAtomValue(ticketCountAtom);
  const createdTicket = useAtomValue(createdTicketAtom);

  const [userDetails] = React.useState<IUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(STORAGE_KEYS.USER_DETAILS);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const [userId] = React.useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.USER_ID) || null;
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // Effective order code and recipient email
  const effectiveOrderCode =
    orderNumber ||
    createdTicket?.content?.orderCode ||
    createdTicket?.content?.orderId ||
    "";

  const effectiveEmail =
    email ||
    createdTicket?.content?.email ||
    createdTicket?.content?.buyer?.email ||
    userDetails?.email ||
    "";

  // Setup printing
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Ticket_${effectiveOrderCode || "Receipt"}`,
  });

  // Query only if user is logged in AND createdTicketAtom is not populated
  const shouldFetchQuery = Boolean(
    (userId || userDetails?.userId) &&
      (!createdTicket?.content?.tickets ||
        createdTicket.content.tickets.length === 0)
  );

  const { isFetching, data } = useQuery({
    queryKey: [`get-tickets-${userDetails?.userId || userId}`, event?.id],
    queryFn: () =>
      httpService.get(`${URLS.event}/get-users-tickets`, {
        params: {
          userID: userId || userDetails?.userId,
          eventID: event?.id,
        },
      }),
    enabled: shouldFetchQuery,
  });

  // Consolidate tickets from createdTicketAtom or query
  const tickets: IPurchaseTicket[] = useMemo(() => {
    // 1. Primary: read newly created tickets from checkout state
    if (
      createdTicket?.content?.tickets &&
      Array.isArray(createdTicket.content.tickets) &&
      createdTicket.content.tickets.length > 0
    ) {
      return createdTicket.content.tickets.map((t: any, index: number) => ({
        id: t.id || `${effectiveOrderCode}-${index + 1}`,
        ticketType:
          t.ticketType || createdTicket?.content?.ticketType || "General Admission",
        boughtPrice:
          t.boughtPrice ??
          createdTicket?.content?.boughtPrice ??
          (createdTicket?.content?.orderTotal
            ? createdTicket.content.orderTotal / createdTicket.content.tickets.length
            : 0),
        price:
          t.price ??
          createdTicket?.content?.price ??
          createdTicket?.content?.boughtPrice ??
          0,
        event: t.event || event,
        createdBy:
          t.createdBy || event?.createdBy || createdTicket?.content?.seller,
        lastModifiedBy: t.lastModifiedBy || t.createdBy,
        isDeleted: false,
        createdDate: t.createdDate || Date.now(),
        lastModifiedDate: t.lastModifiedDate || Date.now(),
        expirationDate: t.expirationDate || "",
        sale: t.sale || "",
        barcodeImage: t.barcodeImage || "",
        ticketUsed: t.ticketUsed || 0,
        index: index + 1,
        scanTimeStamp: t.scanTimeStamp || [],
      })) as unknown as IPurchaseTicket[];
    }

    // 2. Secondary: read from user tickets query
    if (data?.data?.content && Array.isArray(data.data.content) && data.data.content.length > 0) {
      return data.data.content as IPurchaseTicket[];
    }

    // 3. Fallback: single ticket card constructed from order and event data
    if (effectiveOrderCode || event?.id) {
      return [
        {
          id: effectiveOrderCode || "TICKET-CONFIRMED",
          ticketType: createdTicket?.content?.ticketType || "Standard Admission",
          boughtPrice: createdTicket?.content?.orderTotal ?? 0,
          price: createdTicket?.content?.orderTotal ?? 0,
          event: event,
          createdBy: event?.createdBy || createdTicket?.content?.seller,
          lastModifiedBy: event?.createdBy,
          isDeleted: false,
          createdDate: Date.now(),
          lastModifiedDate: Date.now(),
          expirationDate: "",
          sale: "",
          barcodeImage: "",
          ticketUsed: 0,
          index: 1,
          scanTimeStamp: [],
        } as unknown as IPurchaseTicket,
      ];
    }

    return [];
  }, [createdTicket, data, effectiveOrderCode, event]);

  const total = tickets.length;

  const isTodayCheck = (item: any) => {
    if (!item) return false;
    const today = new Date().getDate();
    return (
      new Date(item)?.getDate() === today ||
      new Date(event?.endDate)?.getDate() === today
    );
  };

  const isEventDayCheck = (item: any) => {
    if (!item || !Array.isArray(item) || item.length === 0) return false;
    const lastDate = new Date(item[item.length - 1]).getDate();
    return (
      lastDate >= new Date(event?.startDate)?.getDate() &&
      lastDate <= new Date(event?.endDate)?.getDate()
    );
  };

  return (
    <Box w="full" bg={mainBackgroundColor} p={["4", "6"]} position="relative">
      {/* Header Banner */}
      <Flex
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        mb="6"
        gap="3"
      >
        <Flex
          w="54px"
          h="54px"
          rounded="full"
          bg="green.50"
          borderWidth="1px"
          borderColor="green.200"
          justifyContent="center"
          alignItems="center"
          shadow="sm"
        >
          <CheckCircle2 size={32} color="#10B981" />
        </Flex>

        <Box>
          <Text
            fontSize={["20px", "24px"]}
            fontWeight="bold"
            color={headerTextColor}
          >
            Payment Successful!
          </Text>
          <Text fontSize="sm" color="gray.500" mt="1">
            Your ticket order has been confirmed.
          </Text>
        </Box>

        {effectiveOrderCode && (
          <Badge
            colorPalette="blue"
            variant="subtle"
            px="3"
            py="1"
            rounded="full"
            fontSize="xs"
            fontWeight="semibold"
          >
            Order Ref: {effectiveOrderCode}
          </Badge>
        )}

        {effectiveEmail && (
          <Text fontSize="xs" color="gray.500">
            A confirmation receipt has been sent to{" "}
            <Text as="span" fontWeight="medium" color={headerTextColor}>
              {effectiveEmail}
            </Text>
          </Text>
        )}

        {/* Action Controls */}
        <Flex
          gap="3"
          mt="2"
          w="full"
          maxW="420px"
          justifyContent="center"
          flexWrap="wrap"
        >
          <Button
            onClick={() => reactToPrintFn()}
            colorPalette="blue"
            bg="brand.chasescrollBlue"
            color="white"
            size="sm"
            px="5"
            rounded="full"
            fontWeight="semibold"
            _hover={{ opacity: 0.9 }}
          >
            <Printer size={16} />
            Download / Print Tickets
          </Button>

          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              px="5"
              rounded="full"
              borderColor="gray.300"
              color={bodyTextColor}
              _hover={{ bg: "gray.50" }}
            >
              Done
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Loading state if fetching tickets from API */}
      {isFetching && tickets.length === 0 && (
        <Flex py="12" justify="center" align="center" direction="column" gap="3">
          <Spinner size="lg" color="brand.chasescrollBlue" />
          <Text fontSize="sm" color="gray.500">
            Loading your tickets...
          </Text>
        </Flex>
      )}

      {/* Printable Tickets Container */}
      <Box
        ref={contentRef}
        w="full"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="5"
      >
        {tickets.map((item, index: number) => {
          const scanStamp = item?.scanTimeStamp;
          const showApproved =
            isTodayCheck(
              Array.isArray(scanStamp) && scanStamp.length > 0
                ? scanStamp[scanStamp.length - 1]
                : ""
            ) && isEventDayCheck(scanStamp);

          return (
            <Flex
              key={item.id || index}
              w="full"
              maxW="720px"
              bg={
                index === 0 ? secondaryBackgroundColor : ticketBackgroundColor
              }
              borderWidth="1px"
              borderColor={borderColor}
              rounded="2xl"
              overflow="hidden"
              shadow="sm"
              flexDirection={["column", "column", "row"]}
              alignItems="stretch"
              position="relative"
              transition="all 0.2s ease"
            >
              {/* Left / Top: Event Image & Basic Info */}
              <Flex
                p={["4", "5"]}
                flex="1"
                flexDirection={["column", "row"]}
                gap="4"
                alignItems={["start", "center"]}
              >
                {/* Event Image */}
                <Box
                  w={["full", "140px", "160px"]}
                  h={["160px", "140px", "160px"]}
                  flexShrink={0}
                  rounded="xl"
                  overflow="hidden"
                  bg="gray.100"
                >
                  <EventImage
                    width="100%"
                    height="100%"
                    data={item?.event || event}
                  />
                </Box>

                {/* Event Details */}
                <Flex
                  flexDirection="column"
                  flex="1"
                  gap="2.5"
                  w="full"
                  position="relative"
                >
                  {/* Event Title */}
                  <Text
                    fontSize={["18px", "20px"]}
                    fontWeight="bold"
                    color={headerTextColor}
                    lineHeight="1.2"
                  >
                    {capitalizeFLetter(
                      textLimit(
                        item?.event?.eventName || event?.eventName || "Event Ticket",
                        26
                      )
                    )}
                  </Text>

                  {/* Date & Time Badges */}
                  <Flex gap="2" flexWrap="wrap" alignItems="center">
                    {(item?.event?.startDate || event?.startDate) && (
                      <Badge
                        variant="surface"
                        colorPalette="blue"
                        fontSize="xs"
                        px="2.5"
                        py="0.5"
                        rounded="full"
                      >
                        {dateFormat(item?.event?.startDate || event?.startDate)}
                      </Badge>
                    )}
                    {(item?.event?.startDate || event?.startDate) && (
                      <Badge
                        variant="subtle"
                        fontSize="xs"
                        px="2.5"
                        py="0.5"
                        rounded="full"
                      >
                        {timeFormat(item?.event?.startDate || event?.startDate)}
                      </Badge>
                    )}
                  </Flex>

                  {/* Ticket Meta Grid */}
                  <Flex
                    gap="4"
                    pt="1"
                    borderTopWidth="1px"
                    borderColor="gray.200"
                    alignItems="center"
                  >
                    <Flex flexDirection="column">
                      <Text
                        fontWeight="bold"
                        fontSize="11px"
                        color="brand.chasescrollBlue"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Type
                      </Text>
                      <Text
                        color={headerTextColor}
                        fontWeight="semibold"
                        fontSize="12px"
                      >
                        {item.ticketType}
                      </Text>
                    </Flex>

                    <Flex flexDirection="column">
                      <Text
                        fontWeight="bold"
                        fontSize="11px"
                        color="brand.chasescrollBlue"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Fee
                      </Text>
                      <Text
                        color={bodyTextColor}
                        fontWeight="medium"
                        fontSize="12px"
                      >
                        <EventPrice
                          minPrice={item?.boughtPrice}
                          maxPrice={item?.boughtPrice}
                          currency={item?.event?.currency || event?.currency}
                        />
                      </Text>
                    </Flex>

                    <Flex flexDirection="column">
                      <Text
                        fontWeight="bold"
                        fontSize="11px"
                        color="brand.chasescrollBlue"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Ticket
                      </Text>
                      <Text
                        color={bodyTextColor}
                        fontWeight="medium"
                        fontSize="12px"
                      >
                        {index + 1} of {total}
                      </Text>
                    </Flex>
                  </Flex>

                  {/* Organizer Details */}
                  {(item?.createdBy || event?.createdBy) && (
                    <Flex gap="2.5" alignItems="center" pt="1">
                      <UserImage
                        size="xs"
                        user={item?.createdBy || event?.createdBy}
                      />
                      <Flex flexDirection="column">
                        <Text
                          fontSize="11px"
                          color="gray.400"
                          lineHeight="1"
                        >
                          Organized by
                        </Text>
                        <Text
                          fontSize="12px"
                          fontWeight="medium"
                          color={bodyTextColor}
                          lineHeight="1.2"
                        >
                          {(item?.createdBy?.firstName ||
                            event?.createdBy?.firstName ||
                            "") +
                            " " +
                            (item?.createdBy?.lastName ||
                              event?.createdBy?.lastName ||
                              "")}
                        </Text>
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Flex>

              {/* Stamp overlay if verified today */}
              {showApproved && (
                <Box
                  position="absolute"
                  top="2"
                  right="2"
                  zIndex="2"
                >
                  <Image
                    src="/images/approved.svg"
                    alt="approved"
                    width="70px"
                    height="70px"
                    objectFit="contain"
                  />
                </Box>
              )}

              {/* Tear-off Dashed Divider */}
              <Box
                display={["none", "none", "block"]}
                w="1px"
                borderLeftWidth="1.5px"
                borderLeftStyle="dashed"
                borderColor="gray.300"
                my="3"
                position="relative"
              />
              <Box
                display={["block", "block", "none"]}
                h="1px"
                borderTopWidth="1.5px"
                borderTopStyle="dashed"
                borderColor="gray.300"
                mx="4"
              />

              {/* Right / Bottom: QR Code Section */}
              <Flex
                p={["4", "5"]}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap="2"
                minW={["full", "full", "200px"]}
                bg={colorMode === "dark" ? "gray.800" : "gray.50"}
              >
                <Box
                  bg="white"
                  p="3"
                  rounded="xl"
                  shadow="sm"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <QRCode
                    value={item?.id || effectiveOrderCode}
                    size={130}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox="0 0 256 256"
                  />
                </Box>

                <Text
                  fontSize="11px"
                  fontFamily="mono"
                  color="gray.500"
                  maxW="160px"
                  textAlign="center"
                  wordBreak="break-all"
                >
                  {item?.id ? textLimit(item.id, 18) : effectiveOrderCode}
                </Text>

                <Text fontSize="10px" color="gray.400" textAlign="center">
                  Scan at event entrance
                </Text>

                <Text
                  fontSize="9px"
                  fontWeight="semibold"
                  color="gray.400"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Powered by Chasescroll
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}
