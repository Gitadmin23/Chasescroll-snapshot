import {
    ChakraProvider,
    createSystem,
    defaultConfig,
    defineConfig,
} from "@chakra-ui/react"

export const COLORS = {
    COLORS: {
        chasescrollTextGray: "#101828",
        chasescrollYellow: "#f29339",
        chasescrollRed: "#F04F4F",
        chasescrollGray: "#B1B5C3",
        chasescrollGrey: "#A3A3A3",
        chasescrollPurple: "#5969BA",
        chasescrollPalePurple: "#D0D4EB",
        chasescrollTextGrey: "#5B5858",
        chasescrollBlue: "#5D70F9",
        chasescrollDarkBlue: "#12299C",
        chasescrollNavyLight: "#D0D4EB",
        chasescrollBgBlue: "#E5EBF4",
        chasescrollWhite: "#FAFAFA",
        chasescrollLightGrey: "#F5F5F5",
        chasescrollTextGrey2: "#667085",
        chasescrollButtonBlue: "#3C41F0",
        chasescrollBrown: "#7A6969",
        chasescrollG: "#98929214",
        borderColor: '#D0D4EB',
    }
}

const config = defineConfig({
    theme: {
        breakpoints: {
            sm: "320px",
            md: "768px",
            lg: "960px",
            xl: "1200px",
        },
        tokens: {
            colors: {
                primaryColor: {
                    value: COLORS.COLORS.chasescrollBlue,
                },

            }
        }
    }
});

const THEME = createSystem(defaultConfig, config);
export default THEME;