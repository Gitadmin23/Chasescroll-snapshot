import { activeEventAtom, activeTicketAtom, createdTicketAtom, ticketCountAtom, ticketurchaseStepAtom } from '@/states/activeTicket';
import { Dialog, HStack, Portal, CloseButton } from '@chakra-ui/react';
import { atom, useAtom, useAtomValue } from 'jotai';
import React from 'react'
import { RESOURCE_URL } from '@/constants';

import TicketSelection from './TicketSelection';
import AccountSetup from './AccountSetup';
import LoginModal from './LoginModal';
import { currentIdAtom } from '@/views/share/Event';
import TicketPurchaseSuccessModal from './TicketPurchaseSuccessModal';
import { STORAGE_KEYS } from '@/utils/StorageKeys';

const titles = [
    'Select Tickets',
    'Enter Details',
    'Verify Your Email'
]
interface IProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'EVENT' | 'FUNDRAISER' | 'PRODUCT'
}

function TicketPurchaseModal({ isOpen, onClose }: IProps) {

    const [quantity, setQuantity] = useAtom(ticketCountAtom)
    const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);
    const [event, setEvent] = useAtom(activeEventAtom);
    const [activeTicket, setActiveTicket] = useAtom(activeTicketAtom);
    const currentId = useAtomValue(currentIdAtom);
    const createdTicket = useAtomValue(createdTicketAtom);

    React.useEffect(() => {
        setQuantity(() => {
            const quantity = localStorage.getItem(STORAGE_KEYS.TICKET_COUNT);
            return quantity ? Number(quantity) : 1;
        })

        setEvent(() => {
            const event = localStorage.getItem(STORAGE_KEYS.EVENT_DETAILS);
            return event ? JSON.parse(event) : null;
        })

        setActiveTicket(() => {
            const ticket = localStorage.getItem(STORAGE_KEYS.ACTIVE_TICKET);
            return ticket ? JSON.parse(ticket) : null;
        })
    }, [])

    return (
        <Dialog.Root lazyMount open={isOpen} onOpenChange={() => {
            setCurrentStep(1);
            setQuantity(1);
            localStorage.clear()
            onClose();
        }} size={currentStep === 3 ? 'sm' : 'xl'} placement={'center'} closeOnEscape={false} closeOnInteractOutside={false} modal={false}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content borderRadius={'16px'} bgColor="white" p="0">
                        <Dialog.Body p="0px">
                            {currentStep === 1 && (
                                <TicketSelection eventTitle={event?.eventName} eventDate={event?.startDate} eventImage={`${RESOURCE_URL}/${event?.currentPicUrl}`} />
                            )}
                            {currentStep === 2 && (
                                <AccountSetup />
                            )}
                            {currentStep === 3 && (
                                <LoginModal
                                    callbackUrl={`/share/event?id=${currentId}`}
                                    onLoggedIn={() => {
                                        setCurrentStep(2);
                                    }} />
                            )}
                            {currentStep === 4 && (
                                <TicketPurchaseSuccessModal
                                    email={createdTicket?.content?.buyer?.email}
                                    orderNumber={createdTicket?.content?.orderCode}
                                    onClose={() => {
                                        localStorage.clear();
                                        setCurrentStep(1);
                                        setQuantity(1);
                                        setEvent(null)
                                        setActiveTicket(null);
                                        onClose();
                                    }}
                                />
                            )}
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton bg="black" color={'white'} size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default TicketPurchaseModal
