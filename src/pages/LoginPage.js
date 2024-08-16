import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import Cookies from 'js-cookie';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('https://locavo.free.nf/webserback/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
      console.log('Login Response:', data); // Debugging statement
  
      if (data.status === 'success') {
        Cookies.set('authToken', data.token, { expires: 7 }); // Set cookie
        console.log('Redirecting based on email'); // Debugging statement
        setIsLoggedIn(true); // Update login status
  
        // Check if the logged-in user is the specific user
        if (email === 'haniacs05@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/rent-car');
        }
      } else {
        setError(data.message);
        toast({
          title: 'Login Error',
          description: data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred');
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again later.',
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
          Login
        </Text>
        <form onSubmit={handleLogin}>
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
              Login
            </Button>
            <Text mt={4}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'teal', textDecoration: 'underline' }}>
                Sign Up
              </Link>
            </Text>
          </Stack>
        </form>
        {error && <Text color="red.500" mt={4}>{error}</Text>}
      </Box>
    </Container>
  );
};

export default Login;