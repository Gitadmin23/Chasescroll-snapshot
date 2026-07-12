
export interface IUser {
    "userId": string,
    "firstName": string,
    "lastName": string,
    "showEmail": any,
    "username": string,
    "email": string,
    "active": boolean,
    "dob": any,
    "publicProfile": boolean,
    "joinStatus": string,
    "data": {
        "mobilePhone": {
            "objectPublic": boolean,
            "value": string
        },
        "country": {
            "objectPublic": boolean,
            "value": string
        },
        "imgMain": {
            "objectPublic": boolean,
            "value": string
        },
        "images": {
            "objectPublic": boolean,
            "value": string
        },
        "gender": {
            "objectPublic": boolean,
            "value": string
        },
        "city": {
            "objectPublic": boolean,
            "value": string
        },
        "webAddress": {
            "objectPublic": boolean,
            "value": string
        },
        "work": {
            "objectPublic": boolean,
            "value": string
        },
        "about": {
            "objectPublic": boolean,
            "value": string
        },
        "state": {
            "objectPublic": boolean,
            "value": string
        },
        "userSchool": {
            "objectPublic": boolean,
            "value": string
        },
        "maritalStatus": {
            "objectPublic": boolean,
            "value": string
        },
        "favorites": {
            "objectPublic": boolean,
            "value": string
        }
    },
    "mutualFriends": number
}

