import httpService from "@/utils/httpService";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";



const useApplication = () => {

    const toast = useToast()

    const { invalidateQueries } = useQueryClient()

    const applyForService = useMutation({
        mutationFn: (data: {
            "eventID": string,
            "creatorID": string,
            "services": Array<string>,
            "rentals": Array<string>,
            "eventCreatorID": string,
            "applicationStatus": "PENDING"
          }) =>
            httpService.post(
                `/event-application/create`, data
            ),
        onSuccess: (data: any) => {
            console.log(data?.data);

            toast({
                title: "Successful",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            }); 
        },
        onError: () => { },
    });

    const markAsViewed = useMutation({
        mutationFn: (data: string) =>
            httpService.put(
                `/event-application/markAsViewed/${data}`, {}
            ),
        onSuccess: (data: any) => {
            console.log(data?.data?.message);
            invalidateQueries("event-application")
            toast({
                title: "Successful",
                description: data?.data?.message,
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            }); 
        },
        onError: () => { },
    });

    return { 
        applyForService,
        markAsViewed
    };
}

export default useApplication