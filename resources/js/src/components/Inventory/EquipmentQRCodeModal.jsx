import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const EquipmentQRCodeModal = ({ isOpen, onClose, item }) => {
    const qrRef = useRef();

    if (!isOpen || !item) return null;

    // This is the URL the QR code will redirect to when scanned.
    // It dynamically grabs your current domain and appends the equipment ID.
    const qrValue = `${window.location.origin}/equipment/${item.id}`;

    const downloadQRCode = () => {
        // Extract the canvas element and convert it to a downloadable image
        const canvas = qrRef.current.querySelector('canvas');
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${item.name.replace(/\s+/g, '_')}_QR.png`; // e.g., Excavator_QR.png
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl text-center">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Equipment QR Code</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-lg">✕</button>
                </div>

                <div className="mb-2 text-gray-600">
                    <p className="font-semibold text-lg">{item.name}</p>
                    <p className="text-sm">SN: {item.serialNumber || 'N/A'}</p>
                </div>

                {/* The QR Code Container */}
                <div ref={qrRef} className="flex justify-center p-4 bg-white border-2 border-gray-100 rounded-lg shadow-inner mb-6 mx-auto w-fit">
                    <QRCodeCanvas 
                        value={qrValue} 
                        size={200} 
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"} // High error correction so it works even if slightly damaged or dirty
                        includeMargin={false}
                    />
                </div>

                <div className="flex justify-center space-x-3">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button 
                        onClick={downloadQRCode} 
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Download PNG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentQRCodeModal;