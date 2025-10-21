import { RESOURCE_URL } from '@/constants';
import Event from '@/views/share/Event';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};
 
import { capitalizeFLetter } from "@/utils/capitalizeLetter";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/events/events?id=${params.id}`, { cache: "no-store" });
  const data = await res.json();
  const event = data?.content?.[0];
  if (!event) return {};

  const imageUrl = `${RESOURCE_URL}${event.currentPicUrl}`;
  return {
    title: capitalizeFLetter(event.eventName),
    openGraph: {
      title: capitalizeFLetter(event.eventName),
      description: event.eventDescription ?? "",
      url: `https://share.chasescroll.com/share/event/${params.id}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: capitalizeFLetter(event.eventName),
      images: [imageUrl],
    },
  };
}

export default async function EventDetailsPage(props: Props) {
  const params = await props.params;
  const searchParams = (await props.searchParams) || {};
  const id = params.id;

  const affiliateID =
    typeof searchParams['affiliate_id'] === 'string'
      ? searchParams['affiliate_id']
      : Array.isArray(searchParams['affiliate_id'])
      ? searchParams['affiliate_id'][0]
      : undefined;

  return <Event id={id} affiliateID={affiliateID} />;
}