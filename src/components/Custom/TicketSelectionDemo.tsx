import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import TicketSelection from './modals/TicketPurchaseModal/TicketSelection';

const TicketSelectionDemo: React.FC = () => {
  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        Ticket Selection Component
      </Text>

      <TicketSelection
        eventTitle="Tech Submit"
        eventDate="Aug 13, 2025 11:00 PM"
        eventImage="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      />
    </Box>
  );
};

export default TicketSelectionDemo;