import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

interface GoogleTokens {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
}

/**
 * API route to handle Google OAuth tokens
 * This demonstrates server-side token access and storage
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Method 1: Get session on server-side
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Method 2: Get JWT token directly (alternative approach)
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });

        console.log('Server-side session tokens:', {
            accessToken: session.token?.accessToken,
            idToken: session.token?.idToken,
            refreshToken: session.token?.refreshToken
        });

        console.log('Server-side JWT token:', {
            accessToken: token?.accessToken,
            idToken: token?.idToken,
            refreshToken: token?.refreshToken
        });

        // Get tokens from request body (sent from client)
        const clientTokens: GoogleTokens = req.body;

        // Here you can:
        // 1. Store tokens in your database
        // 2. Make API calls to Google services
        // 3. Validate tokens
        // 4. Refresh expired tokens

        // Example: Store in database (pseudo-code)
        // await storeUserTokens(session.user.id, {
        //     accessToken: clientTokens.accessToken,
        //     idToken: clientTokens.idToken,
        //     refreshToken: clientTokens.refreshToken,
        //     updatedAt: new Date()
        // });

        // Example: Make a Google API call with the access token
        if (clientTokens.accessToken) {
            try {
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${clientTokens.accessToken}`,
                    },
                });

                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();
                    console.log('Google user info:', userInfo);

                    // You can store this user info in your database
                    // await updateUserProfile(session.user.id, userInfo);
                }
            } catch (error) {
                console.error('Error fetching Google user info:', error);
            }
        }

        res.status(200).json({
            message: 'Tokens processed successfully',
            email: session.user?.email
        });

    } catch (error) {
        console.error('Error processing tokens:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

/**
 * Utility function to refresh Google access token
 * Call this when your access token expires
 */
export async function refreshGoogleToken(refreshToken: string) {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const tokens = await response.json();
        return {
            accessToken: tokens.access_token,
            expiresIn: tokens.expires_in,
            tokenType: tokens.token_type,
        };
    } catch (error) {
        console.error('Error refreshing Google token:', error);
        throw error;
    }
}