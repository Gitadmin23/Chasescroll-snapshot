import { ITag } from "@/models/product";
import { URLS } from "@/services/urls";
import httpService from "@/utils/httpService";
import { useToast } from "@chakra-ui/react";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const usePr = () => {

    const query = useQueryClient()
    const toast = useToast()

    const [open, setOpen] = useState(false)

    const createPr = useMutation({
        mutationFn: (data: {
            eventID: string,
            affiliateType: string,
            percent: number
        }) =>
            httpService.put(
                `/events/create-pr-request?eventID=${data?.eventID}&affiliateType=${data?.affiliateType}&percent=${data?.percent}`, {}
            ),
        onSuccess: (data: any) => {
            toast({
                title: "success",
                description: data?.data?.message,
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            query?.invalidateQueries("all-events-details")
            setOpen(false)

        },
        onError: () => { },
    });

    // Create Event From Draft
    const tagServiceAndRental = useMutation({
        mutationFn: (data: {
            "serviceCategories": Array<ITag>,
            "rentalCategories": Array<ITag>,
            "eventID": string,
            "state": string
        }) => httpService.post("/tags/create-request", data),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: AxiosResponse<any>) => {
            toast({
                title: "success",
                description: data?.data?.message,
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            setOpen(false)
        }
    });

    // Create Event From Draft
    const createFundraising = useMutation({
        mutationFn: (data: {
            fundRaiserID: string,
            eventID: string,
            userID: string
        }) => httpService.post("/pinned-fundraisers/create", data),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: AxiosResponse<any>) => {
            toast({
                title: "success",
                description: data?.data?.message,
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });

            query?.invalidateQueries("all-donation")
            setOpen(false)
        }
    });


    // Create Event From Draft
    const deleteFundraising = useMutation({
        mutationFn: (data: string) => httpService.delete(`/pinned-fundraisers/delete/${data}`),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: AxiosResponse<any>) => {
            toast({
                title: "success",
                description: data?.data?.message,
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });

            query?.invalidateQueries("all-donation")
            setOpen(false)
        }
    }); 


    // Edit Event
    const updateUserEvent = useMutation({
        mutationFn: (newdata:  any) => httpService.put("/events/update-pr", newdata),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (message: AxiosResponse<any>) => {
            query.invalidateQueries(['all-events-details'])

            toast({
                title: 'Success',
                description: "Event Updated",
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            setOpen(false)
        }
    });
    // / Edit Event
    const updateEvent = useMutation({
        mutationFn: (newdata: any) => httpService.put(URLS.UPDATE_EVENT, newdata),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (message: AxiosResponse<any>) => {
            query.invalidateQueries(['all-events-details'])

            toast({
                title: 'Success',
                description: "Event Role Updated",
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            setOpen(false)
        }
    });

    return {
        createPr,
        tagServiceAndRental,
        createFundraising,
        open, 
        setOpen,
        deleteFundraising,
        updateUserEvent,
        updateEvent
    };
}

export default usePr