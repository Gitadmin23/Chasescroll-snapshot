import { Text, TextProps } from '@chakra-ui/react';

interface IProps {
    type: 'HEADER' | 'MEDIUM' | 'REGULAR' | 'LIGHT';
    text: string;
    fontSize?: string;
    color?: string;
    width?: string;
}

function CustomText({ type, fontSize = '16px', color = 'grey', text, width = ' 100%', ...rest }: IProps & TextProps) {
    return (
        <>
            {type === 'HEADER' && <Text color={color} fontSize={fontSize} fontFamily={'Raleway-Bold'} width={width} {...rest}>{text}</Text>}
            {type === 'MEDIUM' && <Text color={color} fontSize={fontSize} fontFamily={'Raleway-Medium'} width={width}>{text}</Text>}
            {type === 'REGULAR' && <Text color={color} fontSize={fontSize} fontFamily={'Raleway-Regular'} width={width}>{text}</Text>}
            {type === 'LIGHT' && <Text color={color} fontSize={fontSize} fontFamily={'Raleway-Light'} width={width}>{text}</Text>}
        </>
    )
}

export default CustomText
