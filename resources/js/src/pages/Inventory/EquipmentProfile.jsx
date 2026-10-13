import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEquipmentById } from '../../api/equipmentService';
import { getMaintenanceLogs, createMaintenanceLog } from '../../api/maintenanceService';
import PageMeta from '../../components/common/PageMeta';

const EquipmentProfile = () => {
    const { id } = useParams(); 
    
    const [equipment, setEquipment] = useState(null);
    const [maintenanceLogs, setMaintenanceLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Maintenance Form State
    const initialForm = { maintenance_date: '', type: 'Routine', description: '', cost: '', performed_by: '' };
    const [formData, setFormData] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const eqData = await getEquipmentById(id);
            setEquipment(eqData);

            const logsData = await getMaintenanceLogs(id);
            // Safety net: force it to be an array even if the API fails
            setMaintenanceLogs(logsData || []); 
        } catch (error) {
            console.error("Failed to load equipment profile", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [id]);

    // Handle new maintenance submission
    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createMaintenanceLog(id, formData);
            setFormData(initialForm); // Clear the form
            fetchProfileData(); // Refresh the data to show the new log!
        } catch (error) {
            alert("Failed to save maintenance log.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Equipment Profile...</div>;
    if (!equipment) return <div className="p-8 text-center text-red-500">Equipment not found or access denied.</div>;

    return (
        <>
            <PageMeta title={`${equipment.name} | ConstructFlow`} />
            <div className="p-6 max-w-6xl mx-auto">
                
                <Link to="/inventory" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6">
                    &larr; Back to Inventory
                </Link>

                {/* HEADER SECTION */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
                        <p className="text-gray-500 mt-1">
                            {equipment.make} {equipment.model} • SN: <span className="font-mono text-gray-700">{equipment.serialNumber || 'N/A'}</span>
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <span className={`px-4 py-2 text-sm font-bold uppercase rounded-full ${
                            (equipment.status || 'available').toLowerCase() === 'available' ? 'bg-green-100 text-green-800' 
                            : (equipment.status || '').toLowerCase() === 'rented' ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {equipment.status || 'AVAILABLE'}
                        </span>
                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            {/* CRITICAL FIX: Array fallback applied to reduce */}
                            Lifetime Maint. Cost: <span className="text-gray-900">${(maintenanceLogs || []).reduce((sum, log) => sum + parseFloat(log.cost || 0), 0).toFixed(2)}</span>
                        </p>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Overview & Specs
                        </button>
                        <button 
                            onClick={() => setActiveTab('maintenance')}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'maintenance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            {/* CRITICAL FIX: Array fallback applied to length */}
                            Maintenance History ({(maintenanceLogs || []).length})
                        </button>
                    </nav>
                </div>

                {/* TAB CONTENT */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Equipment Details</h3>
                                <dl className="space-y-4">
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Asset Name</dt>
                                        <dd className="text-sm text-gray-900">{equipment.name}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Make / Manufacturer</dt>
                                        <dd className="text-sm text-gray-900">{equipment.make || '-'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Model</dt>
                                        <dd className="text-sm text-gray-900">{equipment.model || '-'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                                        <dd className="text-sm text-gray-900 font-mono">{equipment.serialNumber || '-'}</dd>
                                    </div>
                                </dl>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Acquisition Info</h3>
                                <dl className="space-y-4">
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                                        <dd className="text-sm text-gray-900">{equipment.purchaseDate || 'Not specified'}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm font-medium text-gray-500">System ID</dt>
                                        <dd className="text-sm text-gray-900 font-mono">CF-EQ-{equipment.id}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    )}

                    {/* MAINTENANCE TAB */}
                    {activeTab === 'maintenance' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* LEFT COLUMN: ADD NEW FORM */}
                            <div className="lg:col-span-1 bg-gray-50 p-5 rounded-lg border border-gray-200 h-fit">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Log New Service</h3>
                                <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                        <input type="date" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" value={formData.maintenance_date} onChange={e => setFormData({...formData, maintenance_date: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Type</label>
                                        <select className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                            <option value="Routine">Routine</option>
                                            <option value="Repair">Repair</option>
                                            <option value="Inspection">Inspection</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea required rows="2" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="Changed oil, replaced hose..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
                                        <input type="number" step="0.01" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="0.00" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Performed By</label>
                                        <input type="text" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" placeholder="Mechanic / Shop Name" value={formData.performed_by} onChange={e => setFormData({...formData, performed_by: e.target.value})} />
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                                        {isSubmitting ? 'Saving...' : 'Save Record'}
                                    </button>
                                </form>
                            </div>

                            {/* RIGHT COLUMN: HISTORY LIST */}
                            <div className="lg:col-span-2">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Service History</h3>
                                
                                {/* CRITICAL FIX: Array fallback applied to length */}
                                {(maintenanceLogs || []).length === 0 ? (
                                    <p className="text-gray-500 italic text-center p-8 bg-gray-50 rounded border border-dashed border-gray-300">
                                        No maintenance records found for this equipment.
                                    </p>
                                ) : (
                                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                        {/* CRITICAL FIX: Array fallback applied to map */}
                                        {(maintenanceLogs || []).map(log => (
                                            <div key={log.id} className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 hover:bg-gray-50 transition-colors">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-gray-800">{log.maintenance_date}</span>
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                                            log.type === 'Repair' ? 'bg-red-100 text-red-800' : 
                                                            log.type === 'Inspection' ? 'bg-purple-100 text-purple-800' : 
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {log.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700">{log.description}</p>
                                                    {log.performed_by && <p className="text-xs text-gray-500 mt-2 font-medium">Performed by: {log.performed_by}</p>}
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <span className="font-bold text-gray-900 text-lg">${parseFloat(log.cost).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default EquipmentProfile;