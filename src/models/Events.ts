export interface IEvent {
    id: string;
    eventName: string;
    eventType: string;
    isBought: boolean;
    isDeleted: boolean;
    isExclusive: boolean;
    isJoined: boolean;
    isOrganizer: boolean;
    isPublic: boolean;
    isSaved: boolean;
    location: {
        address: string;
        latlng: string;
        link: string;
        locationDetails: string;
        placeId: string;
    },
    locationType: string;
    maxPrice: string;
    mediaType: string;
    memberCount: number;
    minPrice: number;
    picUrls: Array<string>;
    productTypeData: Array<{
        maxTicketBuy: number;
        minTicketBuy: number;
        sale: number;
        ticketPrice: number;
        ticketType: string;
        ticketSold: number;
        totalNumberOfTickets: number;
    }>;
    startDate: number;
    startTime: number;
    currency: string;
    currentPicUrl: string;
    currentVideoUrl: string;
    endDate: number;
    endTime: number;
    eventDescription: string;
    eventFunnelGroupId: string;
    expirationDate: number;
    interestedUsers: Array<{
        userId: string;
        username: string;
        firstName: string;
        lastName: string;
        dob: string;
        joinStatus: string;
        publicProfile: boolean;
    }>;
}