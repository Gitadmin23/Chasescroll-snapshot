import { IBuisness } from './Business';
import { IService } from './Service';
import { IUser } from './User';

export type IBooking = {
    id: string;
    createdDate: 0;
    lastModifiedBy: IUser;
    createdBy: IUser;
    lastModifiedDate: number;
    vendor: IBuisness;
    user: IUser;
    businessOwner: IUser;
    service: IService;
    bookingStatus: 'PENDING' | 'IN_PROGRESS' | 'AWAITING_CONFIRMATION' | 'COMPLETED' | 'COMPLETED_WITH_ISSUES' | 'APPROVED' | 'REJECTED' | 'CANCELLED',
    description: string;
    price: number;
    isCompleted: boolean;
    hasPaid: boolean;
    date: {
        "year": number,
        "dayOfMonth": number,
        "dayOfWeek": number,
        "dayOfYear": number,
        "era": number,
        "centuryOfEra": number,
        "yearOfEra": number,
        "yearOfCentury": number,
        "weekyear": number,
        "monthOfYear": number,
        "weekOfWeekyear": number,
        "hourOfDay": number,
        "minuteOfHour": number,
        "secondOfMinute": number,
        "millisOfSecond": number,
        "millisOfDay": number,
        "secondOfDay": number,
        "minuteOfDay": number,
        "chronology": {
            "zone": {
                "fixed": boolean,
                "id": string
            }
        },
        "zone": {
            "fixed": boolean,
            "id": string
        },
        "millis": number,
        "afterNow": boolean,
        "beforeNow": boolean,
        "equalNow": boolean
    }
}