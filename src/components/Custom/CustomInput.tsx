/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import CustomText from './CustomText'
import { useFormikContext } from 'formik';
import { Eye, EyeSlash } from 'iconsax-reactjs';
import { Flex, Input, InputGroup } from '@chakra-ui/react'

interface IProps {
    name: string;
    label: string;
    isPassword?: boolean;
    type?: 'text' | 'number' | 'email';
}

function CustomInput({ name, label, isPassword = false, type = 'text' }: IProps) {
    const [isActive, setIsActive] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false);
    const { handleBlur, handleChange, errors, touched, values } = useFormikContext<any>();

    React.useEffect(() => {
        console.log(errors);
    }, [errors])

    // colors
    return (
        <Flex w={"full"} flexDir={"column"} gap={"1"} >
            <CustomText type='REGULAR' fontSize='14' text={label} color="black" />
            <div className='relative w-full'>
                <InputGroup endElement={isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 mt-1"
                        style={{ zIndex: 10 }}
                    >
                        {showPassword ? <EyeSlash size="20" color="#666" /> : <Eye size="20" color="#666" />}
                    </button>
                )}>
                    <Input
                        type={isPassword ? showPassword ? 'text' : 'password' : 'text'}
                        name={name}
                        id={name}
                        value={values[name] || ''}
                        onChange={(e) => {
                            if (type === 'text') {
                                // Remove numbers, spaces and special characters for text type
                                const value = e.target.value.replace(/[^a-zA-Z]/g, '');
                                e.target.value = value;
                            }
                            if (type === 'number') {
                                // Only allow numbers
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                e.target.value = value;
                            }
                            handleChange(e);
                        }}
                        onBlur={(e) => {
                            setIsActive(false);
                            handleBlur(e);
                        }}
                        width='full'
                        height={'45px'}
                        color="black"
                        borderWidth='2px'
                        borderColor={errors[name] && touched[name] ? "red.300" : "#E5E5E5"}
                        bgColor="#F5F5F5"
                        borderRadius={"full"} 
                        onClick={() => setIsActive(true)}
                        pr={isPassword ? "50px" : "16px"}

                    />
                </InputGroup>
            </div>
            {errors[name] && touched[name] && (
                <CustomText type="REGULAR" mt={"-1"} fontSize='12px' text={errors[name as string] as string} color="red" />
            )}
        </Flex>
    )
}

export default CustomInput
