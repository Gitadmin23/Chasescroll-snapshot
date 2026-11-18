"use client";

import {
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import httpService from "@/services/httpService";
import { URLS } from "@/services/urls";
import { toaster } from "@/components/ui/toaster";
import useForm from "@/hooks/useForm";
import { loginSchema } from "@/services/validation";
import CustomInput from "../../CustomInput";
import { STORAGE_KEYS } from "@/utils/StorageKeys";
import { ticketurchaseStepAtom } from "@/states/activeTicket";
import { useAtom } from "jotai";
import { IUser } from "@/models/User";
import useCustomTheme from "@/hooks/useTheme";

interface LoginModalProps {
  onLoggedIn: () => void;
  callbackUrl: string;
}

function LoginModal({ onLoggedIn, callbackUrl }: LoginModalProps) {
  const { data: session, status } = useSession();
  const [, setCurrentStep] = useAtom(ticketurchaseStepAtom);
  const { primaryColor } = useCustomTheme();

  const getPublicProfile = useMutation({
    mutationFn: (userId: any) =>
      httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${userId}`),
    onError: () => {
      onLoggedIn();
    },
    onSuccess: (data) => {
      const details: IUser = data?.data;
      if (details && typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEYS.USER_DETAILS, JSON.stringify(details));
      }
      onLoggedIn();
    },
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (data: any) => httpService.post(`${URLS.auth}/signin`, data),
    onError: (error: any) => {
      toaster.create({
        title: "Login failed",
        description: error?.response?.data?.message || error?.message || "Invalid credentials",
        type: "error",
      });
    },
    onSuccess: (data) => {
      const accessToken = data?.data?.access_token;
      const refreshToken = data?.data?.refresh_token;
      const userId = data?.data?.user_id;

      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEYS.USER_ID, userId);
        sessionStorage.setItem("user_id", userId);
        sessionStorage.setItem(STORAGE_KEYS.token, accessToken);
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
        sessionStorage.setItem("refresh_token", refreshToken);
      }
      getPublicProfile.mutate(userId);
    },
  });

  const googleAuth = useMutation({
    mutationFn: async (data: any) =>
      httpService.get(`${URLS.auth}/signinWithCredentials`, {
        headers: {
          Authorization: `Bearer ${data}`,
        },
      }),
    onError: (error: any) => {
      toaster.create({
        title: "Login failed",
        description: error?.message || "Invalid credentials",
        type: "error",
      });
    },
    onSuccess: (data) => {
      const accessToken = data?.data?.access_token;
      const refreshToken = data?.data?.refresh_token;
      const userId = data?.data?.user_id;

      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEYS.USER_ID, userId);
        sessionStorage.setItem("user_id", userId);
        sessionStorage.setItem(STORAGE_KEYS.token, accessToken);
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
        sessionStorage.setItem("refresh_token", refreshToken);
        sessionStorage.setItem(STORAGE_KEYS.GOOGLE_AUTH, "GOOGLE");
      }
      getPublicProfile.mutate(userId);
    },
  });

  const { renderForm } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: (data) => {
      loginMutation(data);
    },
    validationSchema: loginSchema,
  });

  const handleGoogleSignIn = async () => {
    try {
      if (status === "authenticated") {
        const idToken = session.token?.idToken;
        googleAuth.mutate(idToken);
        return;
      }
      const result = await signIn("google", {
        callbackUrl,
      });

      if (result?.ok) {
        localStorage.setItem(STORAGE_KEYS.GOOGLE_AUTH, "GOOGLE");
      }
    } catch {
      toaster.create({
        title: "An error occurred",
        description: "Failed to sign in with Google",
        type: "error",
      });
    }
  };

  const isLoading =
    isPending || getPublicProfile.isPending || googleAuth.isPending;

  return renderForm(
    <Box w="full" maxW="400px" bg="white" borderRadius="2xl" p={[4, 6]} mx="auto">
      <VStack gap={5} align="stretch">
        {/* Header */}
        <VStack gap={1} textAlign="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Sign In to Chasescroll
          </Text>
          <Text fontSize="xs" color="gray.500">
            Log in to continue with your ticket checkout
          </Text>
        </VStack>

        {/* Login Form */}
        <VStack gap={3.5} align="stretch">
          <Box w="full">
            <CustomInput
              label="Username or Email"
              type="text"
              name="username"
              placeholder="Enter your username or email"
              isPassword={false}
            />
          </Box>

          <Box w="full">
            <CustomInput
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              isPassword={true}
            />
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            w="full"
            h="46px"
            bgColor="primaryColor"
            color="white"
            borderRadius="full"
            fontSize="sm"
            fontWeight="semibold"
            loading={isLoading}
            loadingText="Signing in..."
            _hover={{ opacity: 0.9 }}
            transition="all 0.2s"
            mt="2"
          >
            Sign In
          </Button>

          {/* Divider */}
          <HStack w="full" my={1} justifyContent="center" alignItems="center">
            <Box flex="1" borderBottomWidth="1px" borderColor="gray.200" />
            <Text fontSize="xs" color="gray.400" px={2}>
              or
            </Text>
            <Box flex="1" borderBottomWidth="1px" borderColor="gray.200" />
          </HStack>

          {/* Google Sign In */}
          <Button
            w="full"
            h="46px"
            bg="gray.50"
            borderWidth="1px"
            borderColor="gray.200"
            color="gray.700"
            borderRadius="full"
            fontSize="xs"
            fontWeight="medium"
            onClick={handleGoogleSignIn}
            _hover={{ bg: "gray.100" }}
          >
            <Image
              src="/images/googleicon.png"
              alt="Google"
              w="18px"
              h="18px"
              mr="2"
            />
            Continue with Google
          </Button>
        </VStack>

        {/* Footer info */}
        <HStack justifyContent="center" gap="1.5">
          <Text color="gray.400" fontSize="11px">
            Don't want to sign in?
          </Text>
          <Text
            color="primaryColor"
            fontSize="11px"
            fontWeight="600"
            cursor="pointer"
            onClick={() => setCurrentStep(2)}
          >
            Use Guest Checkout
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}

export default LoginModal;
