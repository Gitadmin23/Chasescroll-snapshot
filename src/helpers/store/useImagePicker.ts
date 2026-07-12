import { create } from 'zustand'; 

type State = {
    image: Array<any>  
}


type Action = {
    setImage: (data: State['image']) => void      
}

export const useImage = create<State & Action>((set) => ({
    image: [], 
    setImage: (data) => set(() => ({ image: data })),  
}));