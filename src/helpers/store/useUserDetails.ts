import { create } from 'zustand';
import { IUser } from '../models/user';

type UserState = {
    userId: string;
    firstName: string;
    lastName: string;
    publicProfile: string;
    username: string;
    email: string;
    dob: string;
    user: IUser|null,
    setAll: (data: Partial<UserState>) => void       
}

export const useDetails = create<UserState>((set) => ({
    userId: '',
    firstName: '',
    lastName: '',
    publicProfile: '',
    username: '',
    email: '',
    dob: '',
    user: null,
    setAll: (data) => set((state) => ({ ...state, ...data }))
}));