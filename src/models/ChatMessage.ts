import { IUser } from "./User";

export type ChatMessage = {
    chatID: string;
    createdBy: IUser;
    createdDate: number;
    edited: boolean;
    id: string;
    isDeleted: boolean;
    lastModifiedBy: IUser;
    lastModifiedDate: number;
    media: string;
    mediaType: 'PICTURE'|'VIDEO'|'DOCUMENT';
    message: string;
    multipleMedia: string[];
    reactList: any[];
    reacted: boolean;
    read: boolean;
    readList: string[];
    self: boolean;
}