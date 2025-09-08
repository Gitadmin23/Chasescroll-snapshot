import { IEventType } from "./Event";
import { IUser } from "./User";

export interface IPurchaseTicket {
  expirationDate: number | string;
  sale: string;
  ticketType: string;
  boughtPrice: number;
  price: number;
  barcodeImage: string;
  ticketUsed: number;
  index: number;
  scanTimeStamp: string | number;
  lastModifiedDate: number;
  isDeleted: boolean;
  createdBy: IUser;
  lastModifiedBy: IUser;
  id: string;
  createdDate: number;
  event: IEventType;
}
