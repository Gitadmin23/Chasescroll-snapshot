import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

const CircularProgressBar = ({ progress, size = 67, strokeWidth = 10, isEvent, fontSize }: { progress: number, size?: number, strokeWidth?: number, isEvent?: boolean, fontSize?: string  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <Flex w={"fit-content"} pos={"relative"} >
            <Flex w={"full"} h={"full"}  pos={"absolute"} inset={"0px"} justifyContent={"center"} alignItems={"center"} > 
                <Text fontSize={[isEvent ? fontSize ?? "10px" : fontSize ?? "14px", fontSize ?? "10px", fontSize ?? "10px"]} >{progress}%</Text>
                {/* <Text fontSize={"14px"} >{progress}</Text> */}
            </Flex>
            <svg
                width={size}
                height={size}
                style={{ transform: 'rotate(-90deg)' }} // Rotate to start at the top
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#5465E0"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
        </Flex>
    );
};

export default CircularProgressBar;
