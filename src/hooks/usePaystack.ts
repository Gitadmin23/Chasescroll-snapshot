import { atom, useSetAtom } from 'jotai';

const PAYSTACK_KEY: any = process.env.NEXT_PUBLIC_PAYSTACK_KEY;

export const payStackAtom = atom<{
    message: message,
    dataID: string,
    amount: number,
    configPaystack: {
        email: string,
        amount: number,
        reference: string,
        publicKey: string,
    },

}>({
    message: {
        donation: false,
        booking: false,
        product: false,
        rental: false,
        service: false,
        event: false
    },
    dataID: "",
    amount: 0,
    configPaystack: {
        email: "",
        amount: 0,
        reference: "",
        publicKey: PAYSTACK_KEY,
    }
})

interface message {
    donation: boolean,
    booking: boolean,
    product: boolean,
    rental: boolean,
    service: boolean,
    event: boolean
}

type State = {
    configPaystack: any,
    dataID: string,
    message: message,
    amount: number,
} 