 
import { create } from 'zustand';
import { IUser } from '../models/user';
import { ITag } from '../models/pr';

type ticket = {
    totalNumberOfTickets: string | number,
    ticketPrice: string | number,
    ticketType: string,
    minTicketBuy: string | number,
    maxTicketBuy: string | number,
    rerouteURL?: string
    ticketsSold?: 0,
    endDate?: string | number,
    endTime?: string | number,
    startDate?: string | number,
    startTime?: string | number
}

export type CreateEvent = {
    id?: string
    picUrls: Array<any>,
    collaborators: Array<any>,
    acceptedAdmins: Array<any>,
    acceptedCollaborators: Array<any>,
    admins: Array<any>,
    eventType: string,
    eventName: string,
    eventDescription: string,
    joinSetting: string,
    locationType: string,
    mediaType?: string,
    currency: string,
    currentPicUrl: string,
    isBought?: boolean
    eventFunnelGroupID: string,
    isPublic: boolean,
    currentVideoUrl?: string,
    isExclusive: boolean,
    mask: boolean,
    attendeesVisibility: boolean,
    minPrice: string,
    maxPrice: string,
    startTime: any,
    endTime: any,
    startDate: any,
    endDate: any,
    location: {
        toBeAnnounced: boolean
        locationDetails?: string,
        link?: string,
        links?: Array<string>,
        address?: string,
        latlng?: string,
        placeIds?: string
    },
    productTypeData: Array<ticket>,
    createdBy?: IUser,
    donationName?: string,
    donationTargetAmount?: string,
    donationEnabled?: boolean,
    affiliates: [
        {
            affiliateType: string,
            percent: number | any
        }
    ]
}

type State = {
    eventdata: CreateEvent,
    service: Array<ITag>,
    rental: Array<ITag>,
    state: string
}

type Image = {
    image: any
}

type Navigate = {
    tab: number
}

type Action = {
    updateEvent: (data: State['eventdata']) => void
    updateService: (data: State['service']) => void
    updateRental: (data: State['rental']) => void
    updateImage: (data: Image['image']) => void
    addState: (data: State['state']) => void
    changeTab: (data: Navigate['tab']) => void
}

const useEventStore = create<State & Image & Navigate & Action>((set) => ({
    data: {
        collaborators: [
        ],
        admins: [
        ],
    },
    state: "",
    rental: [],
    service: [],
    eventdata: {
        picUrls: [
            ""
        ],
        collaborators: [
        ],
        admins: [
        ],
        acceptedAdmins: [],
        acceptedCollaborators: [],
        eventType: "",
        eventName: "",
        eventDescription: "",
        joinSetting: "public",
        locationType: "",
        currency: "NGN",
        currentPicUrl: "",
        eventFunnelGroupID: "",
        isPublic: true,
        isExclusive: false,
        mask: false,
        attendeesVisibility: true,
        minPrice: "",
        maxPrice: "",
        startTime: "",
        endTime: "",
        startDate: "",
        endDate: "",
        // expirationDate:null,
        location: {
            toBeAnnounced: false,
            locationDetails: "",
            link: "",
            links: [""],
            address: "",
            latlng: ""
        },
        productTypeData: [
            // first is always standard
            {
                totalNumberOfTickets: "",
                ticketPrice: "",
                ticketType: "Regular",
                minTicketBuy: "1",
                maxTicketBuy: "",
                rerouteURL: "",
            },
        ],
        "affiliates": [
            {
                "affiliateType": "",
                "percent": null
            }
        ]
    },
    image: null,
    tab: 0,
    updateEvent: (data) => set(() => ({ eventdata: data })),
    updateService: (data) => set(() => ({ service: data })),
    updateRental: (data) => set(() => ({ rental: data })),
    updateImage: (data) => set(() => ({ image: data })),
    addState: (data) => set(() => ({ state: data })),
    changeTab: (data) => set(() => ({ tab: data })),
}));



export default useEventStore