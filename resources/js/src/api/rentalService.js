import axiosClient from './axiosClient';

export const getRentals = async () => {
    const response = await axiosClient.get('/v1/rentals');
    return response.data.data;
};

export const createRental = async (rentalData) => {
    const response = await axiosClient.post('/v1/rentals', rentalData);
    return response.data.data;
};