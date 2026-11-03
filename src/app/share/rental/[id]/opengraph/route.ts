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

    const res = await fetch(`${baseUrl}/rental/search?id=${id}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch rental data: ${res.statusText}`);
    }

    const data = await res.json();
    const rental = data?.content?.[0];

    if (!rental) {
      return new NextResponse("Rental not found", { status: 404 });
    }

    const rentalName = capitalizeFLetter(rental?.name || "Rental Item");
    const rentalDescription =
      rental?.description || "Check out this rental on Chasescroll";

    let imageUrl = `${baseUrl}/logo.png`;
    if (rental?.images && Array.isArray(rental.images) && rental.images.length > 0) {
      const firstImage = rental.images[0];
      if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) {
        imageUrl = firstImage;
      } else {
        imageUrl = `${RESOURCE_URL}${firstImage}`;
      }
    }

    const redirectPath = `/share/rental/${id}`;
    const redirectUrl = new URL(redirectPath, url.origin).toString();
    const currentPageUrl = url.toString();

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
          <title>${rentalName} | Chasescroll</title>

          <!-- Open Graph -->
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${rentalName}" />
          <meta property="og:description" content="${rentalDescription}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:image:secure_url" content="${imageUrl}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="${currentPageUrl}" />
          <meta property="og:site_name" content="Chasescroll" />

          <!-- Twitter -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${rentalName}" />
          <meta name="twitter:description" content="${rentalDescription}" />
          <meta name="twitter:image" content="${imageUrl}" />

          <!-- Redirect -->
          <meta http-equiv="refresh" content="0; url=${redirectUrl}" />

          <style>
            body {
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: #0d1117;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .image-container {
              width: 100%;
              max-width: 600px;
              max-height: 350px;
              overflow: hidden;
              border-radius: 12px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.5);
              margin-bottom: 20px;
            }
            .image-container img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            h1 {
              font-size: 1.5rem;
              margin: 0 0 10px 0;
            }
            p {
              color: #8b949e;
              font-size: 0.95rem;
              max-width: 500px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="image-container">
            <img src="${imageUrl}" alt="${rentalName}" />
          </div>
          <h1>${rentalName}</h1>
          <p>${rentalDescription}</p>

          <script>
            setTimeout(() => {
              window.location.replace(${JSON.stringify(redirectUrl)});
            }, 500);
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating OG page for rental:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

