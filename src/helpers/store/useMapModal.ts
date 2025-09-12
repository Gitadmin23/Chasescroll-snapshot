import { create } from 'zustand'; 

type State = {
    open: boolean 
}


type Action = {
    setOpen: (data: State['open']) => void      
}

export const useMapModal = create<State & Action>((set) => ({
    open: false, 
    setOpen: (data) => set(() => ({ open: data })),  
}));