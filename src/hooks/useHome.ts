import { IUser } from "@/models/User";
import { URLS } from "@/services/urls";
import httpService from "@/utils/httpService";
import { useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import InfiniteScrollerComponent from "./infiniteScrollerComponent";
import AWSHook from "./awsHook";

interface ICreatePost {
    text: string,
    type: string,
    sourceId: string,
    isGroup?: boolean,
    isGroupFeed?: boolean,
    mediaRef?: string,
    multipleMediaRef?: any
}

const useHome = () => {

    const intObserver = React.useRef<IntersectionObserver>(null);
    // const [uploadProgress, setUploadProgress] = useState(0);
    const toast = useToast();
    const queryClient = useQueryClient();
    const [post, setPost] = React.useState("");
    const [liked, setLiked] = useState("")
    const [likeCount, setLikeCount] = useState(0)
    const [files, setFiles] = React.useState<File[]>([]);
    const [open, setOpen] = useState(false)

    const [deleteModal, setDeleteModal] = useState(false)


    const Id = localStorage.getItem('user_id');

    const { uploadedFile, fileUploadHandler, loadingCompress, loading: uploadingfile, reset, uploadProgress, setUploadProgress } = AWSHook();

    const { results: postData, isLoading: loadingPost, ref: postRef, isRefetching: refetchingPost, refetch } = InfiniteScrollerComponent({ url: URLS.GET_PUBLIC_POST, limit: 10, filter: "id" })

    const { isLoading, mutate: createPost, isSuccess } = useMutation({
        mutationFn: (data: ICreatePost) => httpService.post(`${URLS.CREATE_POST}`, data),
        onSuccess: () => {
            toast({
                title: "Post Created",
                description: "Your post has been created an is live",
                duration: 5000,
                status: "success",
                isClosable: true,
                position: "top-right",
            });

            setUploadProgress(0);
            setPost("");
            reset()
            setOpen(false)
            refetch()
            emptyFiles()
        },
        onError: () => {
            toast({
                title: "Error",
                description: "An eror occured while trying to create post",
                duration: 5000,
                status: "error",
                isClosable: true,
                position: "top-right",
            });
        },
    });

    const { mutate: likesHandle, isLoading: loadingLikes, isSuccess: likedSuccess } = useMutation({
        mutationFn: (data: string) => httpService.post(`${URLS.LIKE_POST}/${data}`),
        onSuccess: (data: any) => {
            //   queryClient.invalidateQueries([`getPostById-${post?.id}`]);
            setLiked(data?.data?.likeStatus)
            setLikeCount(data?.data?.likeCount)
        },
        retry: false,
        onError: () => { },
    });

    const handleLikedPost = React.useCallback((data: string) => {
        likesHandle(data)
    }, []);

    const { isLoading: deletingPost, mutate: deletePost } = useMutation({
        mutationFn: (data: string) => httpService.delete(`${URLS.DELETE_POST}/${data}`),
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Post deleted",
                status: "success",
                position: "top-right",
                duration: 4000,
                isClosable: true,
            });
            setDeleteModal(false)
            refetch()
        },
        onError: () => {
            toast({
                title: "Error",
                description: "An error occured while trying to delete post",
                status: "error",
                position: "top-right",
                duration: 4000,
                isClosable: true,
            });
        },
    });

    const handleImagePicked = React.useCallback((Files: FileList) => {
        const file = Files[0];
        // if (file.size > 314572800) {
        //     toast({
        //         title: 'Error',
        //         description: 'File size too large',
        //         position: 'top-right',
        //         status: 'error',
        //         duration: 5000,
        //         isClosable: true,
        //     });
        //     return;
        // }
        const arrs: File[] = [];
        for (let i = 0; i < Files.length; i++) {
            arrs.push(Files[i]);
        }
        setFiles(prev => [...prev, ...arrs]);
    }, [toast]);

    const emptyFiles = React.useCallback(() => {
        setFiles([]);
    }, []);

    const removeFile = (index: number) => {
        if (files.length === 1) {
            setFiles((prev) => prev.filter((_, i) => i !== index));
            // setStage(1);
            return;
        }
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }

    const createPostWithFiles = () => {
        // console.log(files);
        // if (files[0].size > 314572800) {
        //     toast({
        //         title: 'Warniing',
        //         description: 'File size must be less than or equal to 300MB',
        //         position: 'top-right',
        //         status: 'warning',
        //         duration: 5000,
        //         isClosable: true,
        //     });
        //     return
        // } else {
            console.log("working");
            fileUploadHandler(files as any);
            return;
        // }
    }


    React.useEffect(() => {
        if (uploadedFile.length > 0 && !uploadingfile && Id) {
            const obj = {
                text: post ?? "",
                type: files[0].type.startsWith('image') ? 'WITH_IMAGE' : 'WITH_VIDEO_POST',
                isGroupFeed: false,
                sourceId: Id,
                mediaRef: uploadedFile[0],
                multipleMediaRef: uploadedFile.map((item) => item),
            }
            createPost({ ...obj });
        }
    }, [files, uploadingfile, uploadedFile, Id, post])

    return {
        isLoading,
        createPost,
        isSuccess,
        postData,
        loadingPost,
        postRef,
        refetchingPost,
        refetch,
        loadingLikes,
        likesHandle,
        likedSuccess,
        setLiked,
        liked,
        setLikeCount,
        post,
        setPost,
        likeCount,
        handleImagePicked,
        files,
        setFiles,
        emptyFiles,
        removeFile,
        createPostWithFiles,
        uploadingfile,
        setOpen,
        open,
        deletingPost,
        deletePost,
        setDeleteModal,
        deleteModal,
        handleLikedPost,
        uploadProgress, 
        loadingCompress
    };
}

export default useHome