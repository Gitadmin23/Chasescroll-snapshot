import { RESOURCE_URL } from '@/constants'; 
import Fundraiser from '@/views/share/Fundraiser';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = 'force-dynamic';
export const revalidate = 60; // or any interval



export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

  try {
    // ✅ Server-side fetch ensures OG tags are visible to WhatsApp, LinkedIn, etc.
    const res = await fetch(`${baseUrl}/events/events?id=${id}`, {
      method: 'GET',
      cache: 'no-store',
      next: { revalidate: 60 },
    });

    const product = await res.json();
    const event = product?.content?.[0];

    if (!event) {
      return {
        title: 'Event not found',
        description: 'This event may no longer be available.',
      };
    }

    return {
      title: event.eventName,
      description: event.eventDescription,
      openGraph: {
        title: event.eventName,
        // description: event.eventDescription,
        url: `${baseUrl}/events/${id}`,
        type: 'website',
        images: [
          {
            url: RESOURCE_URL + event.currentPicUrl,
            width: 1200,
            height: 630,
            alt: event.eventName,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: event.eventName,
        description: event.eventDescription,
        images: [RESOURCE_URL + event.currentPicUrl],
      },
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return {
      title: 'Event Details',
      description: 'View details of this event.',
    };
  }
}

export default async function EventDetailsPage(props: Props) {
  const params = await props.params; 
  const id = params.id; 

  return <Fundraiser id={id} />;
}