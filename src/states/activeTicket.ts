import { IEventTicket, IEventType, IProductTypeData } from '@/models/Event';
import { ISelectedTicket } from '@/models/SelectedTicketsType';
import { ITicketCreatedModel } from '@/models/TicketCreatedModel';
import { atom } from 'jotai';

export const activeTicketAtom = atom<IProductTypeData | null>(null);
export const activeEventAtom = atom<IEventType>({} as IEventType);
export const ticketurchaseStepAtom = atom(1);
export const ticketCountAtom = atom(1);
export const currentUrlAtom = atom<string | null>(null);
export const createdTicketAtom = atom<ITicketCreatedModel | null>(null);
export const canPayAtom = atom<boolean>(false);
export const paystackDetailsAtom = atom<{ email: string, reference: string, amount: number } | null>(null);
export const selectedTicketsAtom = atom<ISelectedTicket[]>([]);
export const totalAmountForSelectedTicketsAtom = atom<number>(0)
export const affiliateIDAtom = atom<string | null>(null);