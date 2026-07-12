import { useColorModeValue } from "@/components/ui/color-mode";

export default function useCustomTheme() {
    const mainBackgroundColor = useColorModeValue( 'white', '#18191A');
    const secondaryBackgroundColor = useColorModeValue('whitesmoke', '#242526');
    const ticketBackgroundColor = useColorModeValue('#CDD3FD', "#013220");
    const primaryColor = useColorModeValue('#5D70F9', '#5D70F9');
    const bodyTextColor = useColorModeValue('grey', 'whitesmoke');
    const headerTextColor = useColorModeValue('black', 'white');
    const inputtextColor = useColorModeValue('black', '#18191A');
    const inputBorderColor = useColorModeValue('#F2F3FB', '#D0D4EB');
    const inputColor = useColorModeValue('whitesmoke', '#F2F3FB');
    const borderColor = useColorModeValue('#D0D4EB', 'grey') 

    return {
        mainBackgroundColor,
        secondaryBackgroundColor,
        primaryColor,
        bodyTextColor,
        headerTextColor,
        inputBorderColor,
        borderColor,
        inputColor,
        inputtextColor,
        ticketBackgroundColor
    }
}