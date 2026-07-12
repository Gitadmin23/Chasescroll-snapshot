import NextAuth, { AuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

// Extend the built-in session types
declare module 'next-auth' {
    interface Session {
        token?: {
            accessToken?: string;
            idToken?: string;
            refreshToken?: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        idToken?: string;
        refreshToken?: string;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        signIn: async ({ user, account }) => {
            // Allow sign in
            console.log('Sign in callback - Account:', account);
            return true;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
                token.refreshToken = account.refresh_token;
            }
            return token;
        },
        async session({ session, token }: any) {
            session.token = token;
            return session;
        },

    },
    secret: process.env.NEXTAUTH_SECRET || 'wferonvoerbnoeribe',
    debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
}

export default NextAuth(authOptions);