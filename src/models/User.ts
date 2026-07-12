export type IUser = {
    dob: string;
    firstName: string
    joinStatus: string;
    lastName: string;
    publicProfile: boolean;
    userId: string;
    username: string;
    email: string;
    data: {
        about: {
            value: string;
        },
        city: {
            value: string;
        },
        country: {
            value: string;
        },
        favourites:{
            value: string;
        },
        gender: {
            value: string;
        },
        images:{
            value: string;
        },
        maritalStatus: {
            value: string;
        },
        state: {
            value: string;
        },
        userSchool: {
            value: string;
        },
        webAddress: {
            value: string;
        },
        work: {
            value: string;
        },
        mobilePhone: {
            value: string;
        },
        imgMain: {
            value: string
        }
    }
}

// export { IUser }