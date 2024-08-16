import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();

    console.log("Submitting signup form...");

    try {
      const response = await fetch("https://locavo.free.nf/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response from server:", result);

      if (result.success) {
        toast({
          title: 'Signup Successful',
          description: 'You have successfully signed up. Redirecting to login...',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
      } else {
        toast({
          title: 'Signup Failed',
          description: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast({
        title: 'Error Occurred',
        description: `An error occurred during signup: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" p={4} centerContent>
      <Box
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
        p={6}
        w="full"
        bg="white"
        textAlign="center"
      >
        <Text fontSize="2xl" mb={4}>
          Signup
        </Text>
        <form onSubmit={handleSignup}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>
            <Button
              colorScheme="blue"
              type="submit"
            >
              Signup
            </Button>
          </Stack>
        </form>
        <Text mt={4}>
          Already have an account? <Link to="/login">Login here</Link>
        </Text>
      </Box>
    </Container>
  );
};

export default Signup;
