export const isDateInPast = (date: string | number | Date): boolean => { 
    return new Date(date) > new Date();
}; 