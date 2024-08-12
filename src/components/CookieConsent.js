import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Box, Button, Text, Link } from '@chakra-ui/react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleConsent = () => {
    Cookies.set('cookieConsent', 'true', { expires: 365 });
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <Box
      position="fixed"
      bottom="0"
      width="100%"
      bg="white"
      color="white"
      p="4"
      boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      zIndex="1000"
    >
      <Text>
        This website uses cookies to ensure you get the best experience on our website.{' '}
        <Link color="yellow.500" href="/privacy-policy" isExternal>
          Learn More
        </Link>
      </Text>
      <Button colorScheme="blue" onClick={handleConsent}>
        Accept Cookies
      </Button>
    </Box>
  );
};

export default CookieConsent;
