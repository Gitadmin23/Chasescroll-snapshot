"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Image,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import httpService from "@/services/httpService";
import { URLS, LANDINGPAGE_URL } from "@/services/urls";
import { IService } from "@/models/Service";
import { RESOURCE_URL } from "@/constants";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";
import { dateFormat, timeFormat } from "@/helpers/utils/dateFormat";
import useCustomTheme from "@/hooks/useTheme";
import DescriptionCard from "@/components/Custom/description";
import GetCreatorData from "@/components/getCreatorData";
import MapComponent from "@/components/Custom/MapComponent";
import { CalendarIcon } from "@/components/svg";
import { IoIosArrowForward } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { SlSocialLinkedin } from "react-icons/sl";
import { Facebook, Instagram, Whatsapp } from "iconsax-reactjs";

function getImageUrl(src?: string) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${RESOURCE_URL}${src}`;
}

export function ServiceDetail({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<IService>({} as IService);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const {
    primaryColor,
    secondaryBackgroundColor,
    borderColor,
    mainBackgroundColor,
    bodyTextColor,
    headerTextColor,
  } = useCustomTheme();

  const { isLoading, data: queryData } = useQuery({
    queryKey: ["service", id],
    queryFn: () =>
      httpService.get(`${URLS.service}/search`, {
        params: { id },
      }),
  });

  useEffect(() => {
    const content = queryData?.data?.content;
    if (Array.isArray(content) && content.length > 0) {
      setData(content[0]);
    }
  }, [queryData]);

  // Dynamically update page title
  useEffect(() => {
    if (data?.name) {
      document.title = `${capitalizeFLetter(data.name)} | Chasescroll Service`;
    } else {
      document.title = "Service Details | Chasescroll";
    }
  }, [data?.name]);

  // Checkout / booking redirect using landingpage auth url
  const handleCheckout = () => {
    router.push(`${LANDINGPAGE_URL}/auth?serviceId=${data?.id || id}`);
  };

  // Validated coordinates for map
  const coordinates = useMemo(() => {
    if (!data?.location?.latlng) return null;
    const [latStr, lngStr] = data.location.latlng.split(" ");
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
    return null;
  }, [data?.location?.latlng]);

  const startingPrice =
    data?.discount && data?.discount > 0
      ? data.discount.toLocaleString()
      : data?.price
      ? data.price.toLocaleString()
      : "0";

  if (isLoading) {
    return (
      <Flex w="full" flexDir="column" gap="6" px={["4", "4", "6"]} py="6">
        <Skeleton h="24px" w="220px" rounded="md" />
        <Flex w="full" gap="4" flexDir={["column", "column", "row"]}>
          <Skeleton h={["340px", "340px", "520px"]} w="full" rounded="8px" />
          <Flex w="full" flexDir="column" gap="4">
            <Skeleton h="36px" w="70%" rounded="md" />
            <Skeleton h="20px" w="40%" rounded="md" />
            <Skeleton h="120px" w="full" rounded="8px" />
            <Skeleton h="120px" w="full" rounded="8px" />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      w="full"
      flexDir="column"
      gap="6"
      pos="relative"
      overflowY="auto"
      h="full"
      px={["4", "4", "6"]}
      pb={["6"]}
      py="6"
    >
      {/* Breadcrumb Header */}
      <Flex gap="1" alignItems="center" pb="3">
        <Text
          role="button"
          onClick={() => router.back()}
          fontSize="14px"
          color={primaryColor}
          fontWeight="500"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
        >
          Back
        </Text>
        <IoIosArrowForward />
        <Text fontSize="14px" fontWeight="500">
          Service details
        </Text>
        <IoIosArrowForward />
        <Text fontSize="14px" fontWeight="500">
          {data?.name}
        </Text>
      </Flex>

      {/* Main 2-Column Content */}
      <Flex w="full" gap="4" flexDir={["column", "column", "row"]}>
        {/* Left Column: Image Scroller / Gallery */}
        <Flex
          w="full"
          h={["340px", "340px", "620px"]}
          bgColor={secondaryBackgroundColor}
          pos="relative"
          rounded="8px"
          borderWidth="1px"
          p="1"
          justifyContent="center"
          alignItems="center"
          borderColor={borderColor}
          overflow="hidden"
        >
          {data?.images?.length > 0 && (
            <Image
              src={getImageUrl(data.images[activeImageIndex] || data.images[0])}
              alt="service image"
              rounded="8px"
              height="full"
              w="full"
              objectFit="cover"
            />
          )}

          {data?.images?.length > 1 && (
            <Grid
              templateColumns={["repeat(3, 1fr)"]}
              pos="absolute"
              gap="3"
              insetX="4"
              bottom="4"
            >
              {data.images.map((subitem: string, index: number) => {
                if (index <= 3) {
                  return (
                    <Flex
                      key={index}
                      cursor="pointer"
                      onClick={() => setActiveImageIndex(index)}
                      w="full"
                      h={["70px", "100px"]}
                      bgColor={secondaryBackgroundColor}
                      rounded="8px"
                      shadow="md"
                      borderWidth={activeImageIndex === index ? "2px" : "1px"}
                      borderColor={activeImageIndex === index ? primaryColor : borderColor}
                      overflow="hidden"
                      transition="all 0.15s ease"
                    >
                      <Image
                        src={getImageUrl(subitem)}
                        alt="thumb"
                        w="full"
                        rounded="8px"
                        height="full"
                        objectFit="cover"
                      />
                    </Flex>
                  );
                }
                return null;
              })}
            </Grid>
          )}
        </Flex>

        {/* Right Column: Service Information */}
        <Flex w="full" flexDir="column" gap="3">
          <Flex w="full" flexDir="column" gap="2">
            <Text fontSize={["24px", "24px", "32px"]} fontWeight="700">
              {capitalizeFLetter(data?.name)}
            </Text>
            {data?.phone && (
              <Text fontWeight="medium" color={bodyTextColor}>
                Phone: {data.phone}
              </Text>
            )}
          </Flex>

          <Flex
            w="full"
            flexDir={["column-reverse", "column-reverse", "column"]}
            gap="3"
          >
            {/* Description */}
            {data?.description && (
              <DescriptionCard
                limit={200}
                label="Service Details"
                description={data.description}
              />
            )}

            {/* Creator / Vendor & Checkout on Mobile */}
            <Flex w="full" gap="2" flexDir={["column", "column", "row"]}>
              <Flex
                display={["none", "none", "flex"]}
                w={["fit-content", "fit-content", "full"]}
              >
                <GetCreatorData userData={data?.vendor as any} />
              </Flex>

              {/* Mobile Checkout Card */}
              <Flex
                bgColor={mainBackgroundColor}
                display={["flex", "flex", "none"]}
                w="full"
              >
                <Flex
                  w="full"
                  flexDir="column"
                  p={["4", "4", "30px"]}
                  justifyContent="center"
                  borderRadius="10px"
                  borderWidth="1px"
                  borderColor={borderColor}
                  gap="3"
                >
                  <Flex flexDir="column">
                    <Text fontWeight={600} fontSize="14px" color={bodyTextColor}>
                      Starting price
                    </Text>
                    <Text fontSize="24px" fontWeight={600} color={headerTextColor}>
                      NGN {startingPrice}
                    </Text>
                  </Flex>
                  <Button
                    onClick={handleCheckout}
                    w="full"
                    h="50px"
                    borderRadius="full"
                    bgColor={primaryColor}
                    color="white"
                    fontWeight="semibold"
                    _hover={{ opacity: 0.9 }}
                  >
                    Check out
                  </Button>
                </Flex>
              </Flex>
            </Flex>

            {/* Joined Date */}
            {data?.createdDate && (
              <Flex gap="2" alignItems="center">
                <Text fontWeight="600" fontSize="14px" w="60px">
                  Joined
                </Text>
                <CalendarIcon color={primaryColor} />
                <Text fontSize={["12px", "12px", "14px"]}>
                  {dateFormat(data.createdDate)} {timeFormat(data.createdDate)}
                </Text>
              </Flex>
            )}

            {/* Social Media Handles (Mobile) */}
            <Flex
              display={["flex", "flex", "none"]}
              gap="4"
              alignItems="center"
              flexWrap="wrap"
            >
              <Flex w={["fit-content", "fit-content", "full"]}>
                <GetCreatorData userData={data?.vendor as any} />
              </Flex>
              <Flex gap="3" alignItems="center">
                {data?.socialMediaHandles?.map((item, index) => {
                  const url = item?.socialMediaHandle?.includes("https")
                    ? item.socialMediaHandle
                    : `https://${item?.socialMediaHandle}`;
                  const platform = item?.platform?.toLowerCase() || "";

                  return (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                      {platform.includes("facebook") && (
                        <Facebook color={primaryColor} size="20px" />
                      )}
                      {platform.includes("twitter") && (
                        <FaXTwitter color={primaryColor} size="20px" />
                      )}
                      {platform.includes("instagram") && (
                        <Instagram color={primaryColor} size="20px" />
                      )}
                      {platform.includes("whatsapp") && (
                        <Whatsapp color={primaryColor} size="20px" />
                      )}
                      {platform.includes("linked") && (
                        <SlSocialLinkedin color={primaryColor} size="20px" />
                      )}
                    </a>
                  );
                })}
              </Flex>
            </Flex>

            {/* Social Media Handles (Desktop) */}
            <Flex
              gap="4"
              display={["none", "none", "flex"]}
              alignItems="center"
              flexWrap="wrap"
            >
              {data?.socialMediaHandles?.map((item, index) => {
                const url = item?.socialMediaHandle?.includes("https")
                  ? item.socialMediaHandle
                  : `https://${item?.socialMediaHandle}`;
                const platform = item?.platform?.toLowerCase() || "";

                return (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                    {platform.includes("facebook") && (
                      <Facebook color={primaryColor} size="20px" />
                    )}
                    {platform.includes("twitter") && (
                      <FaXTwitter color={primaryColor} size="20px" />
                    )}
                    {platform.includes("instagram") && (
                      <Instagram color={primaryColor} size="20px" />
                    )}
                    {platform.includes("whatsapp") && (
                      <Whatsapp color={primaryColor} size="20px" />
                    )}
                    {platform.includes("linked") && (
                      <SlSocialLinkedin color={primaryColor} size="20px" />
                    )}
                  </a>
                );
              })}
            </Flex>

            {/* Desktop Checkout Card */}
            <Flex w="full" justifyContent="end">
              <Flex
                bgColor={mainBackgroundColor}
                maxW="413px"
                w="full"
                display={["none", "none", "flex"]}
              >
                <Flex
                  w="full"
                  flexDir="column"
                  p="30px"
                  justifyContent="center"
                  borderRadius="10px"
                  borderWidth="1px"
                  borderColor={borderColor}
                  gap="4"
                >
                  <HStack justifyContent="flex-start" gap="2">
                    <Text fontWeight={600} fontSize="14px" color={bodyTextColor}>
                      Starting price
                    </Text>
                    <Text fontSize="24px" fontWeight={600} color={headerTextColor}>
                      NGN {startingPrice}
                    </Text>
                  </HStack>
                  <Button
                    onClick={handleCheckout}
                    w="full"
                    h="54px"
                    borderRadius="full"
                    bgColor={primaryColor}
                    color="white"
                    fontWeight="semibold"
                    _hover={{ opacity: 0.9 }}
                  >
                    Check out
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* Map Section */}
      {coordinates && (
        <Flex w="full" gap="3" flexDir={["column", "column", "row"]} mt="4">
          <Flex w="full" flexDir="column" gap="2">
            {data?.location?.locationDetails && (
              <Text fontSize="sm" color={bodyTextColor} fontWeight="medium">
                {data.location.locationDetails}
              </Text>
            )}
            <Box rounded="16px" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
              <MapComponent
                lat={coordinates.lat}
                lng={coordinates.lng}
                width="100%"
                height="240px"
                borderRadius="16px"
                markerTitle={data?.name || "Service Location"}
              />
            </Box>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

export default ServiceDetail;
