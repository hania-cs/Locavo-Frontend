import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    useDisclosure,
    Box,
    Image,
    Text,
   
    HStack
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const BookCars = () => {
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(null);
    const [popupMessage, setPopupMessage] = useState(null);
    const [rentedCars, setRentedCars] = useState([]); // Track rented cars

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://locavo.free.nf/webserback/getCar.php')
            .then(response => {
                console.log(response.data); // Log the response for debugging
                if (Array.isArray(response.data)) {
                    setCars(response.data);
                } else {
                    setError("Unexpected data format from the server.");
                }
            })
            .catch(error => {
                setError("There was an error fetching the cars. Please try again later.");
                console.error("There was an error fetching the cars!", error);
            });
    }, []);

    const handleRentNow = (car) => {
        axios.post('https://locavo.free.nf/webserback/rentCar.php', {
            car_id: car.id,
            user_id: 1 // Replace with the actual user ID
        })
        .then(response => {
            if (response.data.success) {
                setPopupMessage("Car rented successfully!");
                setRentedCars([...rentedCars, car.id]); // Update rented cars state
                onOpen(); // Show the popup
            } else {
                setPopupMessage(response.data.error);
                onOpen(); // Show the popup
            }
        })
        .catch(error => {
            setPopupMessage("Failed to rent car. Please try again.");
            onOpen(); // Show the popup
            console.error("Error renting the car:", error);
        });
    };

    const handleDeleteRent = (car) => {
        axios.post('https://locavo.free.nf/webserback/deleteRent.php', {
            car_id: car.id,
            user_id: 1 // Replace with the actual user ID
        })
        .then(response => {
            if (response.data.success) {
                setPopupMessage("Rental cancelled successfully!");
                setRentedCars(rentedCars.filter(id => id !== car.id)); // Update rented cars state
                onOpen(); // Show the popup
            } else {
                setPopupMessage(response.data.error);
                onOpen(); // Show the popup
            }
        })
        .catch(error => {
            setPopupMessage("Failed to cancel rental. Please try again.");
            onOpen(); // Show the popup
            console.error("Error cancelling the rental:", error);
        });
    };

    return (
        <Box p={4}>
            <Button 
                onClick={() => navigate('/')} 
                colorScheme="teal" 
                mb={4}
            >
                Back to HomePage
            </Button>
            <Text fontSize="2xl" mb={4}>Available Cars</Text>
            {error && <Text color="red.500">{error}</Text>}
            <HStack spacing={4} wrap="wrap">
                {cars.map(car => (
                    <Box 
                        key={car.id} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        boxShadow="md" 
                        p={4} 
                        width="250px"
                        textAlign="center"
                    >
                        <Image src={car.image} alt={car.name} borderRadius="md" mb={2} />
                        <Text fontSize="xl" fontWeight="bold">{car.name}</Text>
                        <Text mb={2}>{car.description}</Text>
                        <Text fontSize="lg" mb={4}>${car.price}</Text>
                        <Button 
                            onClick={() => handleRentNow(car)} 
                            isDisabled={rentedCars.includes(car.id)}
                            colorScheme={rentedCars.includes(car.id) ? "gray" : "teal"}
                            mb={2}
                        >
                            {rentedCars.includes(car.id) ? "Rented" : "Rent Now"}
                        </Button>
                        {rentedCars.includes(car.id) && (
                            <Button 
                                colorScheme="red" 
                                onClick={() => handleDeleteRent(car)}
                            >
                                Delete Rent
                            </Button>
                        )}
                    </Box>
                ))}
            </HStack>

            {/* Chakra UI AlertDialog for the popup */}
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
                leastDestructiveRef={cancelRef}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            {popupMessage ? "Status" : "Notification"}
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            {popupMessage}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Close
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default BookCars;
