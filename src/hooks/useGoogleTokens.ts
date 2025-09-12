import { useSession, getSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

interface GoogleTokens {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
}

interface UseGoogleTokensReturn {
    tokens: GoogleTokens | null;
    isLoading: boolean;
    error: string | null;
    refreshTokens: () => Promise<GoogleTokens | null>;
    sendTokensToBackend: (tokens: GoogleTokens) => Promise<void>;
}

/**
 * Custom hook for managing Google OAuth tokens from NextAuth
 * Provides easy access to tokens and utility functions
 */
export const useGoogleTokens = (): UseGoogleTokensReturn => {
    const { data: session, status } = useSession();
    const [tokens, setTokens] = useState<GoogleTokens | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Extract tokens from session
    const extractTokensFromSession = useCallback((sessionData: any): GoogleTokens | null => {
        if (sessionData?.token) {
            return {
                accessToken: sessionData.token.accessToken,
                idToken: sessionData.token.idToken,
                refreshToken: sessionData.token.refreshToken
            };
        }
        return null;
    }, []);

    // Update tokens when session changes
    useEffect(() => {
        if (session) {
            const extractedTokens = extractTokensFromSession(session);
            setTokens(extractedTokens);
            setError(null);
        } else {
            setTokens(null);
        }
    }, [session, extractTokensFromSession]);

    // Refresh tokens by getting fresh session
    const refreshTokens = useCallback(async (): Promise<GoogleTokens | null> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const freshSession = await getSession();
            const freshTokens = extractTokensFromSession(freshSession);
            setTokens(freshTokens);
            return freshTokens;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to refresh tokens';
            setError(errorMessage);
            console.error('Error refreshing tokens:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [extractTokensFromSession]);

    // Send tokens to your backend API
    const sendTokensToBackend = useCallback(async (tokensToSend: GoogleTokens): Promise<void> => {
        try {
            const response = await fetch('/api/auth/store-tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tokensToSend),
            });

            if (!response.ok) {
                throw new Error('Failed to send tokens to backend');
            }

            console.log('Tokens successfully sent to backend');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send tokens';
            setError(errorMessage);
            console.error('Error sending tokens to backend:', err);
            throw err;
        }
    }, []);

    return {
        tokens,
        isLoading: isLoading || status === 'loading',
        error,
        refreshTokens,
        sendTokensToBackend
    };
};

// Utility function to make authenticated Google API calls
export const makeGoogleApiCall = async (accessToken: string, endpoint: string) => {
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Google API call failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Google API call error:', error);
        throw error;
    }
};

// Example: Get user profile from Google API
export const getGoogleUserProfile = async (accessToken: string) => {
    return makeGoogleApiCall(accessToken, 'https://www.googleapis.com/oauth2/v2/userinfo');
};

// Example: Get user's Google Drive files
export const getGoogleDriveFiles = async (accessToken: string) => {
    return makeGoogleApiCall(accessToken, 'https://www.googleapis.com/drive/v3/files');
};