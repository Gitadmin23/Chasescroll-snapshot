import { IUser } from "./User";

export type INotification = {
    id: string;
    createdDate: number;
    lastModifiedBy: IUser;
    createdBy: IUser;
    lastModifiedDate: number;
    title: string;
    message: string;
    recieverID: IUser;
    typeID: string;
    type: 'EVENT' | 'GROUP' | 'CHAT' | 'FEED' | 'GROUP_REQUEST' | 'GROUP_REQUEST_ACCEPTED' | 'FRIEND_REQUEST' | 'FRIEND_REQUEST_ACCEPTED' | 'FEED_COMMENT_LIKE' | 'FEED_COMMENT' | 'FEED_LIKE' | 'ADMIN_MEMBER_INVITE_REQUEST' | 'COLLABORATOR_MEMBER_INVITE_REQUEST' | "COLLABORATOR_MEMBER_INVITE_ACCEPTED" | 
    "ADMIN_MEMBER_INVITE_ACCEPTED" | "EVENT_ROLE_UPDATE" | "DONATION_COLLABORATOR_REQUEST" | "EVENT_PR_REQUEST" | "SERVICE_REQUEST" | "RENTAL_REQUEST";
    status: 'READ' | 'UNREAD';
}