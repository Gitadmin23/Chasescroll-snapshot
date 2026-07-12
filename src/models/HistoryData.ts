export interface IHistoryData {
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
    tickets: Array<IHistoryDataTicket>;
}

export interface IHistoryDataTicket {
    ticketType: string;
    totalNumberOfTickets: number;
    totalNumberOfAvailableTickets: number;
    totalActiveSales: number;
    totalPendingSales: number;
    totalRefunds: number;
    totalDonated: number;
    qtyPendingSold: number;
    qtyActiveSold: number;
    qtyRefunded: number;
} 