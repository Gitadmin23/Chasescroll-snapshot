import useCustomTheme from "@/hooks/useTheme";
import { FundraisingIcon } from "@/svg";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { CustomInput } from "../shared";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const { mainBackgroundColor, borderColor, headerTextColor } = useCustomTheme()
    const router = useRouter()

    return (
        <Flex color={headerTextColor} w={"full"} h={"76px"} pos={['fixed', 'fixed', 'fixed', "sticky", "sticky"]} bgColor={mainBackgroundColor} zIndex={"10"} insetX={"0px"} top={"0px"} borderBottomColor={borderColor} borderBottomWidth={"1px"} alignItems={"center"} px={"6"} justifyContent={"space-between"}  >
            <Box w={"400px"} display={["none", "none", "none", "flex", "flex"]} >
                {/* <CustomInput placeholder="Search" name={""} value={""} setValue={function (name: string, value: string): void {
                    throw new Error("Function not implemented.");
                }} /> */}
                {/* <SearchBar fundraising={pathname?.includes("/donation")} change={pathname?.includes("/donation") ? true : false} /> */}
            </Box>
            {/* <Text display={["none", "none", "none", "flex", "flex"]} fontSize={"24px"} fontWeight={"700"} >Chasescroll  <span style={{ color: primaryColor, marginLeft: "2px" }} >Versax</span></Text>
            <Flex alignItems={"center"} gap={"2"} >
                <Flex as={"button"} onClick={() => router?.push("/dashboard")} display={["flex", "flex", "flex", "none", "none"]} alignItems={"center"} gap={"2"} >
                    <Image alt='logo' src='/images/logo.png' w={"35.36px"} />
                </Flex>
                <Flex display={["none", "none", "flex"]} alignItems={"center"} gap="2" >
                    <FundraisingIcon />
                    <Text fontSize={["16px", "16px", "24px"]} fontWeight={"700"} >Fundraising</Text>
                </Flex>
                <Flex display={["flex", "flex", "none"]} alignItems={"center"} gap="2" >
                    <FundraisingIcon height='19' />
                    <Text fontSize={["16px", "16px", "24px"]} fontWeight={"700"} >Fundraising</Text>
                </Flex>
            </Flex> */}
            {/* // <Flex display={["flex", "flex", "flex", "none", "none"]} alignItems={"center"} gap={"3"} >
            //     <DashboardMenuBtn count={count} />
            // </Flex> */}
        </Flex>
    )
}