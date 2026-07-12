import { PaginatedResponse } from "./PaginatedResponse";
import { IUser } from "./User";

export type IComment = {
    comment: string;
    data: string;
    id: string;
    likeCount: number;
    likeStatus: 'LIKED'|'NOT_LIKED';
    postID: string;
    subComments: {
        content: Array<PaginatedResponse<Subcomment>>,
    },
    time: any;
    timeInMilliseconds: number;
    user: IUser;
}

export type Subcomment = {
    comment: string;
    data: string;
    commentID: string;
    id: string;
    likeCount: number;
    likeStatus: 'LIKED'|'NOT_LIKED';
    postID: string;
    subComments: {
        content: Array<PaginatedResponse<IComment>>,
    },
    time: any;
    timeInMilliseconds: number;
    user: IUser;
}