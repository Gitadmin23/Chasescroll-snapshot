import { create } from 'zustand';
import { IDonation } from '../models/fundraising';

type State = {
    data: Array<IDonation | any>
    image: Array<any>
}

type Action = {
    updateDontion: (data: State['data']) => void
    updateImage: (data: State['image']) => void
}

const user_id = localStorage.getItem("user_id") + ""

const useDonationStore = create<State & Action>((set) => ({
    data: [{
        "visibility": "PUBLIC",
        creatorID: user_id,
        name: "",
        bannerImage: "",
        description: "",
        endDate: "",
        goal: "",
        purpose: "",
        collaborators: []
    }],
    image: [],
    updateDontion: (data) => set(() => ({ data: data })),
    updateImage: (data) => set(() => ({ image: data })),
}));



export default useDonationStore