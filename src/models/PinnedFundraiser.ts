import { IDonationList } from "./donation";
import { IUser } from "./User";

export interface IPinnedFundrasier {
    id: string;
    createdDate: number;
    lastModifiedBy: string;
    createdBy: string;
    isDeleted: boolean;
    status: any;
    returnMessage: string;
    user: IUser;
    fundRaiser: IDonationList;
}