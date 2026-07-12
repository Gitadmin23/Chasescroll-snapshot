import httpService from "@/utils/httpService";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";



const useOrderConfirmation = (productId?: string) => {

    const toast = useToast()

    const query = useQueryClient()
    const [open, setOpen] = useState(false)
    const [openMesage, setOpenMesage] = useState(false)
    const [show, setShow] = useState(false)
    const [tab, setTab] = useState(1)
    const { push } = useRouter()

    const rentalConfirm = useMutation({
        mutationFn: (data: any) =>
            httpService.post(
                `/reciept/markAsReceived/${data}`, {}
            ),
        onSuccess: (data: any) => {
            console.log(data?.data);
            setOpen(false)
            setShow(false)
            setOpenMesage(true)
            // setTab(3)
            // push(`/dashboard/kisok/details-order/${productId}?type=true`)
            // query?.invalidateQueries("order")
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


    const serviceConfirm = useMutation({
        mutationFn: (data: {
            "bookingID": string,
            "completedWithIssues": boolean,
            "userID": string
        }) =>
            httpService.put(
                `/booking/user-mark-as-done`, data
            ),
        onSuccess: (data: any) => {
            console.log(data?.data);
            setOpen(false)
            setShow(false)
            setOpenMesage(true)

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

    const productConfirm = useMutation({
        mutationFn: (data: any) =>
            httpService.post(
                `/orders/markAsReceived/${data}`, {}
            ),
        onSuccess: (data: any) => {
            console.log(data?.data);
            setOpen(false)
            setShow(false)
            setOpenMesage(true)

            push(`/dashboard/kisok/details-order/${productId}?type=true`)
            query?.invalidateQueries("order")
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

    return { 
        rentalConfirm,
        serviceConfirm,
        productConfirm,
        open, 
        setOpen,
        show, 
        setShow,
        tab, 
        setTab,
        openMesage, 
        setOpenMesage
    };
}

export default useOrderConfirmation