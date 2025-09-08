"use client"
import useCustomTheme from "@/hooks/useTheme";
import { KisokIcon, NotificationIcon, SidebarEventIcon, SidebarHomeIcon, SidebarLogoutIcon, SidebarMessageIcon, SidebarSearchIcon, SidebarWalletIcon } from "@/svg/sidebarIcons";
import { Flex, Box, Image, Switch, Spinner, Text, Button } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, Suspense, useState } from "react";
import { ModalLayout, UserImage } from "../shared";
import { Warning2 } from 'iconsax-reactjs';
import { useColorMode } from "../ui/color-mode";
import useGetUser from "@/hooks/useGetUser";
import { LANDINGPAGE_URL } from "@/helpers/services/urls";

export default function SideBar() {


    type IRoute = {
        icon: ReactNode;
        text: string;
        route: string;
    }

    const router = useRouter()

    const { isLoading, user } = useGetUser()

    const [open, setOpen] = useState(false)
    const [activeBar, setActiveBar] = useState("")
    const { borderColor, mainBackgroundColor, secondaryBackgroundColor, primaryColor } = useCustomTheme()
    const { colorMode, toggleColorMode } = useColorMode();

    const pathname = usePathname()
    const routes: IRoute[] = [
        {
            route: '/dashboard',
            icon: <SidebarHomeIcon color={pathname === "/dashboard" ? true : false} />,
            text: 'Home'
        },
        {
            route: '/dashboard/explore',
            icon: <SidebarSearchIcon color={pathname?.includes("explore") ? true : false} />,
            text: 'Explore'
        },
        {
            route: '/product/events',
            icon: <KisokIcon color={(pathname?.includes('product') || pathname?.includes('kiosk') || pathname?.includes('donation') || pathname?.includes('event')) ? true : false} />,
            text: 'Versax'
        },
        {
            route: '/dashboard/chats',
            icon: <SidebarMessageIcon color={pathname === "/dashboard/chats" ? true : false} />,
            text: 'Chats'
        },
        {
            route: '/dashboard/community',
            icon: <SidebarEventIcon color={pathname === "/dashboard/community" ? true : false} />,
            text: 'Community'
        },
        {
            route: '',
            icon: <NotificationIcon color={pathname === "/dashboard/notification" ? true : false} />,
            text: 'Notification'
        },
        {
            route: `/dashboard/settings/payment/details`,
            icon: <SidebarWalletIcon color={pathname === "/dashboard/settings/payment/details" ? true : false} />,
            text: 'Wallet'
        }
    ];

    const clickHandler = () => {
        window.location.href = `${LANDINGPAGE_URL}/logout`;
    }

    const ToolTip = ({ content }: { content: string }) => {
        return (
            <>
                {activeBar === content && (
                    <Flex pos={"absolute"} justifyContent={"center"} alignItems={"center"} py={"1"} fontSize={"12px"} fontWeight={"medium"} rounded={"6px"} bottom={"-13px"} w={"fit"} px={"2"} bgColor={secondaryBackgroundColor}  >
                        {content}
                    </Flex>
                )}
            </>
        )
    }

    return (
        <Flex w={"fit-content"} h={"screen"} bgColor={mainBackgroundColor} display={["none", "none", "none", "flex", "flex"]} >
            <Flex w={"110px"} h={"screen"} gap={"4"} overflowY={"auto"} flexDir={"column"} py={"4"} alignItems={"center"} justifyContent={"space-between"} borderRightColor={borderColor} borderRightWidth={"1px"} >
                <Box as='button' onClick={() => router?.push("/")} >
                    <Image alt='logo' src='/images/logo.png' w={"50px"} />
                </Box>
                <Flex flexDir={"column"} alignItems={"center"} gap={"3"} >
                    {routes?.map((item, index) => (
                        <Flex cursor={"pointer"} key={index}>
                            {item?.text !== "Notification" && (
                                <Flex onMouseOver={() => setActiveBar(item?.text)} onMouseOut={() => setActiveBar("")} pos={"relative"} cursor={"pointer"} onClick={() => router?.push(item?.route)} key={index} w={"75px"} h={"56px"} justifyContent={"center"} alignItems={"center"} >
                                    <Box>
                                        {item?.icon}
                                    </Box>
                                    <ToolTip content={item?.text} />
                                </Flex>
                            )}
                            {item?.text === "Notification" && (
                                <Flex onMouseOver={() => setActiveBar(item?.text)} onMouseOut={() => setActiveBar("")} cursor={"pointer"} key={index} w={"75px"} h={"56px"} position={"relative"} justifyContent={"center"} alignItems={"center"} >
                                    <Box>
                                        {item?.icon}
                                    </Box>
                                    <ToolTip content={item?.text} />
                                </Flex>
                            )}
                        </Flex>
                    ))}
                </Flex>

                <Flex flexDir={"column"} alignItems={"center"} >

                    <Flex position={"relative"} onMouseOver={() => setActiveBar("darkmode")} onMouseOut={() => setActiveBar("")} w={"75px"} h={"56px"} justifyContent={"center"} alignItems={"center"} >
                        <Box>
                            <Switch.Root
                                size={"lg"}
                                checked={colorMode === 'dark'}
                                onCheckedChange={() => toggleColorMode()}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                            </Switch.Root>
                            {/* <CustomSwitch checked={colorMode === 'dark'} onChange={() => toggleColorMode()} /> */}
                        </Box>
                        <ToolTip content={"darkmode"} />
                    </Flex>
                    <Flex cursor={"pointer"} onClick={() => router?.push(`/dashboard/profile/${user?.userId}`)} position={"relative"} onMouseOver={() => setActiveBar("profile")} onMouseOut={() => setActiveBar("")} w={"75px"} h={"72px"} justifyContent={"center"} alignItems={"center"} >
                        <Flex w={"full"} h={"60px"} justifyContent={"center"} pt={"3"} >
                            {isLoading ? (
                                <Spinner color={primaryColor} />
                            ) : (
                                <UserImage user={user} size="sm" />
                            )}
                        </Flex>
                        <ToolTip content={"profile"} />
                    </Flex>

                    <Flex cursor={"pointer"} onClick={() => setOpen(true)} position={"relative"} onMouseOver={() => setActiveBar("logout")} onMouseOut={() => setActiveBar("")} w={"75px"} h={"56px"} justifyContent={"center"} alignItems={"center"} >
                        <Box>
                            <SidebarLogoutIcon />
                        </Box>
                        <ToolTip content={"logout"} />
                    </Flex>
                </Flex>
            </Flex>
            <ModalLayout size={"xs"} trigger={true} open={open} close={() => setOpen(false)} >
                <Flex
                    width={"100%"}
                    height={"100%"}
                    justifyContent={"center"}
                    gap={6}
                    rounded={"lg"}
                    flexDirection={"column"}
                    bgColor={mainBackgroundColor}
                    p={"6"}
                    alignItems={"center"}
                >
                    <Flex
                        width="60px"
                        height={"60px"}
                        borderRadius={"full"}
                        justifyContent={"center"}
                        bg="#df26263b"
                        alignItems={"center"}
                    >
                        <Warning2 color="red" size="30px" variant="Outline" />
                    </Flex>
                    <Text fontSize={"18px"} fontWeight={"600"} >
                        Are you sure you want to logout?
                    </Text>
                    <Flex justifyContent={"center"} roundedBottom={"lg"} gap={"3"} width={"100%"}>
                        <Button
                            // outlineColor={"brand.chasescrollButtonBlue"}
                            borderColor={primaryColor}
                            borderWidth={"1px"}
                            width="45%"
                            fontWeight={"600"}
                            outline={"none"}
                            _hover={{ backgroundColor: "white" }}
                            bg={"white"}
                            rounded={"full"}
                            height={"45px"}
                            color={primaryColor}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            borderColor={"red"}
                            borderWidth={"1px"}
                            rounded={"full"}
                            _hover={{ backgroundColor: "red" }}
                            bg="red"
                            width="45%"
                            fontWeight={"600"}
                            height={"45px"}
                            color="white"
                            onClick={clickHandler}
                        >
                            Log out
                        </Button>
                    </Flex>
                </Flex>
            </ModalLayout>
        </Flex>
    )
}