import { NextResponse } from "next/server";
import { RESOURCE_URL } from "@/constants";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

    try {
        const url = new URL(request.url);
        const affiliateID = url.searchParams.get("affiliateID");

        const res = await fetch(`${baseUrl}/events/events?id=${id}`, {
            cache: "no-store",
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });

        if (!res.ok) {
            throw new Error(
                `Failed to fetch event data: ${res.statusText}`,
            );
        }

        const data = await res.json();
        const event = data?.content?.[0];

        if (!event) {
            return new NextResponse("Event not found", {
                status: 404,
            });
        }

        const eventName = capitalizeFLetter(event.eventName);

        // Add a version to force social platforms to fetch the new image.
        // Prefer event.updatedAt if your API provides it.
        const imageVersion =
            event.updatedAt ??
            event.dateModified ??
            Date.now();

        const imageUrl = new URL(
            `${RESOURCE_URL}${event.picUrls[0]}`,
        );

        imageUrl.searchParams.set(
            "v",
            encodeURIComponent(String(imageVersion)),
        );

        const redirectPath = `/share/event/${id}${
            affiliateID
                ? `?affiliateID=${encodeURIComponent(affiliateID)}`
                : ""
        }`;

        // Absolute URLs are required/recommended for OG metadata.
        const redirectUrl = new URL(
            redirectPath,
            url.origin,
        ).toString();

        const currentPageUrl = url.toString();

        const html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />

                    <title>${eventName}</title>

                    <!-- Open Graph -->
                    <meta property="og:type" content="website" />
                    <meta
                        property="og:title"
                        content="${eventName}"
                    />
                    <meta
                        property="og:image"
                        content="${imageUrl.toString()}"
                    />
                    <meta
                        property="og:image:secure_url"
                        content="${imageUrl.toString()}"
                    />
                    <meta
                        property="og:url"
                        content="${currentPageUrl}"
                    />

                    <!-- Twitter -->
                    <meta
                        name="twitter:card"
                        content="summary_large_image"
                    />
                    <meta
                        name="twitter:title"
                        content="${eventName}"
                    />
                    <meta
                        name="twitter:image"
                        content="${imageUrl.toString()}"
                    />

                    <!-- Redirect -->
                    <meta
                        http-equiv="refresh"
                        content="1; url=${redirectUrl}"
                    />
                </head>

                <body>
                    <p>Redirecting to event...</p>

                    <script>
                        setTimeout(() => {
                            window.location.replace(
                                ${JSON.stringify(redirectUrl)}
                            );
                        }, 1000);
                    </script>
                </body>
            </html>
        `;

        return new NextResponse(html, {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control":
                    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                "CDN-Cache-Control": "no-store",
                "Vercel-CDN-Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Error generating OG page:", error);

        return new NextResponse("Internal Server Error", {
            status: 500,
        });
    }
}