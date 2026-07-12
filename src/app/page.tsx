'use client'
import React from 'react';
import { Flex, Text, Image, Input, VStack, Button, HStack } from "@chakra-ui/react";
import { Ticket, ShoppingCart, WalletAdd1 } from 'iconsax-reactjs';

export default function Home() {
  const [userId, setUserId] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);

  const handleSubmit = (type: 'event' | 'product' | 'fundraiser') => {
    if (userId && userId !== '') {
      window.location.href = `external/${type}?userId=${userId}`;
    }
  }
  return (
    <Flex w="full" h="100vh" bgColor="whitesmoke" alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
      <VStack w={['full', 'full', '30%', '30%']} >
        <Image src="/logo.png" objectFit={'çontain'} w="60px" h="60px" />
        <Text fontFamily="fantasy" fontSize="30px" color="primaryColor">Chasescroll Snapshot Service</Text>
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder='Enter your userId' onFocus={() => setIsActive(true)} onBlur={() => setIsActive(false)} borderWidth={'2px'} borderColor={isActive ? 'primaryColor' : 'lightgray'} h="60px" borderRadius={'full'} bgColor={'whitesomke'} w={['full', 'full', '80%', '80%']} />
        <HStack spaceX={2} w="80%">
          <Button variant={'solid'} h="55px" borderRadius={'full'} flex="1" onClick={() => handleSubmit('event')}>
            <Ticket size='20px' color="white" />
            Events
          </Button>

          <Button variant={'solid'} h="55px" borderRadius={'full'} flex="1" onClick={() => handleSubmit('product')}>
            <ShoppingCart size='20px' color="white" />
            Products
          </Button>

          <Button variant={'solid'} h="55px" borderRadius={'full'} flex="1" onClick={() => handleSubmit('fundraiser')}>
            <WalletAdd1 size='20px' color="white" />
            FundRaisers
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
}
