export type IVendor = {
    userID: string;
    email: string;
    phone: string;
    businessName: string;
    description: string;
    locationType: string;
    locationData: {
        link: string;
        address: string;
        country: string;
        street: string;
        city: string;
        zipcode: string;
        state: string;
        locationDetails: string;
        latlng: string;
        placeIds: string;
        toBeAnnounced: boolean
    };
    socialMediaHandles: Array<{
        socialMediaHandle: string;
        platform: string;
        details: string;
    }>;
    serviceList: Array<{
        vendorID?: string;
        eventTypes: string[];
        serviceName: string;
        serviceDescription: string;
        photos: string[];
        availabilityTimes: [
            {
                startTime: number;
                endTime: number;
                availabilityDayOfWeek: number;
            }
        ]
    }>;
}