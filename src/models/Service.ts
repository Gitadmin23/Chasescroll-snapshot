import { IBuisness, ISocialMediaHandles } from "./Business";
import { IServiceCategory } from "./ServiceCategory";
import { IUser } from "./User"

export type IService = {
        id: string;
        name: string;
        vendor: IUser;
        service: IServiceCategory;
        price: number;
        hasFixedPrice: boolean;
        discount: number;
        "openingHours": Array<{
                "startTime": number,
                "endTime": number,
                "availabilityDayOfWeek": number
        }>;
        images: Array<string>;
        description: string;
        rating: number;
        vendorID: string;
        category: string;
        email: string
        hasBought :  false;
        hasReviewed: false;
        address: string;
        isOnline: boolean;
        phone: string;
        socialMediaHandles: Array<ISocialMediaHandles>;
        createdDate: number;
        totalBooking: number;
        "location": {
            "link": string,
            "address": string,
            "country": string,
            "street": string,
            "city": string,
            "zipcode": string,
            "state": string,
            "locationDetails": string,
            "latlng": string,
            "placeIds": string,
            "toBeAnnounced": boolean
        },
        "state": string,
}

