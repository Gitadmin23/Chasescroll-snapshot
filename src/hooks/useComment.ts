import { useDetails } from "@/global-state/useUserDetails";
import { IUser } from "@/models/User";
import { URLS } from "@/services/urls";
import httpService from "@/utils/httpService";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import InfiniteScrollerComponent from "./infiniteScrollerComponent";
import { useToast } from "@chakra-ui/react";
import { IComment } from "@/models/MediaPost"; 
import useHome from "./useHome";

const useComment = () => {

    const [postID, setPostID] = useState("")
    const [commentsData, setCommentsData] = useState(Array<IComment>)
    const [commentsInput, setCommentsInput] = useState("")
    const [subCommentsInput, setSubCommentsInput] = useState("")
    const [liked, setLiked] = useState("")
    const [hasNextPage, setHasNextPage] = useState(true)
    const [size, setSize] = useState(10)
    const toast = useToast()

    const { refetch: refetchAllPost } = useHome()


    const { isLoading, isRefetching, refetch } = useQuery(
        [`getComments`, postID, size],
        () =>
            httpService.get(`${URLS.GET_ALL_COMMENTS}`, {
                params: {
                    size: size,
                    postID: postID,
                },
            }), 
        {
            enabled: postID !== null,
            onSuccess: (data) => {
                setCommentsData(data.data.content);
                setHasNextPage(data.data.last ? false : true);
            },
        },
    );



    const addComment = useMutation({
        mutationFn: (data: {
            postID: string, comment: string
        }) => httpService.post("/feed/add-comment", data),
        onSuccess: () => {
            refetch()
            refetchAllPost()
            setCommentsInput("");
            toast({
                title: "Success",
                description: "Comment added",
                duration: 5000,
                position: "top-right",
                status: "success",
                isClosable: true,
            });
        },
    });


    // mutate
    const createSubComment = useMutation({
        mutationFn: (data: {
            commentID: string,
            comment: string
        }) =>
            httpService.post(`${URLS.CREATE_SUB_COMMENT}`, data),
        onSuccess: (data) => {
            setSubCommentsInput("")
            toast({
                title: "Success",
                description: "Sub comment added",
                status: "success",
                position: "top-right",
                isClosable: true,
                duration: 5000,
            });
            refetch()
            refetchAllPost()
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "An error occured while adding sub comment",
                status: "error",
                position: "top-right",
                isClosable: true,
                duration: 5000,
            });
        },
    });


    const addCommentHandler = React.useCallback(async (data: { 
        postID: string, comment: string
    }) => {
        if (commentsInput !== "" && !addComment.isLoading) {
            addComment.mutate(data);
        };
    }, [commentsInput, addComment, postID]);

    const addSubCommentHandler = React.useCallback(async (data: {
        commentID: string,
        comment: string
    }) => {
        if (subCommentsInput !== "" && !createSubComment.isLoading) {
            createSubComment.mutate(data);
        };
    }, [subCommentsInput, createSubComment, postID]);

    // mutateion
    const likeSubComment = useMutation({
        mutationFn: (data: string) => httpService.post(`${URLS.LIKE_SUB_COMMENT}/${data}`),
        onSuccess: () => {
            refetch()
            refetchAllPost()
          // queryClient.invalidateQueries([`getSubcomments-${commentID}`]);
        //   setIsLiked((prev) => (prev === "LIKED" ? "NOT_LIKED" : "LIKED"));
        },
      });
  
      const deleteSubComment = useMutation({
        mutationFn: (data: string) => httpService.delete(`${URLS.DELETE_SUB_COMMENT}/${data}`),
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Deleted",
            status: "success",
            position: "top-right",
            isClosable: true,
            duration: 5000,
          });
          refetch()
          refetchAllPost()
        },
      });


    const likeComment = useMutation({
        mutationFn: (data: string) => httpService.post(`${URLS.LIKE_COMMENT}/${data}`),
        onSuccess: () => {
            console.log(liked);
            refetch()
            refetchAllPost()
            // queryClient.invalidateQueries([`getComments-${postID}`]);
            if (liked === "LIKED") {
                setLiked("NOT_LIKED");
            } else {
                setLiked("LIKED");
            }
        },
    });


    const deleteComment = useMutation({
        mutationFn: (data: string) => httpService.delete(`${URLS.DELETE_COMMENT}/${data}`),
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Comment deleted",
                status: "success",
                position: "top-right",
                isClosable: true,
                duration: 5000,
            });
            refetch()
            refetchAllPost()
        },
    });

    return {
        setPostID,
        hasNextPage,
        commentsData,
        setSize,
        isLoading,
        isRefetching,
        addComment,
        addCommentHandler,
        setSubCommentsInput,
        subCommentsInput,
        commentsInput,
        setCommentsInput,
        addSubCommentHandler,
        createSubComment,
        likeComment,
        deleteComment,
        liked, 
        setLiked,
        likeSubComment,
        deleteSubComment
    };
}

export default useComment