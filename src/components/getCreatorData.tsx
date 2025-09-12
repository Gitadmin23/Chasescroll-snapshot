
import useCustomTheme from '@/hooks/useTheme';
import { IUser } from '@/models/User';
import { Flex, Text } from '@chakra-ui/react' 
import { useRouter } from 'next/navigation';
import React from 'react' 
import UserImage from './userImage';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';
import { textLimit } from '@/utils/textlimiter';

export default function GetCreatorData({ userData, donation, data: donationData}: { userData: IUser, data?: any, donation?: boolean }) {
 
    const { secondaryBackgroundColor } = useCustomTheme()
    const router = useRouter();
     


    return (
        <Flex bgColor={["transparent", "transparent", secondaryBackgroundColor]} rounded={"64px"} h={["fit-content", "fit-content", "80px"]} px={["0px", "0px", "4"]} w={["220px", "fit-content", "full"]} gap={"2"} flexDir={["column", "column", "row"]} justifyContent={["start", "start", "space-between"]} alignItems={["start", "start", "center"]} >
            <Flex role='button' gap={"2"} alignItems={"center"} >
                <Flex display={["none", "flex", "flex"]} >
                    <UserImage user={userData} />
                </Flex>
                <Flex display={["flex", "none", "none"]} >
                    <UserImage user={userData} />
                </Flex>
                <Flex flexDir={"column"} >
                    <Text textAlign={"left"} display={["none", "block"]} fontWeight={"medium"} >{capitalizeFLetter(userData?.firstName) + " " + capitalizeFLetter(userData?.lastName)}</Text>
                    <Text textAlign={"left"} display={["block", "none"]} fontWeight={"medium"} fontSize={"12px"} >{textLimit(capitalizeFLetter(userData?.firstName) + " " + capitalizeFLetter(userData?.lastName), 10)}</Text>
                    {/* <Text textAlign={"left"} display={["none", "block"]} fontWeight={"medium"} >{capitalizeFLetter(userData?.firstName) + " " + capitalizeFLetter(userData?.lastName)}</Text>
                    <Text textAlign={"left"} display={["block", "none"]} fontWeight={"medium"} fontSize={"12px"} >{textLimit(capitalizeFLetter(userData?.firstName) + " " + capitalizeFLetter(userData?.lastName), 10)}</Text> */}
                    {/* <Text textAlign={"left"} mt={"-2px"} fontSize={["13px", "13px", "sm"]} >{data?.data?.numberOfElements} followers</Text> */}
                </Flex>
            </Flex> 
        </Flex>
    )
}
