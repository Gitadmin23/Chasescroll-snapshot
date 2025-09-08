/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, InputGroup, VStack, NativeSelect } from '@chakra-ui/react'
import React from 'react'
import CustomText from './CustomText'
import { useFormikContext } from 'formik';

interface IProps {
    name: string;
    label: string;
    isPassword?: boolean;
    options: string[];
}

function CustomSelect({ name, label, options = [] }: IProps) {
    const [isActive, setIsActive] = React.useState(false)
    const { handleBlur, handleChange, errors, touched } = useFormikContext<any>();

    // colors
    return (
        <VStack width={'full'} spaceY={2}>
            <CustomText type='REGULAR' fontSize='14' text={label} color="black" />
            <NativeSelect.Root size={"lg"} >
                <NativeSelect.Field
                    name={name}
                    id={name}
                    onChange={handleChange}
                    onBlur={(e) => {
                        setIsActive(false);
                        handleBlur(e);
                    }}
                    width='100%'
                    height={'60px'}
                    borderRadius={'8px'}
                    backgroundColor={'inputBackgroundColor'}
                    borderWidth={'1px'}
                    borderColor={isActive ? 'primaryColor' : 'borderColor'}
                    color="black"
                    onClick={() => setIsActive(true)}
                >
                    {options.map((item) => (
                        <option value={item} key={item}>{item.replace('_', " ")}</option>
                    ))}
                </NativeSelect.Field>
            </NativeSelect.Root>
            {errors[name] && touched[name] && (
                <CustomText type="REGULAR" text={errors[name as string] as string} color="error" fontSize='12px' />
            )}
        </VStack>
    )
}

export default CustomSelect
