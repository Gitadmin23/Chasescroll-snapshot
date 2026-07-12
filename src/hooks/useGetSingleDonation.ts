import { useDetails } from "@/global-state/useUserDetails";
import { IUser } from "@/models/User";
import { IDonationList } from "@/models/donation";
import { URLS } from "@/services/urls";
import { cleanup } from "@/utils/cleanupObj";
import httpService from "@/utils/httpService";
import React from "react";
import { useQuery } from "react-query";

const useGetSingleDonationList = (id?: string) => {

 
    const [singleData, setSingleData] = React.useState<IDonationList>({} as IDonationList);

    const { isLoading, isRefetching, refetch } = useQuery(
        ["getDonationsingleList", id],
        () => httpService.get(`/fund-raiser/single/${id}`),
        { 
            onSuccess: (data) => {   
                    setSingleData(data?.data) 
            },
        },
    );

    return { 
        isLoading,
        singleData,
        refetch
    };
}

export default useGetSingleDonationList