import { NextResponse } from "next/server";
import { RESOURCE_URL } from "@/constants";
import { capitalizeFLetter } from "@/utils/capitalizeLetter";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  const { id } = await params;

  try {
    // ✅ Fetch fundraiser details
    const res = await fetch(`${baseUrl}/fund-raiser/search?id=${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to fetch event data: ${res.statusText}`);

    const data = await res.json();
    const event = data?.content?.[0];

    if (!event) {
      return new NextResponse("Fundraiser not found", { status: 404 });
    }

    const imageUrl = `${RESOURCE_URL+event.bannerImage }`; 

    // ✅ Generate consistent OG metadata HTML
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
          <meta property="og:description" content="${event.description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="https://share.chasescroll.com/share/fundraiser/${id}" />

          <!-- ✅ Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${capitalizeFLetter(event.name)}" />
          <meta name="twitter:description" content="${event.description}" />
          <meta name="twitter:image" content="${imageUrl}" />

          <!-- ✅ Redirect -->
          <meta http-equiv="refresh" content="0; url=https://share.chasescroll.com/share/fundraiser/${id}" />

          <style>
            /* Fallback preview for browsers */
            body {
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-color: #000;
              color: #fff;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            .image-container {
              width: 1200px;
              height: 630px;
              max-width: 90%;
              max-height: 60vh;
              overflow: hidden;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            }
            .image-container img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            h1 {
              margin-top: 20px;
              font-size: 1.5rem;
            }
          </style>
        </head>
        <body>
          <div class="image-container">
            <img src="${imageUrl}" alt="${capitalizeFLetter(event.name)}" />
          </div>
          <h1>${capitalizeFLetter(event.name)}</h1>
          <p>${event.description || "Fundraiser details"}</p>

          <script>
            // Fallback redirect for browsers
            window.location.href = "/share/fundraiser/${id}";
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
