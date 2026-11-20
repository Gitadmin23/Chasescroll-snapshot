"use client";

import React from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { HiOutlineShare } from "react-icons/hi";
import { toaster } from "@/components/ui/toaster";

export async function copyShareLink(customUrl?: string, itemLabel: string = "Link") {
    try {
        if (typeof window !== "undefined") {
            const urlToCopy = customUrl || window.location.href;
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(urlToCopy + "/opengraph");
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = urlToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            toaster.create({
                title: "Link Copied",
                description: `${itemLabel} link copied to clipboard!`,
                type: "success",
            });
            return true;
        }
    } catch (error) {
        toaster.create({
            title: "Failed to Copy",
            description: "Could not copy link to clipboard.",
            type: "error",
        });
        return false;
    }
}

export interface ShareButtonProps extends FlexProps {
    url?: string;
    itemLabel?: string;
}

export default function ShareButton({
    url,
    itemLabel = "Link",
    ...rest
}: ShareButtonProps) {
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        copyShareLink(url, itemLabel);
    };

    return (
        <Flex
            width={"28px"}
            h={"30px"}
            justifyContent={"center"}
            alignItems={"center"}
            pos={"absolute"}
            bottom={"2"}
            right={"2"}
            rounded={"md"}
            bgColor={"white"}
            color={"black"}
            cursor={"pointer"}
            shadow={"sm"}
            zIndex={"10"}
            _hover={{ bg: "gray.100", transform: "scale(1.05)" }}
            transition={"all 0.2s"}
            onClick={handleCopy}
            title={`Copy ${itemLabel.toLowerCase()} link`}
            aria-label={`Copy ${itemLabel.toLowerCase()} link`}
            {...rest}
        >
            <HiOutlineShare />
        </Flex>
    );
}
