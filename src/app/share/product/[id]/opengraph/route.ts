import { NextResponse } from "next/server";
import { RESOURCE_URL } from "@/constants";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";

// ✅ This route returns static OG HTML for WhatsApp, LinkedIn, etc.


interface Props {
  params: { type: string }
  searchParams: { id: string; affiliateID?: string }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string; 

  const { id } = await params

  try {
    // Fetch event data from your backend 

      const res = await fetch(`${baseUrl}/products/search?id=${id}`, {
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


      // Construct Open Graph metadata HTML
      const html = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            
            <title>${capitalizeFLetter(event?.name)}</title> 
  
            <!-- ✅ Open Graph -->
            <meta property="og:type" content="website" />
            <meta property="og:title" content="${capitalizeFLetter(event?.name)}" />
            <meta property="og:image" content="${event?.images[0].include("http") ? event?.images[0] : RESOURCE_URL + event?.images[0]}" />
            <meta property="og:description" content="${event?.description}" />
            <meta property="og:url" content="${baseUrl}/events/${id}" />
  
            <!-- ✅ Twitter -->
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${capitalizeFLetter(event.name)}" /> 
            <meta name="twitter:image" content="${RESOURCE_URL + event.images[0]}" />
  
            <meta http-equiv="refresh" content="0; url=${baseUrl}/share/product/${id}" />
          </head>
          <body>
            <p>Redirecting to product...</p>
            <script>
              // Fallback redirect for crawlers that ignore meta refresh
              window.location.href = "/share/product/${id}";
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
