import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);

    useEffect(() => {
        axios.get(`https://locavo.free.nf/getCar.php?id=${id}`)
            .then(response => {
                setCar(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the car details!", error);
            });
    }, [id]);

    const handleConfirmRent = () => {
        const user_id = 1; 

        axios.post('https://locavo.free.nf/rentCar.php', { user_id, car_id: car.id })
            .then(response => {
                alert("Car rented successfully!");
                window.location.href = '/';
            })
            .catch(error => {
                console.error("There was an error renting the car!", error);
            });
    };

    if (!car) return <div>Loading...</div>;

    return (
        <div>
            <h1>{car.name}</h1>
            <img src={car.image} alt={car.name} />
            <p>{car.description}</p>
            <p>${car.price}</p>
            <button onClick={handleConfirmRent}>Confirm Now</button>
        </div>
    );
};

export default CarDetails;
