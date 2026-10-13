import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getRentals, createRental } from '../../api/rentalService';
import { getEquipment } from '../../api/equipmentService';
import PageMeta from '../../components/common/PageMeta';

const RentalCalendar = () => {
    const [events, setEvents] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Modal Form State
    const [formData, setFormData] = useState({
        equipment_id: '',
        renter_name: '',
        start_date: '',
        end_date: ''
    });

    // 1. Fetch initial data when page loads
    const fetchData = async () => {
        try {
            // Fetch equipment for the dropdown (we grab page 1 for now, or you can create a specific endpoint for dropdowns)
            const eqPayload = await getEquipment(1); 
            // Only allow renting equipment that is available
            setEquipmentList((eqPayload.data || []).filter(eq => eq.status === 'available'));

            // Fetch Rentals
            const rentalData = await getRentals();
            
            // Map Laravel Data to FullCalendar format
            const formattedEvents = rentalData.map(rental => ({
                id: rental.id,
                title: `${rental.equipment?.name || 'Equipment'} - ${rental.customer_name}`,
                start: rental.start_date,
                // FullCalendar makes 'end' exclusive, so we must add a day for it to render correctly on the UI
                end: new Date(new Date(rental.end_date).setDate(new Date(rental.end_date).getDate() + 1)).toISOString().split('T')[0],
                backgroundColor: '#2563eb', // Tailwind Blue 600
                borderColor: '#1d4ed8'
            }));
            
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Failed to load calendar data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. Handle dragging across dates to quickly open the modal
    const handleDateSelect = (selectInfo) => {
        setFormData({
            ...formData,
            start_date: selectInfo.startStr,
            // Subtract a day because selectInfo.endStr is exclusive
            end_date: new Date(new Date(selectInfo.endStr).setDate(new Date(selectInfo.endStr).getDate() - 1)).toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    // 3. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createRental(formData);
            setIsModalOpen(false);
            setFormData({ equipment_id: '', renter_name: '', start_date: '', end_date: '' });
            fetchData(); // Refresh the calendar!
        } catch (error) {
            alert("Failed to schedule rental. Please check inputs.");
            console.error(error);
        }
    };

    return (
        <>
            <PageMeta title="Rental Schedule | ConstructFlow" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Rental Schedule</h1>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-white bg-blue-600 rounded">
                        + New Rental
                    </button>
                </div>

                {/* THE FULLCALENDAR WRAPPER */}
                <div className="p-6 bg-white rounded-lg shadow h-[800px]">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        selectable={true}
                        select={handleDateSelect}
                        height="100%"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek'
                        }}
                    />
                </div>
            </div>

            {/* QUICK RENTAL MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                        <h2 className="mb-4 text-xl font-bold text-gray-800">Schedule Rental</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Select Equipment</label>
                                <select 
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" 
                                    required
                                    value={formData.equipment_id}
                                    onChange={e => setFormData({...formData, equipment_id: e.target.value})}
                                >
                                    <option value="">-- Choose Available Equipment --</option>
                                    {equipmentList.map(eq => (
                                        <option key={eq.id} value={eq.id}>{eq.name} ({eq.serialNumber || 'N/A'})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Renter / Customer Name</label>
                                <input type="text" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required value={formData.renter_name} onChange={e => setFormData({...formData, renter_name: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input type="date" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                                    <input type="date" className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Rental</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default RentalCalendar;