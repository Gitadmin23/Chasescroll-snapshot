import { useDetails } from "@/global-state/useUserDetails";
import { IUser } from "@/models/User";
import { URLS } from "@/services/urls";
import httpService from "@/utils/httpService";
import React, { useEffect } from "react";
import { useQuery } from "react-query";

const useGetUser = () => {


    const [user, setUser] = React.useState<IUser | null>(null);
    const { setAll, email } = useDetails((state) => state);
    const token = localStorage.getItem('token')+"";

    const { isLoading: loadingUserInfo, isRefetching: refechingUserInfo, refetch } = useQuery(
        ["getUserDetails"],
        () => httpService.get(`${URLS.GET_USER_PRIVATE_PROFILE}`, {}),
        {
            // enabled: token ? false : true,
            onSuccess: (data) => {
                setUser(data.data);

                setAll({
                    user: data?.data,
                    userId: data?.data?.userId,
                    firstName: data?.data?.firstName,
                    lastName: data?.data?.lastName,
                    email: data?.data?.email,
                    dob: data?.data?.dob,
                    username: data?.data?.username,
                });
            },
            // staleTime: Infinity, // Prevents automatic refetching by keeping data fresh indefinitely
            // cacheTime: Infinity, // Prevents cache from being garbage collected
            // refetchOnWindowFocus: false, // Disable refetching on window focus
            // refetchOnReconnect: false, // Disable refetching on reconnect
        },
    );

    useEffect(()=> {
        if(!email && token) {
            refetch()
        }
    }, [email, token, refetch])


    useEffect(()=> { 
        setAll({
            user: user,
            userId: user?.userId,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            dob: user?.dob,
            username: user?.username,
        });
    }, [user])

    return {
        user,
        loadingUserInfo,
        refechingUserInfo
    };
}

export default useGetUser