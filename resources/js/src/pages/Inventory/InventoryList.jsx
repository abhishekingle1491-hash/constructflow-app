import React, { useState, useEffect } from 'react';
import { getEquipment, deleteEquipment, bulkDeleteEquipment } from '../../api/equipmentService';
import PageMeta from '../../components/common/PageMeta';
import EquipmentModal from '../../components/Inventory/EquipmentModal';
import EquipmentQRCodeModal from '../../components/Inventory/EquipmentQRCodeModal';

const InventoryList = () => {
    // --- 1. ALL STATE MUST BE INSIDE THE COMPONENT ---
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    // --- NEW QR CODE STATE ---
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [itemForQR, setItemForQR] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Bulk Delete State (MOVED INSIDE)
    const [selectedIds, setSelectedIds] = useState([]);

    // --- 2. EFFECTS ---
    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch data
    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                const filters = { search: debouncedSearch, status: statusFilter };
                const payload = await getEquipment(currentPage, filters); 
                
                setEquipment(payload.data || []);
                if (payload.meta) {
                    setCurrentPage(payload.meta.current_page);
                    setTotalPages(payload.meta.last_page);
                    setTotalItems(payload.meta.total);
                }
            } catch (error) {
                console.error("Failed to fetch equipment:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [currentPage, debouncedSearch, statusFilter]);

    // --- 3. HANDLERS ---
    
    // Bulk Delete Handlers (MOVED INSIDE)
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(equipment.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} items? This cannot be undone.`)) return;
        
        try {
            await bulkDeleteEquipment(selectedIds);
            setSelectedIds([]); // Clear selections
            
            // Refresh table
            const filters = { search: debouncedSearch, status: statusFilter };
            const payload = await getEquipment(currentPage, filters);
            setEquipment(payload.data || []);
            if (payload.meta) {
                setTotalPages(payload.meta.last_page);
                setTotalItems(payload.meta.total);
            }
        } catch (error) {
            console.error("Failed to delete bulk items", error);
            alert("An error occurred while deleting items.");
        }
    };

    // Standard Handlers
    const handleOpenAddModal = () => {
        setItemToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenQRModal = (item) => {
        setItemForQR(item);
        setIsQRModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this equipment?")) return;
        try {
            await deleteEquipment(id);
            const filters = { search: debouncedSearch, status: statusFilter };
            const payload = await getEquipment(currentPage, filters);
            setEquipment(payload.data || []);
            if (payload.meta) {
                setTotalPages(payload.meta.last_page);
                setTotalItems(payload.meta.total);
            }
        } catch (error) {
            console.error("Failed to delete item", error);
        }
    };

    const handleEquipmentSaved = async () => {
        const filters = { search: debouncedSearch, status: statusFilter };
        const payload = await getEquipment(currentPage, filters);
        setEquipment(payload.data || []);
        if (payload.meta) {
            setTotalPages(payload.meta.last_page);
            setTotalItems(payload.meta.total);
        }
    };

    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    // --- 4. RENDER UI ---
    return (
        <>
            <PageMeta title="Inventory Management | ConstructFlow" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Fleet Inventory</h1>
                    <button onClick={handleOpenAddModal} className="px-4 py-2 text-white bg-blue-600 rounded">
                        + Add Equipment
                    </button>
                </div>

                <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 w-full sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search name, make, serial..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center w-full gap-3 sm:w-auto">
                        {selectedIds.length > 0 && (
                            <button 
                                onClick={handleBulkDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                            >
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}
                        <div className="w-full sm:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="available">Available</option>
                                <option value="rented">Rented</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                                    <th className="px-6 py-4 w-10">
                                        <input 
                                            type="checkbox" 
                                            onChange={handleSelectAll}
                                            checked={selectedIds.length === equipment.length && equipment.length > 0}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-4">Name / Make</th>
                                    <th className="px-6 py-4">Serial Number</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {equipment.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.make} {item.model}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.serialNumber}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                (item.status || 'available').toLowerCase() === 'available' 
                                                    ? 'bg-green-100 text-green-800' 
                                                : (item.status || '').toLowerCase() === 'rented' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {(item.status || 'available').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {/* NEW QR BUTTON */}
                                            <button 
                                                onClick={() => handleOpenQRModal(item)} 
                                                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                                            >
                                                QR Code
                                            </button>

                                            <button onClick={() => handleOpenEditModal(item)} className="text-blue-600 hover:text-blue-900 font-medium text-sm">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Footer */}
                    <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
                        <div className="flex justify-between flex-1 sm:hidden">
                            <button onClick={goToPrevPage} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Previous</button>
                            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Next</button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 10, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button onClick={goToPrevPage} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                        <span className="sr-only">Previous</span>
                                        <span aria-hidden="true">&laquo;</span>
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button onClick={goToNextPage} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                        <span className="sr-only">Next</span>
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EquipmentModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={handleEquipmentSaved}
                editItem={itemToEdit}
            />

            {/* NEW QR CODE MODAL */}
            <EquipmentQRCodeModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                item={itemForQR}
            />
        </>
    );
};

export default InventoryList;