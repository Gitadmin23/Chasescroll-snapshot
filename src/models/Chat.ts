import { IUser } from "./User";

export type Chat = {
    id: string;
    image: string;
    isDeleted: boolean;
    lastMessage: string;
    lastMessageMedia: string;
    lastMessagType: string;
    lastMessageUpdate: number;
    lastModifiedBy: IUser;
    lastModifiedDate: number;
    createdBy: IUser;
    name: string;
    otherUser: IUser;
    type: 'GROUP' | 'ONE_TO_ONE',
    typeID: string
}


export type ChatMember = {
    id: string;
    createdDate: number;
    lasModiFiedBy: IUser;
    createdBy: IUser;
    lastModifiedDate: number;
    isDeleted: boolean;
    chatID: string;
    user: IUser;
    permissionList: Array<PERMISSION>;
    role: ROLE;
    lastUpdated: number;
    lastTyping: number;
}

type PERMISSION = 'PSOT_MESSAGE' | 'POST_MEDIA' | 'REACT' | 'REMOVE_MESSAGE' | 'ADD_ROLE' | 'ADD_MEMBER' | 'ADMIN' | 'CREATOR'
type ROLE = 'ADMIN' | 'CREATOR' | 'MODERATOR' | 'USER' | 'TIME_OUT'



