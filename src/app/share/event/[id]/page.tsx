import { RESOURCE_URL } from '@/constants';
import Event from '@/views/share/Event';
import type { Metadata } from 'next';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const id = params?.id;
    if (!id) return {};

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${baseUrl}/events/events?id=${id}`, { cache: 'no-store' });
    if (!res.ok) return {};

    const data = await res.json();
    const event = data?.content?.[0];
    if (!event) return {};

    const title = event.eventName ? capitalizeFLetter(event.eventName) : 'Event Details';
    const description = event.eventDescription ?? '';
    const imageUrl = event.currentPicUrl ? `${RESOURCE_URL}${event.currentPicUrl}` : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://share.chasescroll.com/share/event/${id}`,
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return {
      title: 'Event Details',
    };
  }
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
