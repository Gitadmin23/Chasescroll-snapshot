import { useDetails } from "@/global-state/useUserDetails";
import { IUser } from "@/models/User";
import { URLS } from "@/services/urls";
import httpService from "@/utils/httpService";
import React, { useEffect } from "react";
import { useQuery } from "react-query";

const useGetDonation = () => {


    const [user, setData] = React.useState<IUser | null>(null);
    const { setAll, email } = useDetails((state) => state);
    const token = localStorage.getItem('token')+"";

    const { isLoading: loadingUserInfo, isRefetching: refechingUserInfo, refetch } = useQuery(
        ["getDonation"],
        () => httpService.get(`/payments/orders`),
        {
            // enabled: token ? false : true,
            onSuccess: (data) => {
                setData(data.data); 
            },
            // staleTime: Infinity, // Prevents automatic refetching by keeping data fresh indefinitely
            // cacheTime: Infinity, // Prevents cache from being garbage collected
            // refetchOnWindowFocus: false, // Disable refetching on window focus
            // refetchOnReconnect: false, // Disable refetching on reconnect
        },
    ); 

    return {
        user,
        loadingUserInfo,
        refechingUserInfo
    };
}

export default useGetDonation