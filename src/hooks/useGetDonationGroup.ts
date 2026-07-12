import { IUser } from "@/models/User";
import { IDonationList } from "@/models/donation"; 
import { cleanup } from "@/utils/cleanupObj";
import httpService from "@/utils/httpService";
import React from "react";
import { useQuery } from "react-query";

interface IProps { 
    name: string,
    fundRaisers: Array<IDonationList>,
    user: IUser,
    id: string
}

const useGetDonationGroup = (id?: string) => {

    const [data, setData] = React.useState<Array<IDonationList>>([]);

    const { isLoading, isRefetching, refetch } = useQuery(
        ["getDonationGroup", id],
        () => httpService.get(`/fund-raiser/group`, {
            params: cleanup({
                size: 40,
                groupID: id
            })
        }),
        {
            onSuccess: (data) => { 

                console.log(data);
                
                setData(data?.data?.content)
            },
            enabled: id ? true : false
        },
    );

    return {
        data,
        isLoading,
        refetch,
        isRefetching
    };
}

export default useGetDonationGroup