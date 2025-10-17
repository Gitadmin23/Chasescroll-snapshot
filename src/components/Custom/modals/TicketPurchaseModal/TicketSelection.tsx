"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  VStack,
  HStack,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { Add, Minus, ShoppingCart } from "iconsax-reactjs";
import { useAtom, useSetAtom } from "jotai";
import {
  activeEventAtom,
  activeTicketAtom,
  selectedTicketsAtom,
  ticketCountAtom,
  ticketurchaseStepAtom,
  totalAmountForSelectedTicketsAtom,
} from "@/states/activeTicket";
import { IProductTypeData } from "@/models/Event";
import { toaster } from "@/components/ui/toaster";
import { formatNumber } from "@/utils/formatNumber";
import CustomText from "../../CustomText";
import { dateFormat, timeFormat } from "@/utils/dateFormat";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import useCustomTheme from "@/hooks/useTheme";
import { formatNumberWithK } from "@/utils/formatNumberWithK";
import ProductImageScroller from "../../productImageScroller";
import CustomButton from "../../customButton";
import DescriptionCard from "../../description";

interface TicketSelectionProps {
  eventTitle?: string;
  eventDate?: string;
  eventImage?: string;
}

const TicketSelection: React.FC<TicketSelectionProps> = ({
  eventTitle = "Tech Submit",
  eventDate = "Aug 13, 2025 11:00 PM",
  eventImage = "/images/tech-event.jpg",
}) => {
  const [event, setActiveEvent] = useAtom(activeEventAtom);
  const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom);
  const setStep = useSetAtom(ticketurchaseStepAtom);
  const setTotalSelectedTicketPrice = useSetAtom(
    totalAmountForSelectedTicketsAtom
  );
  const [totalTickets, setTotalTicket] = useState(() => {
    let total = 0;
    event?.productTypeData.forEach((item) => {
      total += item.totalNumberOfTickets as number;
    });
    return total;
  });

  const { primaryColor, secondaryBackgroundColor, headerTextColor } =
    useCustomTheme();

  const increment = (ticketType: string) => {
    console.log(selectedTickets);
    if (selectedTickets?.length < 1 || selectedTickets === null) {
      setSelectedTickets([
        {
          ticketType,
          quantity: 1,
        },
      ]);
    } else {
      //    check if the ticket exisit
      const ticket = selectedTickets?.filter(
        (item) => item.ticketType === ticketType
      )[0];
      const eventTicket = event?.productTypeData.filter(
        (item) => item.ticketType === ticketType
      )[0];
      if (ticket) {
        if (ticket.quantity + 1 > (eventTicket?.maxTicketBuy as number)) {
          toaster.create({
            title: "Error",
            description: `Oops! Ticket purchases are limited to ${eventTicket?.maxTicketBuy} per person to ensure fair availability.`,
            type: "error",
          });
          return;
        }

        if (
          ticket.quantity + 1 >
          Number(eventTicket?.totalNumberOfTickets) -
          Number(eventTicket?.ticketsSold)
        ) {
          toaster.create({
            title: "Error",
            description: `Oops! We only have ${Number(eventTicket?.totalNumberOfTickets) -
              Number(eventTicket?.ticketsSold)
              } of this tickets left. We’ve added the available ticket amount to your cart.`,
            type: "error",
          });
          return;
        }
        setSelectedTickets(
          selectedTickets?.map((item) => {
            if (item.ticketType === ticketType) {
              return {
                ticketType,
                quantity: item.quantity + 1,
              };
            }
            return item;
          })
        );
      } else {
        setSelectedTickets([
          ...selectedTickets,
          {
            ticketType,
            quantity: 1,
          },
        ]);
      }
    }
  };

  const decrement = (ticketType: string) => {
    if (selectedTickets?.length < 1 || selectedTickets === null) {
      return;
    } else {
      // check if the ticket exisit
      const ticket = selectedTickets?.filter(
        (item) => item.ticketType === ticketType
      )[0];
      const eventTicket = event?.productTypeData.filter(
        (item) => item.ticketType === ticketType
      )[0];
      if (ticket) {
        if (ticket.quantity - 1 === 0) {
          const filtered = selectedTickets.filter(
            (item) => item.ticketType !== ticketType
          );
          setSelectedTickets(filtered);
          return;
        }
        setSelectedTickets(
          selectedTickets?.map((item) => {
            if (item.ticketType === ticketType) {
              return {
                ticketType,
                quantity: item.quantity - 1,
              };
            }
            return item;
          })
        );
      }
    }
  };

  const getTicket = (ticketType: string) => {
    return selectedTickets?.filter((item) => item.ticketType === ticketType)[0];
  };

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

  const disabledCheck = (item: IProductTypeData) => {
    if (new Date(Number(item?.endDate)) < new Date()) {
      return true;
    } else if (
      Number(item?.totalNumberOfTickets) - Number(item?.ticketsSold) ===
      0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleNext = () => {
    if (selectedTickets === null || selectedTickets?.length < 1) {
      toaster.create({
        title: "Error",
        description: "You need to select a ticket to continue",
        type: "error",
        closable: true,
      });
      return;
    }
    setStep((prev) => prev + 1);
  };

  return (
    <>
      <Flex
        w={"full"}
        maxH={"80vh"}
        display={["flex", "flex", "none"]}
        h={"full"}
        overflowY={"auto"}
      >
        <Flex flexDir={"column"} h={"full"} py={"6"} w={"full"}>
          <Flex
            flexDir={"column"}
            h={"fit-content"}
            gap={"7"}
            px={"3"}
            w={"full"}
          >
            <Flex
              flexDirection={"column"}
              textAlign={"center"}
              w={"full"}
              pb={"2"}
              borderBottomWidth={"1px"}
              gap={"1"}
            >
              <Text fontWeight={"700"} fontSize={"16px"}>
                {event?.eventName}
              </Text>
              <Text fontSize={"14px"}>{dateFormat(event?.startDate)}</Text>
            </Flex>
            <Flex w={"full"}>
              <ProductImageScroller
                objectFit={"cover"}
                images={event?.picUrls?.length > 0 ? [...event?.picUrls] : []}
                height={"200px"}
              />
            </Flex>
            <Flex flexDir={"column"} w={"full"}>
              <Flex flexDir={"column"} h={"auto"} gap={"3"}>
                {event?.productTypeData?.map((item, index) => {
                  if (
                    new Date(Number(item?.startDate)) <= new Date() &&
                    item.ticketType === "Early Bird"
                  ) {
                    return (
                      <Flex
                        flexDir={["row", "row", "row"]}
                        gap={"2"}
                        _hover={{ borderColor: primaryColor }}
                        key={index}
                        w={"full"}
                        borderWidth={"1px"}
                        justifyContent={"space-between"}
                        rounded={"8px"}
                        minH={"110px"} height={"fit"} px={"4"} py={"4"}
                      >
                        <Flex flexDir={"column"} gap={"2"} h={"full"} justifyContent={"center"} >
                          <Text fontWeight={"semibold"}>
                            {capitalizeFLetter(item.ticketType)}{" - "}
                            {formatNumber(item?.ticketPrice)}
                          </Text>
                          {item.ticketType === "Early Bird" ? (
                            <>
                              {Number(item?.totalNumberOfTickets) ===
                                0 ||
                                new Date(Number(item?.endDate)) < new Date() ? (
                                <Badge
                                  maxW={"100%"}
                                  w={"fit-content"}
                                  colorPalette={"red"}
                                  fontSize={"xs"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Tickets sold out
                                </Badge>
                              ) : (
                                <Badge
                                  maxW={"100%"}
                                  w={"fit-content"}
                                  py={"1"}
                                  whiteSpace={"break-spaces"}
                                  colorPalette={"red"}
                                  fontSize={"xs"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Sales ends on {dateFormat(item.endDate)}{" "}
                                  {timeFormat(item.endDate)}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <>
                              {Number(item?.totalNumberOfTickets) ===
                                0 ? (
                                <Badge
                                  maxW={"100%"}
                                  w={"fit-content"}
                                  colorPalette={"red"}
                                  fontSize={"xs"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Tickets sold out
                                </Badge>
                              ) : (
                                <Badge
                                  maxW={"100%"}
                                  w={"fit-content"}
                                  colorPalette={"blue"}
                                  fontSize={"xs"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Total Tickets avaliable -{" "}
                                  {Number(item?.totalNumberOfTickets)}
                                </Badge>
                              )}
                            </>
                          )}
                          {item?.description && (
                            <>
                              <Flex display={["none", "none", "flex"]} >
                                <DescriptionCard ticket={true} limit={75} label='' description={item?.description} />
                              </Flex>
                              <Flex display={["flex", "flex", "none"]} >
                                <DescriptionCard ticket={true} limit={75} label='' description={item?.description} />
                              </Flex>
                            </>
                          )}
                        </Flex>
                        <Flex gap={"3"} alignItems={"center"} h={"fit-content"} mt={"3"} >
                          <IconButton
                            disabled={!getTicket(item.ticketType)}
                            onClick={() => decrement(item.ticketType)}
                            bgColor={secondaryBackgroundColor}
                            color={headerTextColor}
                            rounded={"full"}
                            size="sm"
                          >
                            {/* <LuMinus /> */}
                            <Text fontWeight={"500"} fontSize={"25px"}>
                              -
                            </Text>
                          </IconButton>
                          {getTicket(item.ticketType)?.quantity
                            ? getTicket(item?.ticketType)?.quantity
                            : 0}
                          <IconButton
                            disabled={disabledCheck(item)}
                            onClick={() => increment(item.ticketType)}
                            bgColor={secondaryBackgroundColor}
                            color={headerTextColor}
                            rounded={"full"}
                            size="sm"
                          >
                            <Text fontWeight={"500"} fontSize={"25px"}>
                              +
                            </Text>
                          </IconButton>
                        </Flex>
                      </Flex>
                    );
                  } else if (item.ticketType !== "Early Bird") {
                    return (
                      <Flex
                        flexDir={["row", "row", "row"]}
                        gap={"2"}
                        _hover={{ borderColor: primaryColor }}
                        key={index}
                        w={"full"}
                        borderWidth={"1px"}
                        justifyContent={"space-between"}
                        rounded={"8px"}
                        minH={"110px"} height={"fit"} px={"4"} py={"4"}
                      >
                        <Flex flexDir={"column"} gap={"2"} h={"full"} justifyContent={"center"} >
                          <Text fontWeight={"semibold"}>
                            {capitalizeFLetter(item.ticketType)}{" - "}
                            {formatNumber(item?.ticketPrice)}
                          </Text>
                          {item.ticketType === "Early Bird" ? (
                            <>
                              {Number(item?.totalNumberOfTickets) ===
                                0 ||
                                new Date(Number(item?.endDate)) < new Date() ? (
                                <Badge
                                  maxW={"100%"}
                                  w={"fit-content"}
                                  colorPalette={"red"}
                                  fontSize={"xs"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Tickets sold out
                                </Badge>
                              ) : (
                                <Badge
                                  maxW={"100%"}
                                  w={"fit-content"}
                                  py={"1"}
                                  whiteSpace={"break-spaces"}
                                  colorPalette={"red"}
                                  fontSize={"xs"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Sales ends on {dateFormat(item.endDate)}{" "}
                                  {timeFormat(item.endDate)}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <>
                              {Number(item?.totalNumberOfTickets) ===
                                0 ? (
                                <Badge
                                  maxW={"100%"}
                                  w={"fit-content"}
                                  colorPalette={"red"}
                                  fontSize={"xs"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Tickets sold out
                                </Badge>
                              ) : (
                                <Badge
                                  maxW={"100%"}
                                  w={"fit-content"}
                                  colorPalette={"blue"}
                                  fontSize={"xs"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Total Tickets avaliable -{" "}
                                  {Number(item?.totalNumberOfTickets)}
                                </Badge>
                              )}
                            </>
                          )}
                          {item?.description && (
                            <>
                              <Flex display={["none", "none", "flex"]} >
                                <DescriptionCard ticket={true} limit={75} label='' description={item?.description} />
                              </Flex>
                              <Flex display={["flex", "flex", "none"]} >
                                <DescriptionCard ticket={true} limit={75} label='' description={item?.description} />
                              </Flex>
                            </>
                          )}
                        </Flex>
                        <Flex gap={"3"} alignItems={"center"} h={"fit-content"} mt={"3"} >
                          <IconButton
                            disabled={!getTicket(item.ticketType)}
                            onClick={() => decrement(item.ticketType)}
                            bgColor={secondaryBackgroundColor}
                            color={headerTextColor}
                            rounded={"full"}
                            size="sm"
                          >
                            {/* <LuMinus /> */}
                            <Text fontWeight={"500"} fontSize={"25px"}>
                              -
                            </Text>
                          </IconButton>
                          {getTicket(item.ticketType)?.quantity
                            ? getTicket(item?.ticketType)?.quantity
                            : 0}
                          <IconButton
                            disabled={disabledCheck(item)}
                            onClick={() => increment(item.ticketType)}
                            bgColor={secondaryBackgroundColor}
                            color={headerTextColor}
                            rounded={"full"}
                            size="sm"
                          >
                            <Text fontWeight={"500"} fontSize={"25px"}>
                              +
                            </Text>
                          </IconButton>
                        </Flex>
                      </Flex>
                    );
                  }
                })}
              </Flex>
            </Flex>
            <Text fontWeight={"medium"} mr={"auto"}>
              Powered by{" "}
              <span style={{ color: primaryColor, fontStyle: "italic" }}>
                Chasescroll.com
              </span>
            </Text>
          </Flex>
          <Flex
            bgColor={secondaryBackgroundColor}
            rounded={"8px"}
            w={"full"}
            p={"4"}
            flexDir={"column"}
            gap={"4"}
          >
            {selectedTickets?.length < 1 && (
              <VStack
                flex={1}
                py={"6"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <ShoppingCart size="60px" variant="Outline" color="lightgrey" />
              </VStack>
            )}

            {selectedTickets === null && (
              <VStack
                flex={1}
                py={"6"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <ShoppingCart size="60px" variant="Outline" color="lightgrey" />
              </VStack>
            )}

            {/* Order Summary */}
            {selectedTickets?.length > 0 && (
              <Box p="20px">
                {/* <Divider mb={4} /> */}
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Order summary
                </Text>

                <VStack spaceY={3} align="stretch">
                  {selectedTickets !== null &&
                    selectedTickets.length > 0 &&
                    selectedTickets.map((item, key) => (
                      <Flex
                        justify="space-between"
                        mb="10px"
                        key={key.toString()}
                      >
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
            )}
          </Flex>
          <Flex
            w={"full"}
            justifyContent={"end"}
            pt={"4"}
            px={"4"}
            borderTopWidth={"1px"}
            mt={"auto"}
          >
            <CustomButton
              height={"35px"}
              onClick={handleNext}
              fontSize={"14px"}
              width={"fit-content"}
              text={"Get Ticket"}
              px={"6"}
              borderRadius={"999px"}
            />
          </Flex>
          <Flex w={"full"} h={"300px"} />
        </Flex>
      </Flex>
      <Flex
        w={"full"}
        h={"70vh"}
        display={["none", "none", "flex"]}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Flex
          p={"5"}
          h={"full"}
          borderWidth={"1px"}
          rounded={"2xl"}
          gap={"4"}
          w={"full"}
          maxW={"1032px"}
        >
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            gap={"7"}
            px={"3"}
            w={"full"}
          >
            <Flex
              flexDirection={"column"}
              textAlign={"center"}
              w={"full"}
              pb={"2"}
              borderBottomWidth={"1px"}
              gap={"1"}
            >
              <Text fontWeight={"700"} fontSize={"16px"}>
                {event?.eventName}
              </Text>
              <Text fontSize={"14px"}>{dateFormat(event?.startDate)}</Text>
            </Flex>
            <Flex
              flexDir={"column"}
              h={"full"}
              w={"full"}
              overflowY={"auto"}
              pr={"4"}
            >
              <Flex flexDir={"column"} h={"auto"} gap={"3"}>
                {event?.productTypeData?.map((item, index) => {
                  if (
                    new Date(Number(item?.startDate)) <= new Date() &&
                    item.ticketType === "Early Bird"
                  ) {
                    return (
                      <Flex
                        _hover={{ borderColor: primaryColor }}
                        key={index}
                        w={"full"}
                        borderWidth={"1px"}
                        justifyContent={"space-between"}
                        rounded={"8px"}
                        minH={"110px"} height={"fit"} px={"4"} py={"4"}
                      >
                        <Flex flexDir={"column"} gap={"2"} h={"full"} justifyContent={"center"} >
                          <Text fontWeight={"semibold"}>
                            {capitalizeFLetter(item.ticketType)}{" - "}
                            {formatNumber(item?.ticketPrice)}
                          </Text>
                          {item.ticketType === "Early Bird" ? (
                            <>
                              {Number(item?.totalNumberOfTickets) ===
                                0 ||
                                new Date(Number(item?.endDate)) < new Date() ? (
                                <Badge
                                  colorPalette={"red"}
                                  fontSize={"sm"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Tickets sold out
                                </Badge>
                              ) : (
                                <Badge
                                  colorPalette={"red"}
                                  fontSize={"sm"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Sales ends on {dateFormat(item.endDate)}{" "}
                                  {timeFormat(item.endDate)}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <>
                              {Number(item?.totalNumberOfTickets) ===
                                0 ? (
                                <Badge
                                  colorPalette={"red"}
                                  fontSize={"sm"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Tickets sold out
                                </Badge>
                              ) : (
                                <Badge
                                  colorPalette={"blue"}
                                  fontSize={"sm"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Total Tickets avaliable -{" "}
                                  {Number(item?.totalNumberOfTickets)}
                                </Badge>
                              )}
                            </>
                          )}
                          {item?.description && (
                            <>
                              <Flex display={["none", "none", "flex"]} >
                                <DescriptionCard ticket={true} limit={75} label='' description={item?.description} />
                              </Flex>
                              <Flex display={["flex", "flex", "none"]} >
                                <DescriptionCard ticket={true} limit={75} label='' description={item?.description} />
                              </Flex>
                            </>
                          )}
                        </Flex>
                        <Flex gap={"3"} alignItems={"center"} h={"fit-content"} mt={"3"} >
                          <IconButton
                            disabled={!getTicket(item.ticketType)}
                            onClick={() => decrement(item.ticketType)}
                            bgColor={secondaryBackgroundColor}
                            color={headerTextColor}
                            rounded={"full"}
                            size="sm"
                          >
                            {/* <LuMinus /> */}
                            <Text fontWeight={"500"} fontSize={"25px"}>
                              -
                            </Text>
                          </IconButton>
                          {getTicket(item.ticketType)?.quantity
                            ? getTicket(item?.ticketType)?.quantity
                            : 0}
                          <IconButton
                            disabled={disabledCheck(item)}
                            onClick={() => increment(item.ticketType)}
                            bgColor={secondaryBackgroundColor}
                            color={headerTextColor}
                            rounded={"full"}
                            size="sm"
                          >
                            <Text fontWeight={"500"} fontSize={"25px"}>
                              +
                            </Text>
                          </IconButton>
                        </Flex>
                      </Flex>
                    );
                  } else if (item.ticketType !== "Early Bird") {
                    return (
                      <Flex
                        _hover={{ borderColor: primaryColor }}
                        key={index}
                        w={"full"}
                        borderWidth={"1px"}
                        justifyContent={"space-between"}
                        // alignItems={"center"}
                        rounded={"8px"}
                        minH={"110px"} height={"fit"} px={"4"} py={"4"}
                      >
                        <Flex flexDir={"column"} gap={"2"} h={"full"} justifyContent={"center"} >
                          <Text fontWeight={"semibold"}>
                            {capitalizeFLetter(item.ticketType)}{" - "}
                            {formatNumber(item?.ticketPrice)}
                          </Text>
                          {item.ticketType === "Early Bird" ? (
                            <>
                              {Number(item?.totalNumberOfTickets) ===
                                0 ||
                                new Date(Number(item?.endDate)) < new Date() ? (
                                <Badge
                                  colorPalette={"red"}
                                  fontSize={"sm"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Tickets sold out
                                </Badge>
                              ) : (
                                <Badge
                                  colorPalette={"red"}
                                  fontSize={"sm"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Sales ends on {dateFormat(item.endDate)}{" "}
                                  {timeFormat(item.endDate)}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <>
                              {Number(item?.totalNumberOfTickets) ===
                                0 ? (
                                <Badge
                                  colorPalette={"red"}
                                  fontSize={"sm"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Tickets sold out
                                </Badge>
                              ) : (
                                <Badge
                                  colorPalette={"blue"}
                                  fontSize={"sm"}
                                  px={"3"}
                                  rounded={"full"}
                                >
                                  Total Tickets avaliable -{" "}
                                  {Number(item?.totalNumberOfTickets)}
                                </Badge>
                              )}
                            </>
                          )}
                          {item?.description && (
                            <>
                              <Flex display={["none", "none", "flex"]} >
                                <DescriptionCard ticket={true} limit={75} label='' description={item?.description} />
                              </Flex>
                              <Flex display={["flex", "flex", "none"]} >
                                <DescriptionCard ticket={true} limit={75} label='' description={item?.description} />
                              </Flex>
                            </>
                          )}
                        </Flex>
                        <Flex gap={"3"} alignItems={"center"} h={"fit-content"} mt={"3"} >
                          <IconButton
                            disabled={!getTicket(item.ticketType)}
                            onClick={() => decrement(item.ticketType)}
                            bgColor={secondaryBackgroundColor}
                            color={headerTextColor}
                            rounded={"full"}
                            size="sm"
                          >
                            {/* <LuMinus /> */}
                            <Text fontWeight={"500"} fontSize={"25px"}>
                              -
                            </Text>
                          </IconButton>
                          {getTicket(item.ticketType)?.quantity
                            ? getTicket(item?.ticketType)?.quantity
                            : 0}
                          <IconButton
                            disabled={disabledCheck(item)}
                            onClick={() => increment(item.ticketType)}
                            bgColor={secondaryBackgroundColor}
                            color={headerTextColor}
                            rounded={"full"}
                            size="sm"
                          >
                            <Text fontWeight={"500"} fontSize={"25px"}>
                              +
                            </Text>
                          </IconButton>
                        </Flex>
                      </Flex>
                    );
                  }
                })}
              </Flex>
            </Flex>
            <Text fontWeight={"medium"} mr={"auto"}>
              Powered by{" "}
              <span style={{ color: primaryColor, fontStyle: "italic" }}>
                Chasescroll.com
              </span>
            </Text>
            <Flex
              w={"full"}
              justifyContent={"end"}
              pt={"4"}
              borderTopWidth={"1px"}
              mt={"auto"}
            >
              <CustomButton
                height={"35px"}
                onClick={handleNext}
                fontSize={"14px"}
                width={"fit-content"}
                text={"Get Ticket"}
                px={"6"}
                borderRadius={"999px"}
              />
            </Flex>
          </Flex>
          <Flex
            bgColor={secondaryBackgroundColor}
            rounded={"8px"}
            w={"fit-content"}
            flexDir={"column"}
            gap={"4"}
          >
            <Flex w={"350px"}>
              <ProductImageScroller
                objectFit={"cover"}
                images={event?.picUrls}
                height={"200px"}
              />
            </Flex>

            {selectedTickets?.length < 1 && (
              <VStack
                flex={1}
                py={"6"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <ShoppingCart size="60px" variant="Outline" color="lightgrey" />
              </VStack>
            )}

            {selectedTickets === null && (
              <VStack
                flex={1}
                py={"6"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <ShoppingCart size="60px" variant="Outline" color="lightgrey" />
              </VStack>
            )}

            {/* Order Summary */}
            {selectedTickets?.length > 0 && (
              <Box p="20px">
                {/* <Divider mb={4} /> */}
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
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default TicketSelection;
