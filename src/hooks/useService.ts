"use client"
import httpService from "@/utils/httpService";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import AWSHook from "./awsHook";
import useProductStore from "@/global-state/useCreateProduct"; 
import { useParams, useRouter } from "next/navigation";

export interface IPinned {
    pinnedItemType: "EVENT",
    typeId: string,
    productId: string
}

const useProduct = (item: any, edit?: boolean) => { 
    
    const [open, setOpen] = useState(false) 
    const toast = useToast()
    const { image, productdata, rentaldata } = useProductStore((state) => state);
    const router = useRouter()
    const param = useParams();
    const id = param?.slug; 

    const { fileUploadHandler, loading, uploadedFile, reset } = AWSHook();

    const validateItemProduct = (item: any) => {
        // List of required fields
        const requiredFields = [
            "creatorID",
            "name",
            "description",
            "price",
            "category",
            "quantity",
        ];

        // Check each field
        for (const field of requiredFields) {
            if (item[field] === "" || item[field] === null || item[field] === undefined) {
                return false; // Field is empty
            }

            // Special check for arrays (e.g., images)
            if (Array.isArray(item[field]) && item[field].length === 0) {
                return false; // Array is empty
            }
            console.log(field);
        }

        return true; // All fields are valid
    }; 

    const removeEmptyValues = (obj: any) => {
        const newObj: any = {};

        for (const key in obj) {
            // Check if the value is not empty
            if (
                obj[key] !== "" && // Exclude empty strings
                obj[key] !== null && // Exclude null
                obj[key] !== undefined && // Exclude undefined
                !(Array.isArray(obj[key]) && obj[key].length === 0) // Exclude empty arrays
            ) {
                newObj[key] = obj[key]; // Add non-empty values to the new object
            }
        }

        return newObj;
    };

    const handleSubmitService = (e: any) => {
        e.preventDefault();

        if (image.length === 0) {
            toast({
                title: "error",
                description: "Please Select An Image For Your Product",
                status: "error",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
        } else {

            if (validateItemProduct(item)) {

                console.log("Item is valid. Submitting...");
                fileUploadHandler(image)
                setOpen(true)
                // Proceed with form submission

            } else {

                toast({
                    title: "error",
                    description: "Please fill all fields.",
                    status: "error",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
                console.log("Item has empty fields. Please fill all fields.");
            }
        }
    };

    const handleEditSubmitService = (e: any) => {
        e.preventDefault();
        if (image.length === 0) {
            editService?.mutate(removeEmptyValues(item))
        } else {
            console.log("Item is valid. Submitting...");
            fileUploadHandler(image)
            setOpen(true)
        } 
    };
 
    const createService = useMutation({
        mutationFn: (data: {
            "creatorID": "",
            "name": "",
            "description": "",
            "images": [
                ""
            ],
            "price": null,
            "category": "",
            "quantity": null,
            "hasDiscount": true,
            "discountPrice": null,
            "publish": true
        }) =>
            httpService.post(
                `/products/create`, data
            ),
        onSuccess: (data: any) => {
            toast({
                title: "Created Product Successfully",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            reset()
        },
        onError: () => { },
    });

    const editService = useMutation({
        mutationFn: (data: {
            payload: {
                "name": "",
                "description": "",
                "images": [
                    ""
                ],
                "price": null,
                "category": "",
                "quantity": null,
                "hasDiscount": true,
                "discountPrice": null,
            }, id: string
        }) =>
            httpService.patch(
                `/products/${data?.id}`, data?.payload
            ),
        onSuccess: (data: any) => {
            toast({
                title: "Editing Product Successfully",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            reset()
            router?.push("/dashboard/product/kiosk?type=mykiosk")
        },
        onError: () => { },
    });   

    useEffect(() => {
        if (uploadedFile?.length > 0) { 
                if (edit) {
                    editService?.mutate(removeEmptyValues({ ...item, payload: {...item?.payload, images: [...productdata?.images, ...uploadedFile]} })) 
                } else {
                    createService?.mutate(removeEmptyValues({ ...item, images: uploadedFile }))
                } 
        }
    }, [uploadedFile])

    return { 
        open,
        setOpen, 
        handleEditSubmitService,
        handleSubmitService
    }
}
export default useProduct