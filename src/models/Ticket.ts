import { IUser } from "@/models/User";
import { IEventType } from "@/models/Event";

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
            "additionalProp1": {},
            "additionalProp2": {},
            "additionalProp3": {}
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
