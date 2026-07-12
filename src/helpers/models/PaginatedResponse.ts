export type PaginatedResponse<T> = {
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number,
    size: number,
    totalElements: number | any,
    totalPages: number,
    content: Array<T>;
} 