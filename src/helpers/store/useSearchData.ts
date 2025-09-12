import { create } from 'zustand';

type State = {
    search: string, 
} 

type Action = {
    setSearchValue: (data: State['search']) => void  
}

const useSearchStore = create<State & Action>((set) => ({
    search: "",  
    setSearchValue: (data) => set(() => ({ search: data })), 
}));



export default useSearchStore