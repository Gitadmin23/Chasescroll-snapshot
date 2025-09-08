import { affiliateIDAtom } from '@/states/activeTicket';
import { useSetAtom } from 'jotai';
import { notFound } from 'next/navigation'
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
