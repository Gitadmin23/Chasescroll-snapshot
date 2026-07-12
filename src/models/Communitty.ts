import { IUser } from "./User";

export type ICommunity = {
    active: boolean;
    createdOn: number;
    id: string;
    joinStatus: 'CONNECTED',
    creator: {
        dob: string;
        firstName: string;
        joinStatus: string;
        lastName: string;
        publicProfile: boolean;
        userId: string;
        username: string;
        data: {
            about: {
                value: string;
            },
            city: {
                value: string;
            },
            country: {
                value: string;
            },
            favourites: {
                value: string;
            },
            gender: {
                value: string;
            },
            images: {
                value: string;
            },
            maritalStatus: {
                value: string;
            },
        },
    },
    data: {
        address: string,
        contactNumber: string,
        description: string,
        email: string,
        favorites: string,
        imgSrc: string,
        isPublic: boolean,
        join_settings: 'AUTO',
        memberCount: number,
        name: string,
        password: string,
        picUrls: Array<string>,
    }
    lastModifiedDate: number
}

export type ICommunityRequest = {
    createdBy: IUser;
    createdOn: number;
    group: ICommunity
    id: string;  
    requestType: string
    requested: IUser; 
}

export type ICommunityMember = {
    active: boolean;
    createdOn: number;
    eventFunnel: boolean;
    groupID: string;
    id: string;
    muteCommunity: boolean;
    role: 'USER'|'ADMIN';
    user: IUser,
}
