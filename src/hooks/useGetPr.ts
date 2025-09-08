import httpService from "@/utils/httpService";
import React from "react";
import { useQuery } from "react-query";

const useGetPr = (id?: string) => {


    const [data, setData] = React.useState(""); 

    const { isLoading } = useQuery(
        ["getPr"],
        () => httpService.get(`/events/get-pr`, {
            params: {
                eventID: id
            }
        }),
        { 
            onSuccess: (data) => {

                console.log(data);
                
                setData(data?.data?.prLink); 
            }
        },
    ); 
    return {
        data,
        isLoading,
    };
}

export default useGetPr