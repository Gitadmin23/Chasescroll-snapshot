import { IUser } from "./User";

export interface IBuisness {
    id: string;
    createdBy: IUser;
    lastModifiedBy: IUser;
    createdDate: number;
    isDeleted: boolean;
    status: string;
    statusCode: number;
    userID: string;
    email: string;
    phone: string;
    businessName: string;
    description: string;
    address: string;
    isOnline: boolean;
    bannerImage: string;
    website: string;
    isRegistered: boolean;
    CACDocument: string;
    socialMediaHandles: Array<ISocialMediaHandles>;
    openingHours: Array<{
        "startTime": number,
        "endTime": number,
        "availabilityDayOfWeek": number
    }>;
}

export interface ISocialMediaHandles {
    details: string;
    platform: string;
    socialMediaHandle: string;
}