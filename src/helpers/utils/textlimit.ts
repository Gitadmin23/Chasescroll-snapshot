
export const textLimit = (item:string , limit: number) => {
    return limit === 0 ? item : item?.length > limit ? item?.slice(0, limit)+"..." : item
}