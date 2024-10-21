import React from 'react';

const HardwareAssigned = ({ employee }) => { 

    return (
        <div className="bg-white p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">
                Hardware Assigned
            </h3>
            <ul className="mt-4 space-y-4 text-base">
                {employee?.hardware.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50 hover:bg-white transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
                    >
                        <span className="font-bold text-indigo-600">{item.name}:</span>
                        <span className="text-gray-700">{item.model}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HardwareAssigned;
