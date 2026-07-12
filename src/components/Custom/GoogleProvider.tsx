"use client"
import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleAuthContext = React.createContext({} as any);

export const GoogleAuthProvider = (props: any) => {

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
            {props.children}
        </GoogleOAuthProvider>
    );
};

export const useGoogleAuth = () => React.useContext(GoogleAuthContext);