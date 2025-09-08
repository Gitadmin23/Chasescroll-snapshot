export function cleanup(obj: any) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
            delete obj[propName];
        }
        if (obj[propName] === "location") {
            for (var propName in obj?.location) {
                if (obj?.location[propName] === null || obj?.location[propName] === undefined || obj?.location[propName] === "") {
                    delete obj?.location[propName];
                }
            }
        }
    }
    return obj 
}