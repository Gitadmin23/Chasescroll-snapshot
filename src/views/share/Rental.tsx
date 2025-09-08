'use client';
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

function Rental({ id }: { id: string }) {
    const { isLoading, data, isError, error } = useQuery({
        queryKey: [`get-external-rentals-single-${id}`],
        queryFn: () => httpService.get(`${URLS.rental}/search`, {
            params: {
                id
            }
        })
    })
    return (
        <div>

        </div>
    )
}

export default Rental
