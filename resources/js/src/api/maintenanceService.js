import axiosClient from './axiosClient';

export const getMaintenanceLogs = async (equipmentId) => {
    const response = await axiosClient.get(`/v1/equipment/${equipmentId}/maintenance`);
    return response.data.data;
};

export const createMaintenanceLog = async (equipmentId, logData) => {
    const response = await axiosClient.post(`/v1/equipment/${equipmentId}/maintenance`, logData);
    return response.data.data;
};