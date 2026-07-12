import { IDonationList } from "@/models/donation";
import { atom } from "jotai";

export const activeFundRaiserAtom = atom<IDonationList | null>(null);
export const donationAmountAtom = atom(0);