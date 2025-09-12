import { affiliateIDAtom } from '@/states/activeTicket';
import { useSetAtom } from 'jotai';
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import httpService from '@/services/httpService';
import { URLS } from '@/services/urls';
// THIS PAGE HAS TO BE SERVER RENDERED

interface Props {
    params: {
        type: string;
    },
    searchParams: {
        id: string;
        affiliateID: string;
    }
}

// Generate metadata for social sharing
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { type } = await params;
    const { id } = await searchParams;
    
    // Only generate metadata for events for now
    if (type.toLowerCase() === 'event' && id) {
        try {
            const response = await httpService.get(`${URLS.event}/events`, {
                params: { id }
            });
            
            const event = response.data?.content?.[0];
            
            if (event) {
                return {
                    title: `${event.eventName} | Chasescroll`,
                    description: event.eventDescription || 'Join this amazing event on Chasescroll',
                    openGraph: {
                        type: 'website',
                        title: event.eventName || 'Event on Chasescroll',
                        description: event.eventDescription || 'Join this amazing event on Chasescroll',
                        images: [{
                            url: event.currentPicUrl || event.picUrls?.[0] || '/logo.png',
                            width: 1200,
                            height: 630,
                            alt: event.eventName || 'Event Image'
                        }],
                        siteName: 'Chasescroll'
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: event.eventName || 'Event on Chasescroll',
                        description: event.eventDescription || 'Join this amazing event on Chasescroll',
                        images: [event.currentPicUrl || event.picUrls?.[0] || '/logo.png']
                    }
                };
            }
        } catch (error) {
            console.error('Error fetching event metadata:', error);
        }
    }
    
    // Default metadata
    return {
        title: 'Chasescroll | Share',
        description: 'Discover amazing events, fundraisers, and services on Chasescroll'
    };
}

export default async function SharePage({ params, searchParams }: Props) {
    // MAKE SURE YOU AWAIT THE PARAMS
    const { type } = await params
    const { id, affiliateID } = await searchParams;

    // Validate allowed types
    const allowedTypes = ['event', 'fundraiser', 'service', 'rental', 'product']
    if (!allowedTypes.includes(type.toLowerCase())) {
        notFound()
    }
    // Import the specific components based on type
    const ComponentMap = {
        event: async () => {
            const EventComponent = (await import('@/views/share/Event')).default
            return <EventComponent id={id} affiliateID={affiliateID} />
        },
        fundraiser: async () => {
            const FundraiserComponent = (await import('@/views/share/Fundraiser')).default
            return <FundraiserComponent id={id} />
        },
        service: async () => {
            const ServiceComponent = (await import('@/views/share/Service')).default
            return <ServiceComponent id={id} />
        },
        rental: async () => {
            const RentalComponent = (await import('@/views/share/Rental')).default
            return <RentalComponent id={id} />
        },
        product: async () => {
            const ProductComponent = (await import('@/views/share/Product')).default
            return <ProductComponent id={id} />
        }
    }

    // Dynamically render the component based on type
    const DynamicComponent = ComponentMap[type.toLowerCase() as 'rental' | 'event' | 'fundraiser' | 'service' | 'product']
    const Content = await DynamicComponent()


    return (
        <div className="container mx-auto p-4">
            {Content}
        </div>
    )
}
