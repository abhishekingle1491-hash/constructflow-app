import React, { useState, useEffect } from 'react';
import { createEquipment, updateEquipment, uploadEquipmentCsv } from '../../api/equipmentService';

const EquipmentModal = ({ isOpen, onClose, onSuccess, editItem = null }) => {
    const defaultForm = { name: '', make: '', model: '', serial_number: '', purchase_date: '', status: 'available' };
    const [formData, setFormData] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Tab State: 'manual' or 'bulk'
    const [uploadMode, setUploadMode] = useState('manual');
    const [csvFile, setCsvFile] = useState(null);

    useEffect(() => {
        if (editItem) {
            setUploadMode('manual'); // Force manual mode when editing
            setFormData({
                name: editItem.name || '',
                make: editItem.make || '',
                model: editItem.model || '',
                serial_number: editItem.serialNumber || '',
                purchase_date: editItem.purchaseDate || '',
                status: editItem.status || 'available'
            });
        } else {
            setFormData(defaultForm);
            setCsvFile(null);
        }
        setErrors({});
    }, [editItem, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            if (uploadMode === 'bulk' && !editItem) {
                if (!csvFile) {
                    setErrors({ file: ['Please select a CSV file to upload.'] });
                    setIsSubmitting(false);
                    return;
                }
                await uploadEquipmentCsv(csvFile);
                alert("Bulk upload successful!");
            } else {
                if (editItem) {
                    await updateEquipment(editItem.id, formData);
                } else {
                    await createEquipment(formData);
                }
            }
            
            onSuccess(); // Trigger parent refresh
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Handle both normal validation and file validation errors
                setErrors(error.response.data.errors || { file: [error.response.data.message] });
            } else {
                console.error("An unexpected error occurred:", error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editItem ? 'Edit Equipment' : 'Add Equipment'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {/* TAB SELECTOR (Only show if not editing) */}
                {!editItem && (
                    <div className="flex mb-6 border-b border-gray-200">
                        <button 
                            type="button"
                            className={`pb-2 px-4 text-sm font-medium ${uploadMode === 'manual' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setUploadMode('manual')}
                        >
                            Manual Entry
                        </button>
                        <button 
                            type="button"
                            className={`pb-2 px-4 text-sm font-medium ${uploadMode === 'bulk' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setUploadMode('bulk')}
                        >
                            Bulk CSV Upload
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* MANUAL ENTRY UI */}
                    {uploadMode === 'manual' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Equipment Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Make</label>
                                    <input type="text" name="make" value={formData.make} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Model</label>
                                    <input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                                    <input type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                                    <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" />
                                </div>
                            </div>

                            {editItem && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
                                        <option value="available">Available</option>
                                        <option value="rented">Rented</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {/* BULK UPLOAD UI */}
                    {uploadMode === 'bulk' && !editItem && (
                        <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Upload CSV File</label>
                            <input 
                                type="file" 
                                accept=".csv" 
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.file && <p className="mt-2 text-sm text-red-600">{errors.file[0]}</p>}
                            <p className="mt-4 text-xs text-gray-500">
                                Required headers: name, make, model, serial_number, purchase_date, status
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                            {isSubmitting ? 'Processing...' : (uploadMode === 'bulk' ? 'Import CSV' : (editItem ? 'Update Item' : 'Save Equipment'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentModal;