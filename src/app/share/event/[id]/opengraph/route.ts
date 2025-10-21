import { NextResponse } from "next/server";
import { RESOURCE_URL } from "@/constants";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  const eventId = params.id;

  try {
    const url = new URL(request.url);
    const affiliateID = url.searchParams.get("affiliateID");

    const res = await fetch(`${baseUrl}/events/events?id=${eventId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch event data: ${res.statusText}`);
    }

    const data = await res.json();
    const event = data?.content?.[0];

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    const imageUrl = `${RESOURCE_URL}${event.currentPicUrl}`;
    const redirectUrl = `/share/event/${eventId}${
      affiliateID ? `?affiliateID=${affiliateID}` : ""
    }`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${capitalizeFLetter(event.eventName)}</title>

          <!-- Open Graph -->
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${capitalizeFLetter(event.eventName)}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${redirectUrl}" />

          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${capitalizeFLetter(event.eventName)}" />
          <meta name="twitter:image" content="${imageUrl}" />

          <!-- Immediate redirect -->
          <meta http-equiv="refresh" content="0; url=${redirectUrl}" />
        </head>
        <body>
          <p>Redirecting to event...</p>
          <script>
            window.location.replace("${redirectUrl}");
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating OG page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
