"use client"
import httpService from "@/utils/httpService";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import AWSHook from "./awsHook";
import useProductStore from "@/global-state/useCreateProduct";
import usePaystackStore from "@/global-state/usePaystack";
import { IProduct } from "@/models/product";
import { AxiosError, AxiosResponse } from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export interface IPinned {
    pinnedItemType: "EVENT",
    typeId: string,
    productId: string
}

const useProduct = (item?: any, rental?: boolean, edit?: boolean, service?: boolean) => {
    
    const [openRental, setOpenRental] = useState(false)
    const [openProduct, setOpenProduct] = useState(false)
    const [open, setOpen] = useState(false)
    const [singleProductData, setSingleProductData] = useState({} as IProduct)
    const [openSucces, setOpenSucces] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [addressId, setAddressId] = useState("")
    const [addressDefault, setAddressDefault] = useState("")
    const userId = localStorage.getItem('user_id');
    const PAYSTACK_KEY: any = process.env.NEXT_PUBLIC_PAYSTACK_KEY;
    const toast = useToast()
    const { image, productdata, rentaldata } = useProductStore((state) => state);
    const router = useRouter()
    const param = useParams();
    const id = param?.slug;

    const { configPaystack, setPaystackConfig, message, setMessage, setDataID, dataID } = usePaystackStore((state) => state);

    const query = useQueryClient()
    const [payload, setPayload] = useState<any>({ 
        "lga": "",
        "phone": "",
        "landmark": "",
        "userId": userId,
        "isDefault": true
    })

    const [reviewPayload, setReviewPayload] = useState<{
        "userId": any,
        "description": string,
        "typeId": string,
        "reviewType": string,
        "rating": number
    }>({
        "userId": userId,
        "description": "",
        "typeId": "",
        "reviewType": "PRODUCT",
        "rating": 0
    })

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

    const validateItemRental = (item: any) => {
        // List of required fields
        const requiredFields = [
            "userId",
            "name",
            "description",
            "price",
            "category",
            "location",
            "maximiumNumberOfDays"
        ];

        // Check each field
        for (const field of requiredFields) {
            if (item[field] === "" || item[field] === null || item[field] === undefined) {
                return false; // Field is empty
            }
            console.log(field);

            // Special check for arrays (e.g., images)
            if (Array.isArray(item[field]) && item[field].length === 0) {
                return false; // Array is empty
            }
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

    const handleSubmitProduce = (e: any) => {
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
                setOpenProduct(true)
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

    const handleEditSubmitProduce = (e: any) => {
        e.preventDefault();
        if (image.length === 0) {
            editProduct?.mutate(removeEmptyValues(item?.payload))
        } else {
            console.log("Item is valid. Submitting...");
            fileUploadHandler(image)
            setOpenRental(true)
        } 
    };

    const handleEditSubmitRental = (e: any) => {
        e.preventDefault();
        if (image.length === 0) {
            editRental?.mutate(removeEmptyValues(item))
        } else {
            console.log("Item is valid. Submitting...");
            fileUploadHandler(image)
            setOpenRental(true)
        } 
    };

    const handleSubmitRental = (e: any) => {
        e.preventDefault();
        if (image.length === 0) {
            toast({
                title: "error",
                description: "Please Select An Image For Your Rental",
                status: "error",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });

        } else if (validateItemRental(item)) {

            console.log("Item is valid. Submitting...");
            fileUploadHandler(image)
            setOpenRental(true)
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
    };

    const createProduct = useMutation({
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

    const editProduct = useMutation({
        mutationFn: (data: {
                "name": "",
                "description": "",
                "images": [],
                "price": null,
                "category": "",
                "quantity": null,
                "hasDiscount": true,
                "discountPrice": null,
        }) =>
            httpService.patch(
                `/products/${id}`, data
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

    const createRental = useMutation({
        mutationFn: (data: {
            "userId": "",
            "name": "",
            "description": "",
            "category": "",
            "location": "",
            "maximiumNumberOfDays": null,
            "price": null,
            "images": []
        }) =>
            httpService.post(
                `/rental/create`, data
            ),
        onSuccess: (data: any) => {

            toast({
                title: "Created Rental Successfully",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            setOpenSucces(true)
        },
        onError: () => { },
    });


    const editRental = useMutation({
        mutationFn: (data: { 
            "name": "",
            "description": "",
            "category": "",
            "location": "",
            "maximiumNumberOfDays": null,
            "price": null,
            "images": []
        }) =>
            httpService.put(
                `/rental/update/${id}`, data
            ),
        onSuccess: (data: any) => {

            toast({
                title: "Editing Rental Successfully",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            setOpenSucces(true)
            setOpenRental(true)
        },
        onError: () => { },
    });

    const deleteAddress = useMutation({
        mutationFn: () =>
            httpService.delete(
                `/addresses/delete/${addressId}`
            ),
        onSuccess: () => {
            setOpenDelete(false)
            query.invalidateQueries("addressuser")
        },
        onError: () => { },
    });

    const editAddress = useMutation({
        mutationFn: (data: any) =>
            httpService.put(
                `/addresses/update/${addressId}`, data
            ),
        onSuccess: (data: any) => {
            setPayload({
                "state": "",
                "lga": "",
                "phone": "",
                "landmark": "",
                "userId": userId,
                "isDefault": false
            })
            setAddressId("")
            setOpen(false)
            query?.invalidateQueries("addressuser")
        },
        onError: () => { },
    });

    const updateAddress = useMutation({
        mutationFn: (data: {
            payload: any,
            id: string
        }) =>
            httpService.put(
                `/addresses/update/${data?.id}`, data?.payload
            ),
        onSuccess: (data: any) => {
            setOpen(false)
            query?.invalidateQueries("addressuser")
        },
        onError: () => { },
    });

    const createAddress = useMutation({
        mutationFn: (data: {
            "state": "",
            "phone": "",
            "userId": "",
            "location": {
            }
            "isDefault": true
        }) =>
            httpService.post(
                `/addresses/create`, data
            ),
        onSuccess: (data: any) => {
            toast({
                title: "Successful",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            setPayload({
                "state": "",
                "lga": "",
                "phone": "",
                "landmark": "",
                "userId": userId,
                "isDefault": true
            })
            setAddressId("")
            setOpen(false)
            query?.invalidateQueries("addressuser")
        },
        onError: () => { },
    });

    const createReview = useMutation({
        mutationFn: (data: any) =>
            httpService.post(
                `/reviews/create`, data
            ),
        onSuccess: () => {
            toast({
                title: "Successful",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            setReviewPayload({
                "userId": "",
                "description": "",
                "typeId": "",
                "reviewType": "PRODUCT",
                "rating": 0
            })
            setAddressId("")
            setOpen(false)
            query.invalidateQueries("review")
        },
        onError: () => { },
    });


    const payForTicket = useMutation({
        mutationFn: (data: {
            seller: string,
            price: number,
            currency: string,
            orderType: "ORDERS" | "RECEIPT" | "BOOKING",
            typeID: string
        }) => httpService.post(`/payments/createCustomOrder`, data),
        onSuccess: (data: any) => {
            setPaystackConfig({
                publicKey: PAYSTACK_KEY,
                email: data?.data?.content?.email,
                amount: (Number(data?.data?.content?.orderTotal) * 100), //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
                reference: data?.data?.content?.orderCode
            });

            if (rental) {
                setMessage({ ...message, rental: true })
            } else if (service) {
                setMessage({ ...message, service: true })
            } else {
                setMessage({ ...message, product: true })
            }
            setOpen(false)
        },
        onError: (error) => {
            // console.log(error);
            toast({
                title: 'Error',
                description: "Error occured",
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
    });

    const pinProduct = useMutation({
        mutationFn: (data: {
            pinnedItems: Array<IPinned>
        }) => httpService.post(`/pin-item/create`, data),
        onSuccess: (data: any) => {

            toast({
                title: 'Successful',
                description: "Pinned Successful",
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });

            console.log(data);
            query?.invalidateQueries("all-events-mesh")
            setOpen(false)

        },
        onError: (error) => {
            // console.log(error);
            toast({
                title: 'Error',
                description: "Error occured",
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
    });

    const createProductOrder = useMutation({
        mutationFn: (data: {
            "productId": string,
            "quantity": any,
            "total": any,
            "userId": string,
            "vendorId": string,
            "addressId": string,
            "color"?: string,
            "size"?: string
        }) =>
            httpService.post(
                `/orders/create`, data
            ),
        onSuccess: (data: any) => {
            console.log(data?.data);

            setDataID(data?.data?.id)

            payForTicket?.mutate({
                seller: data?.data?.vendor?.userId,
                price: Number(data?.data?.total),
                currency: "NGN",
                orderType: "ORDERS",
                typeID: data?.data?.id
            })
        },
        onError: () => { },
    });

    const updateRecipt = useMutation({
        mutationFn: (data: {
            payload: {
                status: "PENDING" | "ACCEPTED" | "CANCELLED",
            }
            id: string
        }) =>
            httpService.put(
                `/reciept/update/${data?.id}?status=${data?.payload?.status}`
            ),
        onSuccess: (data: any) => {
            console.log(data?.data);
            query?.invalidateQueries("getreciept")
            toast({
                title: "Successful",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            setOpen(false)
        },
        onError: () => { },
    });


    const updateReciptPrice = useMutation({
        mutationFn: (data: {
            payload: {
                price: any,
            }
            id: string
        }) =>
            httpService.put(
                `/reciept/update-price/${data?.id}?price=${data?.payload?.price}`
            ),
        onSuccess: (data: any) => {
            console.log(data?.data);
            query?.invalidateQueries("getreciept")
            toast({
                title: "Successful",
                description: "",
                status: "success",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            setOpen(false)
        },
        onError: () => { },
    });

    const createRentalRecipt = useMutation({
        mutationFn: (data: {
            "userID": string,
            "rentalID": string,
            "startDate": string,
            "endDate": string,
            "price": number,
            "addressedId": string,
            "approvalStatus": string,
            "frequency": number
        }) =>
            httpService.post(
                `/reciept/create`, data
            ),
        onSuccess: (data: any) => {
            console.log(data);
            setOpenSucces(true)
            router?.push("/dashboard/product/kiosk?type=myreciept")
        },
        onError: () => { },
    });

    useEffect(() => {
        if (uploadedFile?.length > 0) {
            if (!rental) { 
                
                if (edit) {
                    editProduct?.mutate(removeEmptyValues({ ...item?.payload, images: [...productdata?.images, ...uploadedFile]})) 
                } else {
                    createProduct?.mutate(removeEmptyValues({ ...item, images: uploadedFile }))
                }
            } else {
                if (edit) {
                    editRental?.mutate(removeEmptyValues({ ...item, images: [...rentaldata?.images, ...uploadedFile] }))
                } else {
                    createRental?.mutate(removeEmptyValues({ ...item, images: uploadedFile }))
                }
            }
        }
    }, [uploadedFile])

    return {
        handleSubmitProduce,
        createProduct,
        createRental,
        loading,
        handleSubmitRental,
        openRental,
        editRental,
        openProduct,
        setOpenProduct,
        setOpenRental,
        createAddress,
        editAddress,
        open,
        setOpen,
        payload,
        setPayload,
        userId,
        setAddressId,
        addressId,
        deleteAddress,
        openDelete,
        setOpenDelete,
        createProductOrder,
        setAddressDefault,
        addressDefault,
        configPaystack,
        setPaystackConfig,
        createReview,
        reviewPayload,
        setReviewPayload,
        handleEditSubmitProduce,
        updateAddress,
        createRentalRecipt,
        editProduct,
        openSucces,
        setOpenSucces,
        singleProductData,
        setSingleProductData,
        handleEditSubmitRental,
        message,
        dataID,
        updateRecipt,
        payForTicket,
        updateReciptPrice,
        pinProduct
    };

}
export default useProduct