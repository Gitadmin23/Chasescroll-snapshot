"use client";

import React from "react";
import {
  Dialog,
  Portal,
  CloseButton,
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { RESOURCE_URL } from "@/constants";
import {
  activeEventAtom,
  activeTicketAtom,
  createdTicketAtom,
  isPaystackOpenAtom,
  selectedTicketsAtom,
  ticketCountAtom,
  ticketurchaseStepAtom,
} from "@/states/activeTicket";
import { currentIdAtom } from "@/views/share/Event";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { IEventType } from "@/models/Event";

import TicketSelection from "./TicketSelection";
import AccountSetup from "./AccountSetup";
import LoginModal from "./LoginModal";
import TicketPurchaseSuccessModal from "./TicketPurchaseSuccessModal";

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "EVENT" | "FUNDRAISER" | "PRODUCT";
  event?: IEventType;
}

function TicketPurchaseModal({
  isOpen,
  onClose,
  event: propEvent,
}: TicketPurchaseModalProps) {
  const [quantity, setQuantity] = useAtom(ticketCountAtom);
  const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);
  const [event, setEvent] = useAtom(activeEventAtom);
  const [, setActiveTicket] = useAtom(activeTicketAtom);
  const [, setSelectedTickets] = useAtom(selectedTicketsAtom);
  const currentId = useAtomValue(currentIdAtom);
  const createdTicket = useAtomValue(createdTicketAtom);
  const [isPaystackOpen, setIsPaystackOpen] = useAtom(isPaystackOpenAtom);

  // Sync event from prop when provided
  React.useEffect(() => {
    if (propEvent && propEvent.id && propEvent.id !== event?.id) {
      setEvent(propEvent);
    }
  }, [propEvent, event?.id, setEvent]);

  // Safely close and clear only ticket transaction keys
  const handleClose = React.useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
        sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_TICKET);
        sessionStorage.removeItem(STORAGE_KEYS.SELECTED_TICKETS);
        sessionStorage.removeItem(STORAGE_KEYS.TICKET_COUNT);
        sessionStorage.removeItem(STORAGE_KEYS.EVENT_TOTAL_AMOUNT);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_TICKET);
        localStorage.removeItem(STORAGE_KEYS.SELECTED_TICKETS);
        localStorage.removeItem(STORAGE_KEYS.TICKET_COUNT);
        localStorage.removeItem(STORAGE_KEYS.EVENT_TOTAL_AMOUNT);
      }
    } catch (e) {
      console.error("Error clearing ticket session keys:", e);
    }

    setIsPaystackOpen(false);
    setCurrentStep(1);
    setQuantity(1);
    setSelectedTickets([]);
    onClose();
  }, [setCurrentStep, setQuantity, setSelectedTickets, setIsPaystackOpen, onClose]);

  const activeEventData = propEvent || event;

  const eventImage = React.useMemo(() => {
    if (!activeEventData?.currentPicUrl) return undefined;
    if (activeEventData.currentPicUrl.startsWith("http")) {
      return activeEventData.currentPicUrl;
    }
    return `${RESOURCE_URL}${activeEventData.currentPicUrl}`;
  }, [activeEventData?.currentPicUrl]);

  return (
    <Dialog.Root
      lazyMount
      unmountOnExit
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open && !isPaystackOpen) {
          handleClose();
        }
      }}
      size={
        currentStep === 3
          ? "sm"
          : currentStep === 1
          ? "cover"
          : ["full", "xl", "xl"]
      }
      placement="center"
      closeOnEscape={!isPaystackOpen}
      closeOnInteractOutside={false}
      modal={false}
    >
      <Portal>
        {/* Prioritize Paystack iframe and container above all modal layers */}
        <style>{`
          .paystack-checkout,
          iframe[src*="paystack"],
          #paystack-inline-iframe {
            z-index: 2147483647 !important;
            pointer-events: auto !important;
          }
        `}</style>

        <Dialog.Backdrop
          backdropFilter={isPaystackOpen ? "none" : "blur(8px)"}
          bg={isPaystackOpen ? "transparent" : "blackAlpha.700"}
          opacity={isPaystackOpen ? 0 : 1}
          pointerEvents={isPaystackOpen ? "none" : "auto"}
          visibility={isPaystackOpen ? "hidden" : "visible"}
          transition="opacity 0.25s ease"
        />
        <Dialog.Positioner
          p={["0", "2", "4"]}
          opacity={isPaystackOpen ? 0 : 1}
          pointerEvents={isPaystackOpen ? "none" : "auto"}
          visibility={isPaystackOpen ? "hidden" : "visible"}
          zIndex={isPaystackOpen ? -1 : 1400}
          transition="opacity 0.2s ease, visibility 0.2s ease"
        >
          <Dialog.Content
            borderRadius={["0px", "16px", "20px"]}
            w={["100vw", "95vw", "full"]}
            maxW={
              currentStep === 1
                ? ["100vw", "95vw", "1060px"]
                : currentStep === 3
                ? ["100vw", "90vw", "460px"]
                : ["100vw", "95vw", "780px"]
            }
            maxH={["100dvh", "90vh", "92vh"]}
            minH={["100dvh", "auto", "auto"]}
            bgColor="white"
            boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.35)"
            overflow="hidden"
            position="relative"
            p="0"
          >
            {/* Top Close Button */}
            <Dialog.CloseTrigger
              asChild
              position="absolute"
              top="3"
              right="3"
              zIndex="50"
            >
              <CloseButton
                bg="blackAlpha.100"
                _hover={{ bg: "blackAlpha.200", transform: "scale(1.05)" }}
                color="gray.700"
                size="sm"
                rounded="full"
                transition="all 0.2s"
                onClick={handleClose}
              />
            </Dialog.CloseTrigger>

            {/* Step 3 (Login) back navigation */}
            {currentStep === 3 && (
              <Flex
                w="full"
                px="6"
                pt="4"
                pb="2"
                alignItems="center"
                borderBottomWidth="1px"
                borderColor="gray.100"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  _hover={{ color: "primaryColor" }}
                  onClick={() => setCurrentStep(2)}
                >
                  ← Back to Guest Details
                </Button>
              </Flex>
            )}

            <Dialog.Body p="0">
              <Box
                overflowY="auto"
                w="full"
                h="auto"
                maxH={["100dvh", "88vh", "90vh"]}
              >
                {currentStep === 1 && (
                  <TicketSelection
                    eventTitle={activeEventData?.eventName}
                    eventDate={activeEventData?.startDate}
                    eventImage={eventImage}
                  />
                )}

                {currentStep === 2 && <AccountSetup />}

                {currentStep === 3 && (
                  <LoginModal
                    callbackUrl={`/share/event/${currentId || activeEventData?.id || ""}`}
                    onLoggedIn={() => {
                      setCurrentStep(2);
                    }}
                  />
                )}

                {currentStep === 4 && (
                  <TicketPurchaseSuccessModal
                    email={createdTicket?.content?.buyer?.email}
                    orderNumber={createdTicket?.content?.orderCode}
                    onClose={handleClose}
                  />
                )}
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default TicketPurchaseModal;
