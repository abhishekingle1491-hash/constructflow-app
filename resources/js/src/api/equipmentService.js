import axiosClient from './axiosClient';

// Added pagination and filter support
export const getEquipment = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page });
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);

    const response = await axiosClient.get(`/v1/equipment?${params.toString()}`);
    return response.data; 
};

export const getEquipmentById = async (id) => {
    const response = await axiosClient.get(`/v1/equipment/${id}`);
    return response.data.data; // Note the double .data (Axios data -> Laravel Resource data)
};

export const createEquipment = async (equipmentData) => {
    const response = await axiosClient.post('/v1/equipment', equipmentData);
    return response.data.data;
};

export const updateEquipment = async (id, equipmentData) => {
    const response = await axiosClient.put(`/v1/equipment/${id}`, equipmentData);
    return response.data.data;
};

export const deleteEquipment = async (id) => {
    await axiosClient.delete(`/v1/equipment/${id}`);
};

// --- BULK UPLOAD EXPORT ---
export const uploadEquipmentCsv = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post('/v1/equipment/bulk', formData);
    return response.data;
};

// --- BULK DELETE EXPORT ---
export const bulkDeleteEquipment = async (ids) => {
    const response = await axiosClient.post('/v1/equipment/bulk-delete', { ids });
    return response.data;
};