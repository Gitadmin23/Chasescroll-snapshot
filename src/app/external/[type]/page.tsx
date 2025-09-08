import CustomText from '@/components/Custom/CustomText'
import { affiliateIDAtom } from '@/states/activeTicket';
import { capitalizeFLetter } from '@/utils/capitalizeLetter'
import { Box, Text } from '@chakra-ui/react'
import { useSetAtom } from 'jotai';
import { notFound } from 'next/navigation'
// THIS PAGE HAS TO BE SERVER RENDERED

interface Props {
    params: {
        type: string;
    },
    searchParams: {
        userId: string
    }
}

export default async function ExternalPage({ params, searchParams }: Props) {
    // MAKE SURE YOU AWAIT THE PARAMS
    const { type } = await params
    const { userId } = await searchParams;

    // Validate allowed types
    const allowedTypes = ['event', 'fundraiser', 'service', 'rental', 'product']
    if (!allowedTypes.includes(type.toLowerCase())) {
        notFound()
    }
    // Import the specific components based on type
    const ComponentMap = {
        event: async () => {
            const EventComponent = (await import('@/views/external/Event')).default
            return <EventComponent userId={userId} />
        },
        fundraiser: async () => {
            const FundraiserComponent = (await import('@/views/external/Fundraiser')).default
            return <FundraiserComponent userId={userId} />
        },
        service: async () => {
            const ServiceComponent = (await import('@/views/external/Service')).default
            return <ServiceComponent userId={userId} />
        },
        rental: async () => {
            const RentalComponent = (await import('@/views/external/Rental')).default
            return <RentalComponent userId={userId} />
        },
        product: async () => {
            const ProductComponent = (await import('@/views/external/Product')).default
            return <ProductComponent userId={userId} />
        }
    }

    // Dynamically render the component based on type
    const DynamicComponent = ComponentMap[type.toLowerCase() as 'rental' | 'event' | 'fundraiser' | 'service' | 'product']
    const Content = await DynamicComponent()


    return (
        <Box w="full" h="full">
            {Content}
        </Box>
    )
}
