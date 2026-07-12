
import { URLS } from "@/services/urls";
import httpService from "@/utils/httpService";
import { useState } from "react";
import { useMutation, useQuery } from "react-query"; 
import { useToast } from "@chakra-ui/react";
import { INotification } from "@/models/Notifications";
import { PaginatedResponse } from "@/models/PaginatedResponse";

const useNotificationHook = () => {

    const [index, setIndex] = useState("");
    const [count, setCount] = useState("");
    const [status, setStatus] = useState("");

    const [results, setResults] = useState<Array<INotification>>([]);

    const toast = useToast()


    // const { results, isLoading, ref, isRefetching, refetch } = InfiniteScrollerComponent({ url: URLS.GET_NOTIFICATIONS, limit: 10, filter: "id", name: "getNotifications" })

    const { isLoading, refetch, isRefetching } = useQuery(['getNotifications'], () => httpService.get(`${URLS.GET_NOTIFICATIONS}`, {
        params: {
            page: 0,
            size: 50
        }
    }), {
        onSuccess: (data) => {
            const item: PaginatedResponse<INotification> = data.data;
            const unrread = item.content.filter((item) => item.status === 'UNREAD');
            setResults(item.content)
            setCount(unrread.length + "")
        },
        onError: () => { },
        enabled: results[0]?.title ? false : true
    })


    const markAsRead = useMutation({
        mutationFn: (data: string[]) =>
            httpService.put(
                `${URLS.MARK_NOTIFICATIONS_AS_READ}?notificationIDs=${data}&read=true`,
            ),
        onSuccess: (data) => {
            if(data?.data?.updated) {
                setStatus("READ")
            } 
        },
        onError: () => { },
    });

    const joinEvent = useMutation({
        mutationFn: (data: {
            id: string,
            resolve: boolean
        }) =>
            httpService.post(
                `/events/resolve-request`, data
            ),
        onSuccess: (data: any) => {
            console.log(data?.data.updated);
            if (data?.data.updated) {
                markAsRead.mutate([index]);
                refetch()
            } else {
                toast({
                    title: "error",
                    description: "Error occured ",
                    status: "error",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
            }
        },
        onError: () => { },
    });


    const rejectEvent = useMutation({
        mutationFn: (data: {
            id: string,
            resolve: boolean
        }) =>
            httpService.post(
                `/events/resolve-request`, data
            ),
        onSuccess: (data) => {
            if (data?.data.updated) {
                markAsRead.mutate([index]);
                refetch()
            } else {
                toast({
                    title: "error",
                    description: "Error occured ",
                    status: "error",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
            }
        },
        onError: () => { },
    });

    const joinFundraising = useMutation({
        mutationFn: (data: {
            id: string,
            accepted: boolean
        }) =>
            httpService.put(
                `/collaborator-request/accept-or-decline`, data
            ),
        onSuccess: (data: any) => {
            console.log(data?.data.updated);
            if (data?.data.updated) {
                markAsRead.mutate([index]);
                refetch()
            } else {
                toast({
                    title: "error",
                    description: "Error occured ",
                    status: "error",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
            }
        },
        onError: () => { },
    });

    const rejectFundraising = useMutation({
        mutationFn: (data: {
            id: string,
            accepted: boolean
        }) =>
            httpService.put(
                `/collaborator-request/accept-or-decline`, data
            ),
        onSuccess: (data: any) => {
            console.log(data?.data.updated);
            if (data?.data.updated) {
                markAsRead.mutate([index]);
                refetch()
            } else {
                toast({
                    title: "error",
                    description: "Error occured ",
                    status: "error",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
            }
        },
        onError: () => { },
    });
 
    return {
        results,
        isLoading,
        isRefetching,
        joinEvent,
        setIndex,
        rejectEvent,
        count,
        markAsRead,
        setStatus,
        status,
        joinFundraising,
        rejectFundraising
    };
}

export default useNotificationHook