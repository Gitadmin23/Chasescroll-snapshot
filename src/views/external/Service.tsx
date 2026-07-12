'use client';
import ReusableExternalListCard from '@/components/Custom/ReusableExternalListCard';
import { PaginatedResponse } from '@/models/PaginatedResponse';
import { IService } from '@/models/Service';
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
import { Skeleton, Text, Grid, Box } from '@chakra-ui/react';

import { useQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash';
import React from 'react'

function Service({ userId }: { userId: string }) {
    const [events, setEvents] = React.useState<IService[]>([]);
    const [page, setPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(true);

    const { isLoading, data, isError, error } = useQuery({
        queryKey: [`get-external-service-${userId}`],
        queryFn: () => httpService.get(`${URLS.service}/search`, {
            params: {
                vendorID: userId,
                page
            }
        })
    });

    React.useEffect(() => {
        if (!isLoading && !isError && data?.data) {
            console.log(data?.data);
            const item: PaginatedResponse<IService> = data?.data;
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
            >
                Services
            </Text>

            <Grid
                w='full'
                h='full'
                templateColumns='repeat(4, 1fr)'
                gap={4}
                mt={10}
            >
                {!isLoading && !isError && events?.length > 0 && events.map((item, index) => (
                    <ReusableExternalListCard type='SERVICE' key={index.toString()} service={item as IService} />
                ))}
                {isLoading && [1, 2, 3, 4, 5, 6].map((item) => (
                    <Skeleton width={'full'} height={'509px'} borderRadius={'16px'} />
                ))}
            </Grid>
        </Box>
    )
}

export default Service
