import React from 'react';

const SoftwareLicenses = ({ employee }) => {
    return (
        <div className="bg-white p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">
                Software Licenses
            </h3>
            <ul className="mt-4 space-y-4 text-base">
                {employee?.software.map((item, index) => (
                    <li
                        key={index}
                        className="flex gap-4 p-4 rounded-lg border bg-gray-50 hover:shadow-md transition-shadow"
                    >
                        <span className="font-bold text-button_blue">{item.name}:</span>
                        <span className="text-gray-700">{item.version}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SoftwareLicenses;
