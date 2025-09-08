import type { IUser } from "./user"

export interface IBusiness {
    "id": string,
    "createdDate": number,
    "lastModifiedDate": number,
    "isDeleted": boolean,
    "name": string,
    "category": string,
    "openingHours": any,
    "images": Array<
        string
    >,
    "price": string,
    "hasFixedPrice": boolean,
    "discount": number,
    "description": string,
    "rating": number,
    "vendor": IUser,
    "totalBooking": 0,
    "isOnline": boolean,
    "address": any,
    "email": string,
    "phone": string,
    "socialMediaHandles": Array<any>,
    "website": string,
    "location": {
        "link": any,
        "address": any,
        "country": any,
        "street": any,
        "city": any,
        "zipcode": any,
        "state": string,
        "locationDetails": any,
        "latlng": any,
        "placeIds": any,
        "toBeAnnounced": any
    },
    "state": string,
    "hasBought": boolean,
    "hasReviewed": boolean
}

export interface IPinned {
    pinnedItemType: "EVENT",
    typeId: string,
    productId: string
}

interface IAddress {
    "id": string,
    "createdDate": number,
    "lastModifiedBy": any,
    "createdBy": any,
    "lastModifiedDate": number,
    "isDeleted": boolean,
    "status": any,
    "statusCode": number,
    "returnMessage": string,
    "state": string,
    "lga": string,
    "phone": string,
    "landmark": string,
    "isDefault": boolean,
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
}

export interface IDate {
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

export interface IProduct {
    "id": string,
    "createdDate": number,
    "lastModifiedBy": any,
    "createdBy": IUser,
    "lastModifiedDate": number,
    "isDeleted": boolean,
    "status": any,
    "statusCode": number,
    "returnMessage": string,
    "creator": IUser,
    "name": string,
    "description": string,
    "category": string,
    "images": Array<string>,
    "price": number,
    "quantity": number,
    "outOfStock": boolean,
    "hasDiscount": boolean,
    "discountPrice": number,
    "published": boolean,
    color: Array<{
        label: string,
        color: string
    }>,
    size: Array<string>,
    hasBought: false;
    hasReviewed: false;
    rating: number
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
}

export interface IRental {
    "id": string,
    "createdDate": number,
    "lastModifiedBy": any,
    "createdBy": any,
    "lastModifiedDate": number,
    "isDeleted": boolean,
    "status": any,
    "statusCode": number,
    "returnMessage": string,
    "creator": IUser,
    "name": string,
    "description": string,
    hasBought: false;
    hasReviewed: false;
    "category": string,
    rating: number
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
    "maximiumNumberOfDays": number,
    "price": number,
    "images": Array<string>,
    "address": any;
    frequency: string
}

export interface ITag {
    "category": string,
    "description": string,
    "type": "RENTAL" | "SERVICE"
}

export interface IOrder {
    "id": string,
    "createdDate": number,
    "lastModifiedBy": any,
    "createdBy": any,
    "lastModifiedDate": number,
    "isDeleted": boolean,
    "status": any,
    "statusCode": number,
    "returnMessage": string,
    "product": IProduct,
    "user": IUser,
    "vendor": IUser,
    "paymentStatus": string,
    "quantity": number,
    "total": number,
    "orderStatus": string,
    hasReceived: boolean,
    "address": {
        "id": string,
        "createdDate": number,
        "lastModifiedBy": any,
        "createdBy": any,
        "lastModifiedDate": number,
        "isDeleted": boolean,
        "status": any,
        "statusCode": number,
        "returnMessage": string,
        "state": string,
        "lga": string,
        "phone": string,
        "landmark": string,
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
        "isDefault": boolean
    }
}

export interface IReceipt {
    "id": string,
    "approvalStatus": string
    "createdDate": number,
    "lastModifiedBy": IUser,
    "createdBy": IUser,
    "lastModifiedDate": number,
    "isDeleted": boolean,
    "status": any,
    "statusCode": number,
    "returnMessage": string,
    "userID": IUser,
    "rental": IRental,
    "startDate": IDate,
    "endDate": IDate,
    "price": number,
    "hasPaid": any,
    "address": IAddress,
    hasReceived: boolean,
    frequency: any
    vendor: IUser
}

export interface IReview {
    "id": any,
    "createdDate": number,
    "lastModifiedBy": any,
    "createdBy": any,
    "lastModifiedDate": number,
    "isDeleted": boolean,
    "status": any,
    "statusCode": number,
    "returnMessage": string,
    "user": IUser
    "description": string,
    "rating": number,
    "reviewType": string
}

export interface IBuisness {
    id: string;
    createdBy: IUser;
    lastModifiedBy: IUser;
    createdDate: number;
    isDeleted: boolean;
    status: string;
    statusCode: number;
    userID: string;
    email: string;
    phone: string;
    businessName: string;
    description: string;
    address: string;
    isOnline: boolean;
    bannerImage: string;
    website: string;
    isRegistered: boolean;
    CACDocument: string;
    socialMediaHandles: Array<ISocialMediaHandles>;
    openingHours: Array<{
        "startTime": number,
        "endTime": number,
        "availabilityDayOfWeek": number
    }>;
}

export interface ISocialMediaHandles {
    details: string;
    platform: string;
    socialMediaHandle: string;
}

export interface IServiceCategory {
    category: string;
    id: string;
}

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
    hasBought: false;
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

