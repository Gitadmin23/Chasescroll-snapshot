import {
  activeEventAtom,
  activeTicketAtom,
  createdTicketAtom,
  selectedTicketsAtom,
  ticketCountAtom,
  ticketurchaseStepAtom,
} from "@/states/activeTicket";
import {
  Dialog,
  HStack,
  Portal,
  CloseButton,
  Box,
  Flex,
} from "@chakra-ui/react";
import { atom, useAtom, useAtomValue } from "jotai";
import React from "react";
import { RESOURCE_URL } from "@/constants";

import TicketSelection from "./TicketSelection";
import AccountSetup from "./AccountSetup";
import LoginModal from "./LoginModal";
import { currentIdAtom } from "@/views/share/Event";
import TicketPurchaseSuccessModal from "./TicketPurchaseSuccessModal";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { useSession } from "next-auth/react"; 

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  type: "EVENT" | "FUNDRAISER" | "PRODUCT";
}

function TicketPurchaseModal({ isOpen, onClose }: IProps) {
  const [quantity, setQuantity] = useAtom(ticketCountAtom);
  const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);
  const [event, setEvent] = useAtom(activeEventAtom);
  const [activeTicket, setActiveTicket] = useAtom(activeTicketAtom);
  const currentId = useAtomValue(currentIdAtom);
  const createdTicket = useAtomValue(createdTicketAtom);
  const [selectedTickets, setSelectedTickets] = useAtom(selectedTicketsAtom);
  const { update, data } = useSession();

  React.useEffect(() => {
    setQuantity(() => {
      const quantity = localStorage.getItem(STORAGE_KEYS.TICKET_COUNT);
      return quantity ? Number(quantity) : 1;
    });

    setEvent(() => {
      const event = localStorage.getItem(STORAGE_KEYS.EVENT_DETAILS);
      return event ? JSON.parse(event) : null;
    });

    setActiveTicket(() => {
      const ticket = localStorage.getItem(STORAGE_KEYS.ACTIVE_TICKET);
      return ticket ? JSON.parse(ticket) : null;
    });

    setSelectedTickets(() => {
      const ticket = localStorage.getItem(STORAGE_KEYS.SELECTED_TICKETS);
      return ticket ? JSON.parse(ticket) : null;
    });
  }, []);

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={() => {
        setCurrentStep(1);
        setQuantity(1);
        setSelectedTickets([]);
        localStorage.clear();
        // sessionStorage.clear();
        // signOut()
        localStorage.removeItem(STORAGE_KEYS.SELECTED_TICKETS);
        onClose();
      }}
      size={currentStep === 3 ? "sm" : ["full", "xl", "xl"]}
      placement={"center"}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      modal={false}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner p={"2"}>
          <Dialog.Content
            borderRadius={"16px"}
            minH={["fit-content", "fit-content", "fit-content"]}
            bgColor="white"
            p="0"
          >
            <Dialog.Body p="0px">
              <Box overflowY={"auto"} w="full" h={"auto"}>
                {currentStep === 1 && (
                  <TicketSelection
                    eventTitle={event?.eventName}
                    eventDate={event?.startDate}
                    eventImage={`${RESOURCE_URL}/${event?.currentPicUrl}`}
                  />
                )}
                {currentStep === 2 && <AccountSetup />}
                {currentStep === 3 && (
                  <LoginModal
                    callbackUrl={`/share/event/${currentId}`}
                    onLoggedIn={() => {
                      setCurrentStep(2);
                    }}
                  />
                )}
                {currentStep === 4 && (
                  <TicketPurchaseSuccessModal
                    email={createdTicket?.content?.buyer?.email}
                    orderNumber={createdTicket?.content?.orderCode}
                    onClose={() => {
                      localStorage.clear();
                      setCurrentStep(1);
                      setQuantity(1);
                      setEvent({} as any);
                      setActiveTicket(null);
                      onClose();
                    }}
                  />
                )}
              </Box>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton bg="gray.100" color={"gray.700"} size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default TicketPurchaseModal;
