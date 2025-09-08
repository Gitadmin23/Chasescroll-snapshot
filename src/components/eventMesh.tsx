import useCustomTheme from "@/hooks/useTheme";
import { Button, Flex, Image, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import usePr from "@/hooks/usePr";
import httpService from "@/services/httpService";
import { URLS } from "@/services/urls";
import { IEventType } from "@/models/Event";
import { useQuery } from "@tanstack/react-query";
import { RESOURCE_URL } from "@/constants";
import { formatNumber } from "@/utils/formatNumber";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import { textLimit } from "@/utils/textlimiter";

export default function EventMesh({
  data,
}: {
  data: IEventType;
  setMeshSize?: any;
}) {
  const { mainBackgroundColor, secondaryBackgroundColor } =
    useCustomTheme();
  const router = useRouter();

  const ref: any = React.useRef(null);

  const scroll = (scrolloffset: number) => {
    ref.current.scrollLeft += scrolloffset;
  };

  const [newData, setNewData] = useState([] as any);

  const {
    isLoading,
    data: eventData,
    isError: productError,
  } = useQuery({
    queryKey: [`Get-pinned-product-${data?.id}`],
    queryFn: () =>
      httpService.get(`${URLS.pinned_event}`, {
        params: {
          typeId: data?.id,
        },
      }),
  });

  useEffect(() => {
    if (!isLoading) {
      setNewData(eventData?.data);
    }
  }, [isLoading]);

  return (
    <Flex
      position={"relative"}
      display={newData?.length > 0 || data?.isOrganizer ? "flex" : "none"}
      flexDir={"column"}
      w={"full"}
      mb={["0px", "0px", "6"]}
      gap={"3"}
    >
      <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
        {data?.isOrganizer ? (
          <Text fontWeight={"500"}>
            Add Product to enable your Audience connect to your event
          </Text>
        ) : (
          <Text fontSize={["14px", "14px", "20px"]} fontWeight={"bold"}>
            Shop the {capitalizeFLetter(data?.eventName)}
          </Text>
        )}
        {/* {!data?.isOrganizer && (
                    <Text fontSize={"12px"} fontWeight={"600"} color={primaryColor} as={"button"} >See all</Text>
                )} */}
      </Flex>
      <Flex w={"full"} height={"180px"} pos={"relative"} />
      {!isLoading && (
        <Flex
          ref={ref}
          position={"absolute"}
          top={["14", "10", "12"]}
          maxW={"full"}
          overflowX={"auto"}
          className="hide-scrollbar"
        >
          <Flex
            position={"relative"}
            w={"fit-content"}
            gap={"2"}
            pos={"relative"}
          >
            {newData?.map((item: any, index: number) => {
              return (
                <Flex
                  onClick={() =>
                    router.push(
                      `/share/product?id=${item?.returnProductDto?.id}`
                    )
                  }
                  cursor={"pointer"}
                  pos={"relative"}
                  bgColor={mainBackgroundColor}
                  key={index}
                  w={["170px", "170px", "230px"]}
                  h={["170px", "170px", "219px"]}
                  borderWidth={"1px"}
                  borderColor={"#EBEDF0"}
                  flexDir={"column"}
                  gap={"2"}
                  p={"2"}
                  rounded={"16px"}
                >
                  <Flex
                    w={"full"}
                    h={["101px", "101px", "150px"]}
                    p={"1"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bgColor={secondaryBackgroundColor}
                    rounded={"8px"}
                  >
                    <Image
                      alt="logo"
                      height={"full"}
                      w={"auto"}
                      objectFit={"contain"}
                      rounded={"8px"}
                      src={RESOURCE_URL + item?.returnProductDto?.images[0]}
                    />
                  </Flex>
                  <Flex flexDir={"column"}>
                    <Text fontSize={"14px"} fontWeight={"700"}>
                      {formatNumber(item?.returnProductDto?.price)}
                    </Text>
                    <Text fontSize={["12px", "12px", "14px"]}>
                      {capitalizeFLetter(
                        textLimit(item?.returnProductDto?.name, 20)
                      )}
                    </Text>
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      )}
      {newData?.length > 3 && (
        <>
          <Flex
            zIndex={"10"}
            cursor={"pointer"}
            justifyContent={"center"}
            alignItems={"center"}
            position={"absolute"}
            top={"50%"}
            left={"0px"}
            bgColor={"white"}
            borderWidth={"1px"}
            onClick={() => scroll(-400)}
            as="button"
            w={"40px"}
            h={"40px"}
            rounded={"full"}
          >
            <IoChevronBack size={"20px"} color="grey" />
          </Flex>
          <Flex
            zIndex={"10"}
            cursor={"pointer"}
            justifyContent={"center"}
            alignItems={"center"}
            position={"absolute"}
            top={"50%"}
            right={"0px"}
            bgColor={"white"}
            borderWidth={"1px"}
            onClick={() => scroll(400)}
            as="button"
            w={"40px"}
            h={"40px"}
            rounded={"full"}
          >
            <IoChevronForward size={"20px"} color="grey" />
          </Flex>
        </>
      )}
    </Flex>
  );
}
