export function capitalizeFLetter(item: any) {
    return item?.charAt(0).toUpperCase() + item?.slice(1).toLowerCase()
}