import { useSession, getSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';

/**
 * Client-side token utilities for Google OAuth
 * Provides multiple ways to access tokens from the client-side
 */

export interface GoogleTokens {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
}

/**
 * Get tokens from current session (hook-based)
 * Use this in React components
 */
export const useClientTokens = () => {
    const { data: session, status } = useSession();
    const [tokens, setTokens] = useState<GoogleTokens | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.token) {
            const extractedTokens: GoogleTokens = {
                accessToken: session.token.accessToken,
                idToken: session.token.idToken,
                refreshToken: session.token.refreshToken
            };
            setTokens(extractedTokens);
            setIsReady(true);
        } else if (status === 'unauthenticated') {
            setTokens(null);
            setIsReady(true);
        }
    }, [session, status]);

    const getAccessToken = useCallback(() => {
        return tokens?.accessToken || null;
    }, [tokens]);

    const getIdToken = useCallback(() => {
        return tokens?.idToken || null;
    }, [tokens]);

    const getRefreshToken = useCallback(() => {
        return tokens?.refreshToken || null;
    }, [tokens]);

    const getAllTokens = useCallback(() => {
        return tokens;
    }, [tokens]);

    const isAuthenticated = status === 'authenticated';
    const hasTokens = !!(tokens?.accessToken);

    return {
        tokens,
        isReady,
        isAuthenticated,
        hasTokens,
        status,
        getAccessToken,
        getIdToken,
        getRefreshToken,
        getAllTokens
    };
};

/**
 * Get tokens from session (async function)
 * Use this in event handlers or async functions
 */
export const getClientTokens = async (): Promise<GoogleTokens | null> => {
    try {
        const session = await getSession();
        if (session?.token) {
            return {
                accessToken: session.token.accessToken,
                idToken: session.token.idToken,
                refreshToken: session.token.refreshToken
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting client tokens:', error);
        return null;
    }
};

/**
 * Get specific token type from session
 */
export const getAccessToken = async (): Promise<string | null> => {
    const tokens = await getClientTokens();
    return tokens?.accessToken || null;
};

export const getIdToken = async (): Promise<string | null> => {
    const tokens = await getClientTokens();
    return tokens?.idToken || null;
};

export const getRefreshToken = async (): Promise<string | null> => {
    const tokens = await getClientTokens();
    return tokens?.refreshToken || null;
};

/**
 * Make authenticated API call to Google services
 */
export const makeAuthenticatedGoogleApiCall = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error('No access token available. User may not be authenticated.');
    }

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    return fetch(endpoint, {
        ...options,
        headers
    });
};

/**
 * Get user profile from Google API
 */
export const getGoogleUserProfile = async () => {
    try {
        const response = await makeAuthenticatedGoogleApiCall(
            'https://www.googleapis.com/oauth2/v2/userinfo'
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch user profile: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Google user profile:', error);
        throw error;
    }
};

/**
 * Send tokens to your backend API
 */
export const sendTokensToBackend = async (endpoint: string = '/api/auth/store-tokens') => {
    const tokens = await getClientTokens();

    if (!tokens) {
        throw new Error('No tokens available to send');
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokens)
    });

    if (!response.ok) {
        throw new Error(`Failed to send tokens to backend: ${response.statusText}`);
    }

    return await response.json();
};

/**
 * Validate if tokens are available and not expired
 */
export const validateTokens = async (): Promise<boolean> => {
    try {
        const tokens = await getClientTokens();

        if (!tokens?.accessToken) {
            return false;
        }

        // Test the token by making a simple API call
        const response = await makeAuthenticatedGoogleApiCall(
            'https://www.googleapis.com/oauth2/v2/userinfo'
        );

        return response.ok;
    } catch (error) {
        console.error('Token validation failed:', error);
        return false;
    }
};

/**
 * Token debugging utility
 */
export const debugTokens = async () => {
    const tokens = await getClientTokens();

    console.group('🔐 Token Debug Information');
    console.log('Tokens available:', !!tokens);
    console.log('Access Token:', tokens?.accessToken ? '✅ Present' : '❌ Missing');
    console.log('ID Token:', tokens?.idToken ? '✅ Present' : '❌ Missing');
    console.log('Refresh Token:', tokens?.refreshToken ? '✅ Present' : '❌ Missing');

    if (tokens?.accessToken) {
        console.log('Access Token (first 20 chars):', tokens.accessToken.substring(0, 20) + '...');
    }

    if (tokens?.idToken) {
        try {
            // Decode JWT payload (without verification)
            const payload = JSON.parse(atob(tokens.idToken.split('.')[1]));
            console.log('ID Token payload:', payload);
        } catch (error) {
            console.log('Could not decode ID token:', error);
        }
    }

    console.groupEnd();

    return tokens;
};


// Export types
export type { GoogleTokens as GTokens };

// Default export for convenience
export default {
    useClientTokens,
    getClientTokens,
    getAccessToken,
    getIdToken,
    getRefreshToken,
    makeAuthenticatedGoogleApiCall,
    getGoogleUserProfile,
    sendTokensToBackend,
    validateTokens,
    debugTokens,
};