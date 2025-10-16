import { NextResponse } from "next/server";
import { RESOURCE_URL } from "@/constants";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";

// ✅ This route returns static OG HTML for WhatsApp, LinkedIn, etc.
export async function GET(
  request: Request,
  { params }: { params: { id: string }
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; }
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  const eventId = params.id;

  try {
    // Fetch event data from your backend
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

          // <meta property="og:description" content="${event.eventDescription}" />
    // Construct Open Graph metadata HTML
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          <title>${capitalizeFLetter(event.eventName)}</title> 

          <!-- ✅ Open Graph -->
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${capitalizeFLetter(event.eventName)}" />
          <meta property="og:image" content="${RESOURCE_URL + event.currentPicUrl}" />
          <meta property="og:url" content="https://share.chasescroll.com/share/event/${eventId}" />

          <!-- ✅ Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${capitalizeFLetter(event.eventName)}" /> 
          <meta name="twitter:image" content="${RESOURCE_URL + event.currentPicUrl}" />

          <meta http-equiv="refresh" content="0; url=https://share.chasescroll.com/share/event/${eventId}" />
        </head>
        <body>
          <p>Redirecting to event...</p>
          <script>
            // Fallback redirect for crawlers that ignore meta refresh
            window.location.href = "/share/event/${eventId}";
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating OG page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
