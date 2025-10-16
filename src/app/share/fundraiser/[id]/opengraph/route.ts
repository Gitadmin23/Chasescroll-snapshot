import { NextResponse } from "next/server";
import { RESOURCE_URL } from "@/constants";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";

// ✅ This route returns static OG HTML for WhatsApp, LinkedIn, etc.
export async function GET(
  request: Request,
  { params }: {
    params: { id: string }
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  const id = params.id;

  try {
    // Fetch event data from your backend
    const res = await fetch(`${baseUrl}/fund-raiser/search?id=${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch event data: ${res.statusText}`);
    }

    const data = await res.json();
    const event = data?.content?.[0];

    if (!event) {
      return new NextResponse("Funderaiser not found", { status: 404 });
    }

    const imageUrl = event.bannerImage?.startsWith("http")
      ? event.bannerImage
      : `${RESOURCE_URL}${event.bannerImage}`;

    // Construct Open Graph metadata HTML
    const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            <title>${capitalizeFLetter(event.name)}</title> 
  
            <!-- ✅ Open Graph -->
            <meta property="og:type" content="website" />
            <meta property="og:title" content="${capitalizeFLetter(event.name)}" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:description" content="${event.description}" />
            <meta property="og:url" content="/events/${id}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
  
            <!-- ✅ Twitter -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${capitalizeFLetter(event.name)}" /> 
          <meta name="twitter:description" content="${event.description}" />
            <meta name="twitter:image" content="${imageUrl}" />
  
            <meta http-equiv="refresh" content="0; url=${baseUrl}/share/fundraiser/${id}" />
          </head>
          <body>
            <p>Redirecting to fundraiser...</p>
            <script>
              // Fallback redirect for crawlers that ignore meta refresh
              window.location.href = "/share/fundraiser/${id}";
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
