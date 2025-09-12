import { useState } from 'react'
import { URLS } from '@/services/urls';
import httpService from '@/utils/httpService';
import { AxiosError } from 'axios';
import image from 'next/image';
import { useMutation } from 'react-query';
import { useToast } from '@chakra-ui/react';
import Resizer from 'react-image-file-resizer';

const AWSHook = () => {
    const [loading, setLoading] = useState(false)
    const [loadingCompress, setLoadingCompress] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<Array<any>>([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const toast = useToast()
    const userId = localStorage.getItem('user_id') + "";


    // Upload Image
    const uploadImage = useMutation({
        mutationFn: (data: {
            file: any,
            payload: any
        }) => httpService.post(URLS.UPLOAD_IMAGE_ARRAY + "/" + userId, data?.payload,
            {
                headers: {
                    'Content-Type': "multipart/form-data",
                },
                onUploadProgress: (progressEvent: any) => {
                    const percentage = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentage); // Update progress
                },
            }
        ),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: any) => {
            console.log(data?.data);
            setLoading(false)
            const fileArray = Object.values(data?.data);

            console.log(fileArray);

            // let urls = fileArraymap((r: any) => ({ file: r.Key, url: r.Location }));
            // results.
            setUploadedFile([...fileArray]);
        }
    });

    const compressVideo = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.playsInline = true;
            video.muted = false;
            video.controls = true;

            const url = URL.createObjectURL(file);
            video.src = url;

            video.onloadedmetadata = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;

                const audioCtx = new AudioContext();
                const audioDestination = audioCtx.createMediaStreamDestination();
                const audioSource = audioCtx.createMediaElementSource(video);
                audioSource.connect(audioDestination);
                audioSource.connect(audioCtx.destination);

                const stream = canvas.captureStream();
                stream.addTrack(audioDestination.stream.getAudioTracks()[0]);

                canvas.width = (video.videoWidth * 720) / video.videoHeight;
                canvas.height = 720;

                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm;codecs=vp8,opus',
                    videoBitsPerSecond: 2500000
                });

                const chunks: Blob[] = [];
                mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const compressedFile = new File([blob], file.name, { type: 'video/webm' });
                    URL.revokeObjectURL(url);
                    resolve(compressedFile);
                };

                mediaRecorder.start();
                video.play();
                video.muted = true;

                const processFrame = () => {
                    if (video.ended) {
                        mediaRecorder.stop();
                        return;
                    }
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    requestAnimationFrame(processFrame);
                };

                video.onplay = () => requestAnimationFrame(processFrame);
            };

            video.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Video load failed'));
            };
        });
    };

    const resizeImage = (file: any): void => {
        const maxWidth = 1920; // adjust based on image use case
        const maxHeight = 1920;
        const quality = 80; // Try 100 for best quality, lower for smaller size

        Resizer.imageFileResizer(
            file,
            maxWidth,
            maxHeight,
            'JPEG',
            quality,
            0,
            (uri: File | Blob | any) => {
                const resizedFile = uri as File;

                // Check file size
                if (resizedFile.size / 1024 <= 800) {
                    //   setResizedImage(resizedFile);
                    return resizedFile
                } else {
                    console.warn('Still larger than 800KB. Try reducing quality or dimensions.');
                }
            },
            'file' // returns a File object
        );
    };

    const fileUploadHandler = async (files: any) => {
        setLoading(true);
        setLoadingCompress(true);
        const processedFiles = [];
        try {
            for (const item of files) {  
                processedFiles.push(item); 
            }
            const fd = new FormData();
            processedFiles.forEach((file) => {
                fd.append("files[]", file);
            });

            uploadImage.mutate({
                file: processedFiles,
                payload: fd
            });

        } catch (error) {
            console.error("Error:", error);
            toast({
                title: 'Error',
                description: 'File processing failed: ' + (error as Error).message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        } finally {
            setLoadingCompress(false);
        }
    };

    const reset = () => {
        setUploadedFile([]);
    }

    const deleteFile = (index: number) => {
        setUploadedFile(prev => prev.filter((_, i) => index !== i));
    }


    return ({ loadingCompress, loading, uploadedFile, fileUploadHandler, reset, deleteFile, uploadProgress, setUploadProgress })
}

export default AWSHook 
