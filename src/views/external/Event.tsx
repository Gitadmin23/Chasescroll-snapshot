'use client';
import ReusableExternalListCard from '@/components/Custom/ReusableExternalListCard';
import { Flex, Image, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react"
import { IEventType } from '@/models/Event';
import { PaginatedResponse } from '@/models/PaginatedResponse';
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
import { useQuery } from '@tanstack/react-query';
import { uniq, uniqBy } from 'lodash';
import React from 'react'
import { Box, Text, Grid } from '@chakra-ui/react';

function Event({ userId }: { userId: string }) {
    const [events, setEvents] = React.useState<IEventType[]>([]);
    const [page, setPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(true);


    const { isLoading, data, isError, error } = useQuery({
        queryKey: ['get-external-events', page],
        queryFn: () => httpService.get(`${URLS.event}/events`, {
            params: {
                createdBy: userId,
                page,
            }
        }),
    })

    React.useEffect(() => {
        if (!isLoading && !isError && data?.data) {
            console.log(data?.data);
            const item: PaginatedResponse<IEventType> = data?.data;
            setEvents((prev) => uniqBy([...prev, ...item.content], 'id'));
            if (!item?.last) {
                setPage((Prev) => Prev + 1);
            } else {
                setHasMore(false);
            }
        }
    }, [data, isError, isLoading])
    return (
        <Box w='full' h='full'>
            <Text
                textAlign='center'
                fontSize='4xl'
                fontWeight='extrabold'
                letterSpacing='tight'
                color={'black'}
            >
                Events
            </Text>

            {!isLoading && isError && (
                <Flex w='full' h='full' flexDir={'column'} alignItems={'center'} justifyContent={'center'}>
                    <Image src="/Error.png" w="150px" h="150px" />
                    <Text fontFamily={'heading'} fontSize={'20px'} color="black" textAlign={'center'}>An Error Occured</Text>
                </Flex>
            )}

            {!isError && (
                <Grid
                    w='full'
                    h='full'
                    templateColumns={['repeat(1, 1fr)', 'repeat(1, 1fr)', 'repeat(4, 1fr)', 'repeat(4, 1fr)']}
                    gap={4}
                    mt={10}
                >
                    {!isLoading && !isError && events?.length > 0 && events.map((item, index) => (
                        <ReusableExternalListCard type='EVENT' key={index.toString()} event={item} />
                    ))}
                    {isLoading && [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <Skeleton width={'full'} height={'509px'} borderRadius={'16px'} key={index.toString()} />
                    ))}

                </Grid>
            )}
        </Box>
    )
}

export default Event
