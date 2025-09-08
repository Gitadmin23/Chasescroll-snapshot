import { ITicket } from "./Ticket";

export interface IEventAnalysis {
    totalActiveSales: number;
    totalPendingSales: number;
    totalRefunds: number;
    totalDonated: number;
    qtyPendingSold: number;
    qtyActiveSold: number;
    qtyRefunded: number;
    qtyDonated: number;
    totalNumberOfTickets: number;
    totalNumberOfAvailableTickets: number;
    tickets: ITicket[];
    currency: string;
}