import type { IUser } from "./user"

export interface IEventType {
    id: string,
    createdDate?: string,
    lastModifiedBy: IUser;
    createdBy: IUser;
    lastModifiedDate?: number;
    isDeleted: boolean;
    picUrls: string[],
    eventMemberRole: string;
    eventName: string;
    joinSetting: string;
    eventDescription: string;
    eventType: string;
    locationType: string;
    currency: string;
    currentPicUrl: string;
    eventFunnelGroupID: string;
    mediaType: string;
    currentVideoUrl: string;
    isPublic: boolean;
    isExclusive: boolean;
    mask: boolean;
    isOrganizer: boolean;
    attendeesVisibility: boolean;
    isJoined: boolean;
    isSaved: boolean;
    isFree: boolean;
    isBought: boolean;
    ticketBought: boolean;
    externalEvent: string;
    minPrice: any;
    maxPrice: any;
    startTime: any;
    endTime: any;
    startDate: any;
    endDate: any;
    expirationDate: string;
    memberCount: number;
    location: {
        toBeAnnounced: boolean
        locationDetails?: string,
        link?: string,
        links?: Array<string>,
        address?: string,
        latlng?: string,
        placeIds?: string
    },
    productTypeData: IProductTypeData[],
    interestedUsers: IUser[],
    collaborators: IUser[]
    admins: IUser[];
    acceptedAdmins: IUser[]
    acceptedCollaborators: IUser[]
    donationName: string,
    donationTargetAmount: string,
    donationEnabled: boolean,
    totalDonated: string,
    prStatus: string,
    affiliateID: string,
    affiliates: Array<{
        "affiliateType": string,
        "percent": number
    }>
}

export interface IProductTypeData {
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
