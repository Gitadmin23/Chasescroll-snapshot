import { useDetails } from "@/global-state/useUserDetails";
import { IUser } from "@/models/User";
import { IDonationList } from "@/models/donation";
import { URLS } from "@/services/urls";
import { cleanup } from "@/utils/cleanupObj";
import httpService from "@/utils/httpService";
import React from "react";
import { useQuery } from "react-query";

const useGetDonationList = (id?: string) => {


    const [data, setData] = React.useState<Array<IDonationList>>([]);
    const [singleData, setSingleData] = React.useState<IDonationList>({} as IDonationList);

    const { isLoading, isRefetching, refetch } = useQuery(
        ["getDonationList", id],
        () => httpService.get(`/fund-raiser/search`, {
            params: cleanup({
                size: 40, 
                id: id,
                page: 0
            })
        }),
        { 
            onSuccess: (data) => {  

                if (id) {
                    setSingleData(data?.data?.content[0])
                } else {
                    setData(data.data?.content);
                }
            },
        },
    );

    return {
        data,
        isLoading,
        singleData,
        refetch
    };
}

export default useGetDonationList