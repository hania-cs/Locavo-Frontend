import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Input,
    FormControl,
    FormLabel,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Stack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Box,
    Heading,
    Container,
    Switch
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [cars, setCars] = useState([]);
    const [editingCar, setEditingCar] = useState(null);
    const [carDetails, setCarDetails] = useState({ name: '', image: '', description: '', price: '', available: true });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [actionType, setActionType] = useState('Add');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = () => {
        axios.get('https://locavo.free.nf/webserback/getCar.php')
            .then(response => {
                setCars(response.data);
            })
            .catch(error => console.error("Error fetching cars:", error));
    };

    const handleAddCar = () => {
        axios.post('https://locavo.free.nf/webserback/addCar.php', carDetails)
            .then(() => {
                fetchCars();
                onClose();
            })
            .catch(error => console.error("Error adding car:", error));
    };

    // Edit existing car
    const handleEditCar = () => {
        axios.post('https://locavo.free.nf/webserback/editCar.php', { ...carDetails, id: editingCar.id })
            .then(() => {
                fetchCars();
                onClose();
                setEditingCar(null);
            })
            .catch(error => console.error("Error editing car:", error));
    };

    // Delete a car
    const handleDeleteCar = (id) => {
        axios.post('https://locavo.free.nf/webserback/deleteCar.php', { id })
            .then(() => fetchCars())
            .catch(error => console.error("Error deleting car:", error));
    };

    // Open modal for add or edit
    const openModal = (type, car = {}) => {
        setActionType(type);
        if (type === 'Edit') {
            setEditingCar(car);
            setCarDetails(car);
        } else {
            setCarDetails({ name: '', image: '', description: '', price: '', available: true });
        }
        onOpen();
    };

    // Navigate to homepage
    const goToHomepage = () => {
        navigate('/');
    };

    return (
        <Container maxW="container.xl" mt={8}>
            <Heading mb={6}>Admin Car Management System</Heading>
            <Button marginRight="5px" colorScheme="teal" onClick={() => openModal('Add')} mb={4}>
                Add Car
            </Button>
            <Button colorScheme="gray" onClick={goToHomepage} mb={4}>
                Back to Homepage
            </Button>
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Image</Th>
                            <Th>Description</Th>
                            <Th>Price</Th>
                            <Th>Available</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {cars.map(car => (
                            <Tr key={car.id}>
                                <Td>{car.name}</Td>
                                <Td>
                                    <Box boxSize="100px" overflow="hidden" borderRadius="md">
                                        <img src={car.image} alt={car.name} style={{ width: '100%', height: 'auto' }} />
                                    </Box>
                                </Td>
                                <Td>{car.description}</Td>
                                <Td>${car.price}</Td>
                                <Td>{car.available ? 'Available' : 'Rented'}</Td>
                                <Td>
                                    <Button marginBottom="5px" colorScheme="blue" onClick={() => openModal('Edit', car)} mr={4}>
                                        Edit
                                    </Button>
                                    <Button colorScheme="red" onClick={() => handleDeleteCar(car.id)}>
                                        Delete
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Modal for Add/Edit Car */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{actionType} Car</ModalHeader>
                    <ModalBody>
                        <Stack spacing={4}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    value={carDetails.name}
                                    onChange={(e) => setCarDetails({ ...carDetails, name: e.target.value })}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Image URL</FormLabel>
                                <Input
                                    value={carDetails.image}
                                    onChange={(e) => setCarDetails({ ...carDetails, image: e.target.value })}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Input
                                    value={carDetails.description}
                                    onChange={(e) => setCarDetails({ ...carDetails, description: e.target.value })}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Price</FormLabel>
                                <Input
                                    type="number"
                                    value={carDetails.price}
                                    onChange={(e) => setCarDetails({ ...carDetails, price: e.target.value })}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Available</FormLabel>
                                <Switch
                                    isChecked={carDetails.available}
                                    onChange={(e) => setCarDetails({ ...carDetails, available: e.target.checked })}
                                />
                            </FormControl>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={actionType === 'Add' ? handleAddCar : handleEditCar}>
                            {actionType}
                        </Button>
                        <Button colorScheme="red" onClick={onClose} ml={3}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default AdminPage;
