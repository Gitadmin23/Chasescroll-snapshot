import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { Box, Grid, Image } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/Custom/SessionProvider";
import { GoogleAuthProvider } from "@/components/Custom/GoogleProvider";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chasescroll | Snapshot",
  description: "Extending your reach",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: 'white' }}>
      <head>
        <meta name="viewport" content="minimum-scale=1" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-8113MST9DM`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8113MST9DM');
            `,
          }}
        />
        <meta name="viewport" content="height=device-height,
                      width=device-width, initial-scale=1.0,
                      viewport-fit=cover
                      minimum-scale=1.0, maximum-scale=1.0, 
                      user-scalable=no, target-densitydpi=device-dpi"/>
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GoogleAuthProvider>
            <SessionProvider session={session}>
              {/* <Grid templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)"]} bgColor={"white"} opacity={"100%"} pos={"absolute"} inset={"0px"} w={"full"} h={"full"} overflow={"hidden"} >
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
                <Image src='/bg.png' alt='bg' w={"full"} h={"full"} objectFit={"contain"} opacity={"40%"} />
              </Grid> */}
              <Box w="full" h="screen">
                {children}
              </Box>
            </SessionProvider>
          </GoogleAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
