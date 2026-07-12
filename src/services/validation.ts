import * as Yup from 'yup';

const accountCreationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required')
})

const loginSchema = Yup.object({
    username: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
})

const addressValidationSchema = Yup.object({
    state: Yup.string().required('State is required'),
    lga: Yup.string().required('City is required'),
    address: Yup.string().required('Address is required'),
    phone: Yup.string().required('Phone number is required'),
})

export {
    accountCreationSchema,
    loginSchema,
    addressValidationSchema
}