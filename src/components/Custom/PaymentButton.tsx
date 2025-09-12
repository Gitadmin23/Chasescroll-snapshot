import { ticketurchaseStepAtom } from '@/states/activeTicket';
import { Button } from '@chakra-ui/react';
import React from 'react'
import { usePaystackPayment } from 'react-paystack';
import { useAtom } from 'jotai'

interface IProps {
    reference: string;
    email: string;
    amount: number;
    bgColor?: string;
    textColor?: string;
    text: string;
    onSucces?: (item?: string) => void;
    isLoading?: boolean
}

function PaymentButton({ reference, email, amount, bgColor = 'green', textColor = 'white', text, onSucces, isLoading = false }: IProps) {
    const config = {
        reference,
        amount,
        email,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || 'pk_test_58a8e726bbe3cce8ade3082f4e49f46089046b5d',
    }

    const initializePayment = usePaystackPayment(config);
    const [currentStep, setCurrentStep] = useAtom(ticketurchaseStepAtom);

    const handlePayment = React.useCallback(() => {

        const onSuccess = (reference: string) => {
            if (onSucces) {
                onSucces(reference)

            } else {
                setCurrentStep(4)
            }
            // Implementation for whatever you want to do with reference and after success call.
            console.log(`PAYSTACK REFRENCE`, reference);
        };
        // you can call this function anything
        const onClose = () => {
            // implementation for  whatever you want to do when the Paystack dialog closed.
            console.log('closed')
        }
        console.log(config);
        if (config.amount > 0) {
            initializePayment({
                onSuccess,
                onClose
            })
        } else {

        }

    }, [config, email, reference, amount])
    return (
        <Button w="full" maxW={"200px"}  h="px" fontWeight={"semibold"} fontSize={"14px"} borderRadius={'full'} onClick={handlePayment} bgColor={bgColor} color={textColor} loading={isLoading}>
            {text}
        </Button>
    )
}

export default PaymentButton
