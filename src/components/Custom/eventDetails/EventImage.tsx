import { RESOURCE_URL } from "@/constants";
import useCustomTheme from "@/hooks/useTheme";
import { IEventType } from "@/models/Event";
import { IDonationList } from "@/models/donation";
import { Flex, Image } from "@chakra-ui/react";

export default function EventImage({
  width,
  height,
  data,
}: {
  width?: any;
  height?: any;
  data: IEventType | IDonationList | any;
}) {
  const { borderColor, secondaryBackgroundColor } = useCustomTheme();

  return (
    <Flex w={width ?? "full"} flexDir={"column"} gap={"4"}>
      <Flex
        borderWidth={"1px"}
        borderColor={borderColor}
        position={"relative"}
        w={"full"}
        h={height ?? ["340px", "340px", "520px"]}
        pos={"relative"}
        justifyContent={"center"}
        alignItems={"center"}
        bgColor={secondaryBackgroundColor}
        rounded={"8px"}
        px={"1"}
        py={["1", "1", "3"]}
      >
        <Image
          src={
            RESOURCE_URL +
            (data?.picUrls?.length > 0 ? data?.picUrls[0] : data?.bannerImage)
          }
          alt="logo"
          rounded={"8px"}
          height={"full"}
          objectFit={"contain"}
        />

        {/* {!pathname?.includes("past") && (
                    <Flex pos={"absolute"} bottom={"6"} right={"6"} zIndex={"50"} w={"fit-content"} h={"fit-content"} gap={"4"} p={"5px"} px={"2"} rounded={"full"} bgColor={mainBackgroundColor} >
                        <SaveOrUnsaveBtn color={headerTextColor} event={props} size='20' />
                        <ShareEvent newbtn={true} showText={false} data={props} id={props.prStatus === "ACTIVE" ? props?.affiliateID + "?type=affiliate" : id} type="EVENT" eventName={textLimit(eventName, 17)} />
                    </Flex>
                )} */}
      </Flex>
    </Flex>
  );
}
