import { IDonationGroupData, IDonationList } from '@/models/donation';
import { IProduct, IRental } from '@/models/product';
import React from 'react'
import { IEventType } from '@/models/Event';
import { Box } from '@chakra-ui/react';
import RentalCard from './RentalCard';
import { IService } from '@/models/Service';
import ServiceCard from './ServiceCard';
import EventCard from './EventCard';
import ProductCard from './ProductCard';
import FundraiserCard from './FundraiserCard';

interface IProps {
    type: 'EVENT' | 'FUNDRAISER' | 'SERVICE' | 'RENTAL' | 'PRODUCT';
    event?: IEventType;
    fundraiser?: IDonationList;
    service?: IService;
    rental?: IRental;
    product?: IProduct;
}

const ReusableExternalListCard = React.forwardRef<HTMLDivElement, IProps>(
    ({ type, event, fundraiser, service, rental, product }, ref) => {
        return (
            <Box
                ref={ref}
                w='auto'
                h="509px"
                borderWidth={'0px'}
                borderColor={'gray.200'}
                mb={10}
                borderRadius={'13px'}
                overflow={'hidden'}
                transition="transform 0.3s ease"
                _hover={{
                    transform: 'scale(1.05)',
                    zIndex: 1000,
                }}
                zIndex={999}
            >
                {type === 'EVENT' && <EventCard event={event as IEventType} />}
                {type === 'RENTAL' && <RentalCard rental={rental as IRental} />}
                {type === 'SERVICE' && <ServiceCard service={service as IService} />}
                {type === 'PRODUCT' && <ProductCard service={product as IProduct} />}
                {type === 'FUNDRAISER' && <FundraiserCard fundraiser={fundraiser as IDonationList} />}
            </Box>
        )
    }
)

ReusableExternalListCard.displayName = 'ReusableExternalListCard'



export default ReusableExternalListCard
