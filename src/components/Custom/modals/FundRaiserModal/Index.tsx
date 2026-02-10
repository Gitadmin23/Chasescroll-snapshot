import { activeEventAtom, activeTicketAtom, canPayAtom, createdTicketAtom, ticketCountAtom, ticketurchaseStepAtom } from '@/states/activeTicket';
import { Dialog, Portal, CloseButton, Box, Text } from '@chakra-ui/react';
import { atom, useAtom, useAtomValue } from 'jotai';
import React from 'react'
import LoginModal from '../TicketPurchaseModal/LoginModal';
import { currentIdAtom } from '@/views/share/Event';
import TicketPurchaseSuccessModal from '../TicketPurchaseModal/TicketPurchaseSuccessModal';
import { STORAGE_KEYS } from '@/utils/StorageKeys';
import FundRaiserAccountSetup from './FundRaiserAccountSetup';
import { activeFundRaiserAtom, donationAmountAtom } from '@/states/activeFundraiser';
import { Check, TickCircle } from 'iconsax-reactjs';
import { formatNumber } from '@/utils/formatNumber';

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

function FundRaiserModal({ isOpen, onClose }: IProps) {

    const [quantity, setQuantity] = useAtom(ticketCountAtom)
    const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);
    const [event, setEvent] = useAtom(activeEventAtom);
    const [activeTicket, setActiveTicket] = useAtom(activeTicketAtom);
    const currentId = useAtomValue(currentIdAtom);
    const createdTicket = useAtomValue(createdTicketAtom);
    const [activeFundRaider, setActiveFundRaiser] = useAtom(activeFundRaiserAtom);
    const [amount, setAmount] = useAtom(donationAmountAtom);
    const [canPay, setCanPay] = useAtom(canPayAtom);

    React.useEffect(() => {
        setActiveFundRaiser(() => {
            const data = localStorage.getItem(STORAGE_KEYS.DONATION_DETAILS);
            if (data) {
                return JSON.parse(data);
            } else {
                return null;
            }
        });

        setAmount(() => {
            const data = localStorage.getItem(STORAGE_KEYS.DONATION_AMOUNT);
            if (data) {
                return Number(data);
            } else {
                return 0;
            }
        })
    }, [])

    return (
        <Dialog.Root lazyMount open={isOpen} onOpenChange={() => {
            setCurrentStep(1);
            setActiveFundRaiser(null)
            setAmount(0)
            setCanPay(false);
            localStorage.clear()
            onClose();
        }} size={currentStep === 3 ? 'sm' : 'xl'} placement={'center'} closeOnEscape={false} closeOnInteractOutside={false} modal={false}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content w={currentStep === 2 ? "fit" : "full"} borderRadius={'16px'} bgColor="white" p="0">
                        <Dialog.Body p="0px">
                            {currentStep === 1 && (
                                <FundRaiserAccountSetup />
                            )}
                            {currentStep === 2 && (
                                <LoginModal
                                    callbackUrl={`/share/fundraiser/${currentId}`}
                                    onLoggedIn={() => {
                                        setCurrentStep(1);
                                    }} />
                            )}
                            {currentStep === 3 && (
                                <Box
                                    w="full"
                                    p={8}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    gap={6}
                                    bgColor="white"
                                    borderRadius={'20px'}
                                >
                                    <Box
                                        w={20}
                                        h={20}
                                        borderRadius="full"
                                        bg="green.100"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <TickCircle color="green" variant='Outline' size={'25px'} />
                                    </Box>

                                    <Text
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color="gray.800"
                                        textAlign="center"
                                    >
                                        Donation Successful!
                                    </Text>

                                    <Text
                                        color="gray.600"
                                        textAlign="center"
                                    >
                                        Thank you for your generous contribution. Your donation will make a difference!
                                    </Text>

                                    <Box
                                        mt={4}
                                        p={4}
                                        bg="gray.50"
                                        borderRadius="md"
                                        w="full"
                                        textAlign="center"
                                    >
                                        <Text color="gray.600" fontSize="sm">
                                            Amount Donated
                                        </Text>
                                        <Text
                                            fontSize="xl"
                                            fontWeight="bold"
                                            color="gray.800"
                                            mt="10px"
                                        >
                                            {formatNumber(amount)}
                                        </Text>
                                    </Box>
                                </Box>
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

export default FundRaiserModal;
