import { activeEventAtom, activeTicketAtom, canPayAtom, createdTicketAtom, ticketCountAtom, ticketurchaseStepAtom } from '@/states/activeTicket';
import { Dialog, Portal, CloseButton, Box, Text } from '@chakra-ui/react';
import { atom, useAtom, useAtomValue } from 'jotai';
import React from 'react'
import LoginModal from '../TicketPurchaseModal/LoginModal';
import { currentIdAtom } from '@/views/share/Event';
import { activeFundRaiserAtom, donationAmountAtom } from '@/states/activeFundraiser';
import { TickCircle } from 'iconsax-reactjs';
import { formatNumber } from '@/utils/formatNumber';
import FundRaiserAccountSetup from './FundRaiserAccountSetup';
import { IDonationList } from '@/models/donation';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'EVENT' | 'FUNDRAISER' | 'PRODUCT';
    event?: IDonationList | null;
}

function FundRaiserModal({ isOpen, onClose, event }: IProps) {
    const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);
    const currentId = useAtomValue(currentIdAtom);
    const [, setActiveFundRaiser] = useAtom(activeFundRaiserAtom);
    const [amount] = useAtom(donationAmountAtom);
    const [, setCanPay] = useAtom(canPayAtom);

    React.useEffect(() => {
        if (event) {
            setActiveFundRaiser(event);
        }
    }, [event, setActiveFundRaiser]);

    return (
        <Dialog.Root
            lazyMount
            open={isOpen}
            onOpenChange={() => {
                setCurrentStep(1);
                setCanPay(false);
                onClose();
            }}
            size={currentStep === 3 ? 'sm' : 'xl'}
            placement={'center'}
            closeOnEscape={false}
            closeOnInteractOutside={false}
            modal={false}
        >
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
                                    }}
                                />
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
                                            NGN {formatNumber(amount)}
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
    );
}

export default FundRaiserModal;
