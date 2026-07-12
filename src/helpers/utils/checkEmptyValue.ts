

const isEmptyField = (value: any): boolean => {
    return (
        value === '' || // Empty string
        value === null || // Null value
        value === undefined || // Undefined value
        (Array.isArray(value) && value.length === 0) || // Empty array
        (typeof value === 'object' && value !== null && Object.keys(value).length === 0) // Empty object
    );
};

export const findEmptyFields = (obj: any, parentKey = ''): Record<string, any> => {
    let emptyFields: Record<string, any> = {};

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            const fieldName = parentKey ? `${parentKey}.${key}` : key;

            if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                // Recursive call for nested objects
                const nestedEmptyFields = findEmptyFields(value, fieldName);
                emptyFields = { ...emptyFields, ...nestedEmptyFields };
            } else if (isEmptyField(value)) {
                emptyFields[fieldName] = value;
            }
        }
    }

    return emptyFields;
};
