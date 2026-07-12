import { IUser } from "./user"

export interface ICommunity {
    "id": string,
    "createdOn": number,
    "creator": IUser,
    "active": true,
    "joinStatus": string
    "data": {
        "address": string,
        "contactNumber": string,
        "email": string,
        "name": string,
        "password": string,
        "join_setting": string,
        "isPublic": true,
        "memberCount": number,
        "favorites": string,
        "picUrls": string,
        "imgSrc": string,
        "description": string,
        "publicChatAccess": boolean
    },
    "lastModifiedDate": number
}