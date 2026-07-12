import { IEventType } from "./event";
import { IUser } from "./user";


export interface ITicket {
    "id": string;
    "createdDate": number;
    "lastModifiedBy": IUser;
    "createdBy": IUser;
    "lastModifiedDate": number;
    "isDeleted": boolean;
    "event": IEventType;
    "expirationDate": number;
    "sale": {
        "id": string;
        "createdDate": number;
        "lastModifiedBy": string;
        "createdBy": string;
        "lastModifiedDate": number;
        "isDeleted": boolean;
        "status": string;
        "data": {
            "additionalProp1":any,
            "additionalProp2":any,
            "additionalProp3":any
        },
        "startDate": number;
        "salesUsed": number;
        "maxSaleCount": number;
        "endDate": number;
        "percentDiscount": number;
        "priceAfterDiscount": number;
        "eventID": string;
        "couponCode": string;
        "ticketType": string;
        "codeRequired": boolean;
    },
    "scanTimeStamp": Array<number>;
    "ticketType": string;
    "boughtPrice": number;
    "price": number;
    "barcodeImage": string;
    "ticketUsed": number;
    "index": number;

}
