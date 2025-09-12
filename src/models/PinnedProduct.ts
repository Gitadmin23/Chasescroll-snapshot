import { IProduct } from "./product";

export interface IPinnedProduct {
    id: string;
    createdDate: number;
    lastModifiedBy: string;
    createdBy: string;
    isDeleted: boolean;
    status: any;
    returnMessage: string;
    typeId: string;
    pinnedItemTyppe: string;
    returnProductDto: IProduct;
}