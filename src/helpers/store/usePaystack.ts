import { create } from 'zustand';

const PAYSTACK_KEY: any = process.env.NEXT_PUBLIC_PAYSTACK_KEY;

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

type Action = {
    setPaystackConfig: (data: State['configPaystack']) => void  
    setDataID: (data: State['dataID']) => void  
    setMessage: (data: State['message']) => void    
    setAmount: (data: State['amount']) => void     
}

const usePaystackStore = create<State & Action>((set) => ({
    configPaystack: {
        email: "",
        amount: 0,
        reference: "",
        publicKey: PAYSTACK_KEY,
    }, 
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
    setPaystackConfig: (data) => set(() => ({ configPaystack: data })), 
    setDataID: (data) => set(() => ({ dataID: data })),  
    setMessage: (data) => set(() => ({ message: data })), 
    setAmount: (data) => set(() => ({ amount: data })), 
}));



export default usePaystackStore