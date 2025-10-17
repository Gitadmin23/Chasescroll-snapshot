import { NextResponse } from "next/server";

// ✅ Universal image proxy for OG crawlers (WhatsApp, LinkedIn, etc.)
export async function GET(
  _req: Request,
  { params }: { params: { path: string[] } }
) {
  const imagePath = params.path.join("/");
  const externalBaseUrl = "https://chasescroll-sharelink.vercel.app/"

  // Support both absolute and relative image paths
  const imageUrl = imagePath.startsWith("http")
    ? decodeURIComponent(imagePath)
    : `${externalBaseUrl}/${imagePath}`;

  try {
    const res = await fetch(imageUrl, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Image fetch failed: ${res.statusText}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType =
      res.headers.get("content-type") ||
      "image/jpeg"; // Default fallback — WhatsApp prefers JPEG

    // ✅ Resize large files (WhatsApp limit ~5MB) if necessary
    // (We’re not resizing here, but returning headers that allow crawlers to cache efficiently)
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, immutable",
        "Access-Control-Allow-Origin": "*",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("OG image proxy error:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
