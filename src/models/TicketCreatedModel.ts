import { IEventType } from "./Event";
import { IUser } from "./User";

export interface ITicketCreatedModel {
    updated: boolean;
    message: string;
    content: {
        orderCode: string;
        orderId: string;
        buyer: IUser;
        seller: IUser;
        email: string;
        orderTotal: number;
        orderType: 'EVENT_TICKET';
        tickets: Array<{
            id: string;
            createdDate: number;
            lastModifiedBy: IUser;
            createdBy: IUser;
            isDeleted: boolean;
            event: IEventType;
        }>;
        expirationDate: number | null;
        sale: null;
        ticketType: string;
        boughtPrice: number;
        price: number;
        barcodeImage: string;
        ticketUsed: number;
        index: number;
    }
}