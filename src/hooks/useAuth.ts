"use client"
import { useDetails } from "@/global-state/useUserDetails";
import { URLS } from "@/services/urls";
import { signInValidation, signUpValidation } from "@/services/validations";
import httpServiceGoogle from "@/utils/httpServiceGoogle";
import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { useForm } from "./useForm";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import httpService, { unsecureHttpService } from "@/utils/httpService";
import moment from "moment";

const useAuth = () => {
    
    const toast = useToast();
    const router = useRouter();
    const { setAll } = useDetails((state) => state);
    const [phone, setPhone] = useState("");
    const [month, setmonth] = useState("");
    const [monthNumber, setmonthNumber] = useState(-1);
    const [day, setday] = useState("");
    const [year, setyear] = useState("");
    const [dob, setdate] = useState("");
    const [terms, setTerms] = useState(false);
    const [code, setCode] = useState('');
    const [initialTime, setInitialTime] = useState(0);
    const [startTimer, setStartTimer] = useState(false);
    const query = useSearchParams();
    const id = query?.get('affiliate');
    const type = query?.get('type');
    const typeID = query?.get('typeID');
    const pathname = usePathname()
    const param = useParams();

    let email = localStorage.getItem('email')?.toString();
 
    const { mutate, isLoading, isSuccess } = useMutation({
        mutationFn: (info) => httpServiceGoogle.post(`${URLS.LOGIN}`, info),
        onError: (error) => {
            toast({
                title: 'An error occured',
                description: 'Invalid email or password',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data) => {
            toast({
                title: data?.data?.message ? 'Error' : 'Success',
                description: data?.data?.message ? data?.data?.message : 'Login successful',
                status: data?.data?.message ? "error" : 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });

            if (data?.data?.message === "This email is not verified") {
                router.push('/auth/verify-account');
            } else {

                setAll({
                    firstName: data?.data?.firstName,
                    lastName: data?.data?.firstName,
                    username: data?.data?.user_name,
                    userId: data?.data?.user_id,
                })

                localStorage.setItem('token', data?.data?.access_token);
                localStorage.setItem('refresh_token', data?.data?.refresh_token);
                localStorage.setItem('user_id', data?.data?.user_id);
                localStorage.setItem('expires_in', data?.data?.expires_in);

                if (pathname?.includes("share")) {
                    if (type === "EVENT") {
                        router.push(`/dashboard/event/details/${id ? `${id}?type=affiliate` : typeID}`);
                    } else if (type === "DONATION") {
                        router.push(`/dashboard/donation/${typeID}`);
                    } else if (type === "RENTAL") {
                        router.push(`/dashboard/kisok/details-rental/${typeID}`);
                    } else if (type === "SERVICE") {
                        router.push(`/dashboard/kisok/service/${typeID}`);
                    } else if (type === "KIOSK") {
                        router.push(`/dashboard/kisok/details/${typeID}`);
                    } else {
                        router.push(`/share?type=${type}&typeID=${typeID}`);
                    }  
                } else {
                    router.push('/dashboard/product')
                }
            }

        }

    });

    const { mutate: signUp, isLoading: signupLoading, isSuccess: signupSuccess } = useMutation({
        mutationFn: (data) => unsecureHttpService.post(`${URLS.SIGNUP}`, data),
        onError: (error: any) => {
            toast({
                title: "An error occured",
                description: error.response.data,
                status: "error",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
        },
        onSuccess: (data) => {

        },
    });


    const formatDate = (item: any, name: string) => {
        const listofmonth = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        if (name === "month") {
            if (item) {
                if (year && day) {
                    setdate(
                        [
                            year,
                            listofmonth.indexOf(item) + 1 > 9
                                ? listofmonth.indexOf(item) + 1
                                : "0" + (listofmonth.indexOf(item) + 1),
                            day,
                        ].join("-"),
                    );
                } else {
                    setdate("")
                }
                setmonthNumber((listofmonth.indexOf(item) + 1))
                setmonth(item);
            } else {
                setmonthNumber(-1)
                setdate("")
                setmonth("");
                setday("")
            }
        } else if (name === "year") {
            if (item) {
                if (month && day) {
                    setdate(
                        [
                            item,
                            listofmonth.indexOf(month) + 1 > 9
                                ? listofmonth.indexOf(month) + 1
                                : "0" + (listofmonth.indexOf(month) + 1),
                            day,
                        ].join("-"),
                    );
                } else {
                    setdate("")
                }
                setyear(item);
            } else {
                setdate("")
                setyear("");
            }
        } else {
            if (item) {
                if (year && month) {
                    setdate(
                        [
                            year,
                            listofmonth.indexOf(month) + 1 > 9
                                ? listofmonth.indexOf(month) + 1
                                : "0" + (listofmonth.indexOf(month) + 1),
                            item,
                        ].join("-"),
                    );
                } else {
                    setdate("")
                }
                setday(item);
            } else {
                setdate("")
                setday("");
            }
        }
    };


    const { mutate: verifyToken, isLoading: loadingVerify, isSuccess: verifySuccess } = useMutation({
        mutationFn: (data: { token: string }) => httpService.post(`${URLS.VERIFY_TOKEN}`, data),
        onError: (error: any) => {
            toast({
                title: 'An error occured',
                description: error.response.data.statusDescription,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: 'verification successful',
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        }
    });

    const hanldeSubmit = useCallback(() => {
        verifyToken({ token: code })
    }, [code, verifyToken])


    const { renderForm, values } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
        validationSchema: signInValidation,
        submit: (data: any) => mutate(data)
    });

    const {
        renderForm: signupForm,
        values: signupValue,
        formState: { isValid },
        watch,
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            // dob: '',
            email: "",
            confirmPassword: "",
        },
        validationSchema: signUpValidation,
        submit: (data) => {
            if (!terms) {
                toast({
                    title: "Attention!",
                    description: "You must accept our terms of service to continue",
                    status: "warning",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
                return;
            }
            if (phone.length < 11) {
                toast({
                    title: "Attention!",
                    description: "You must put in a valid phone number",
                    status: "warning",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
                return;
            }
            if (!dob) {
                toast({
                    title: "Attention!",
                    description: "You must fillin your date of birth",
                    status: "warning",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
                return;
            }
            const ageLimit = moment().subtract(18, "years");
            if (moment(dob).isAfter(ageLimit)) {
                toast({
                    title: "Attention!",
                    description: "You must be upto 18 years old",
                    status: "warning",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
                return;
            }

            if (watchEmail) {
                localStorage.setItem('email', watchEmail);
                signUp({ ...data, phone, dob });

            } else {
                toast({
                    title: "Attention!",
                    description: "You must fill in your email",
                    status: "warning",
                    isClosable: true,
                    duration: 5000,
                    position: "top-right",
                });
            }
        },
    });

    const { isLoading: sendingVerify, mutate: sendVerify, isSuccess: sendSuccess } = useMutation({
        mutationFn: (data: string) => unsecureHttpService.post(`${URLS.SEND_VERIFICATION_EMAIL}`, {
            userEmail: data,
            emailType: 1,
        }),
        onError: (error: any) => {
            toast({
                title: 'An error occured',
                description: error.response.data.error,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'A verification code has been sent to your email',
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            setStartTimer(true)
            setInitialTime(59)
        }
    });

    const watchEmail = watch("email"); 

    return {
        renderForm,
        isLoading,
        isSuccess,
        formatDate,
        signupForm,
        signupLoading,
        year,
        month,
        day,
        monthNumber,
        signupValue,
        dob,
        signupSuccess,
        setPhone,
        phone,
        setCode,
        code,
        hanldeSubmit,
        loadingVerify,
        verifySuccess,
        email,
        setTerms,
        terms,
        sendSuccess,
        sendVerify,
        sendingVerify,
        initialTime,
        setInitialTime,
        startTimer,
        setStartTimer
    };
}

export default useAuth