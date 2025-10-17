import { NextResponse } from "next/server";
import { RESOURCE_URL } from "@/constants";

// ✅ This route returns static OG HTML for WhatsApp, LinkedIn, etc.
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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

    const imageUrl = `https://share.chasescroll.com/api/og-image/${encodeURIComponent(
        RESOURCE_URL+event.currentPicUrl
      )}`;

    // Construct Open Graph metadata HTML
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          <title>${event.eventName}</title>
          <meta name="description" content="${event.eventDescription}" />

          <!-- ✅ Open Graph -->
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${event.eventName}" />
          <meta property="og:description" content="${event.eventDescription}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${baseUrl}/events/${eventId}" />

          <!-- ✅ Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${event.eventName}" />
          <meta name="twitter:description" content="${event.eventDescription}" />
          <meta name="twitter:image" content="${imageUrl}" />

          <meta http-equiv="refresh" content="0; url=${baseUrl}/events/${eventId}" />
        </head>
        <body>
          <p>Redirecting to event...</p>
          <script>
            // Fallback redirect for crawlers that ignore meta refresh
            window.location.href = "${baseUrl}/events/${eventId}";
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error generating OG page:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
