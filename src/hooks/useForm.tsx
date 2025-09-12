/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikProvider, useFormik } from 'formik';
import type { JSX } from 'react';

interface IProps {
    defaultValues: Record<string, unknown>;
    validationSchema: unknown;
    onSubmit: (data: any) => void;
}

function useForm({ defaultValues, validationSchema, onSubmit }: IProps) {
    const formik = useFormik({
        initialValues: defaultValues,
        validationSchema: validationSchema,
        onSubmit: (data) => onSubmit(data),
        enableReinitialize: true,
        validateOnMount: true,
        validateOnChange: true
    });

    const { handleSubmit, dirty, errors, setFieldValue, isValid, touched, values, setValues } = formik;

    const renderForm = (children: JSX.Element) => (
        <FormikProvider value={formik}>
            <form onSubmit={handleSubmit} style={{ width: '100%', height: "100%" }}>
                {children}
            </form>
        </FormikProvider>
    )
    return {
        renderForm,
        dirty,
        errors,
        setFieldValue,
        isValid,
        touched,
        values,
        setValues
    }
}

export default useForm
