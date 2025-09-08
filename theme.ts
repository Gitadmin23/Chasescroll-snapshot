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
                error: {
                    value: 'red'
                },
                primaryColor: {
                    value: COLORS.COLORS.chasescrollBlue,
                },
                chasescrollTextGray: {
                    value: COLORS.COLORS.chasescrollTextGray,
                },
                chasescrollYellow: {
                    value: COLORS.COLORS.chasescrollYellow,
                },
                chasescrollRed: {
                    value: COLORS.COLORS.chasescrollRed,
                },
                chasescrollGray: {
                    value: COLORS.COLORS.chasescrollGray,
                },
                chasescrollGrey: {
                    value: COLORS.COLORS.chasescrollGrey,
                },
                chasescrollPurple: {
                    value: COLORS.COLORS.chasescrollPurple,
                },
                chasescrollPalePurple: {
                    value: COLORS.COLORS.chasescrollPalePurple,
                },
                chasescrollTextGrey: {
                    value: COLORS.COLORS.chasescrollTextGrey,
                },
                chasescrollBlue: {
                    value: COLORS.COLORS.chasescrollBlue,
                },
                chasescrollDarkBlue: {
                    value: COLORS.COLORS.chasescrollDarkBlue,
                },
                chasescrollNavyLight: {
                    value: COLORS.COLORS.chasescrollNavyLight,
                },
                chasescrollBgBlue: {
                    value: COLORS.COLORS.chasescrollBgBlue,
                },
                chasescrollWhite: {
                    value: COLORS.COLORS.chasescrollWhite,
                },
                chasescrollLightGrey: {
                    value: COLORS.COLORS.chasescrollLightGrey,
                },
                chasescrollTextGrey2: {
                    value: COLORS.COLORS.chasescrollTextGrey2,
                },
                chasescrollButtonBlue: {
                    value: COLORS.COLORS.chasescrollButtonBlue,
                },
                chasescrollBrown: {
                    value: COLORS.COLORS.chasescrollBrown,
                },
                chasescrollG: {
                    value: COLORS.COLORS.chasescrollG,
                },
                borderColor: {
                    value: COLORS.COLORS.borderColor,
                },
            }
        }
    }
});

const THEME = createSystem(defaultConfig, config);
export default THEME;

// GEN CODE npx @chakra-ui/cli typegen ./theme.ts
