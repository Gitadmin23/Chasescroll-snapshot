export const textLimit = (item: string, limit = 15) => {
    return item?.length > limit ? item?.slice(0, limit) + "..." : item
}