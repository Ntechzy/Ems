'use client'
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import { documentFields } from '@/data/documentFields';
import axios from 'axios';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
    const [documentType, setDocumentType] = useState('');
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDocumentTypeChange = (e) => {
        setDocumentType(e.target.value);
        setFormData({});
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            console.log("Document sent:", { documentType, formData });
        } catch (error) {
            console.error("Failed to send document", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [pdfUrl, setPdfUrl] = useState()

    const handlePreview = async () => {
        const requestId = uuidv4();
        console.log(requestId);
        try {
            const response = await axios.post('/api/admin-actions/genrate',
                {
                    action: 'preview',
                    documentType,
                    formData,
                    requestId
                }, {
                // Specify that we expect a binary response (blob)
                responseType: 'blob',
            }
            );



            console.log(response);

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            console.log(pdfBlob);

            const pdfUrl = URL.createObjectURL(pdfBlob);
            console.log(pdfUrl);

            setPdfUrl(pdfUrl);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Document</h2>


            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Select Document Type</label>
                <select
                    className="mt-2 p-2 block w-full border border-gray-300 rounded-md"
                    value={documentType}
                    onChange={handleDocumentTypeChange}
                >
                    <option value="">Select a document</option>
                    <option value="experienceLetter">Experience Letter</option>
                    <option value="AppoinmentLetter">Appointment Letter</option>

                </select>
            </div>


            {documentType && documentFields[documentType].map((field) => (
                <div className="mb-4" key={field.name}>
                    {field.type === 'select' ? (
                        <div>
                            <select
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleInputChange}
                                className="mt-2 p-2 block w-full border border-gray-300 rounded-md"
                            >
                                <option value="">Select an option</option>
                                {field.options.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <Input
                            label={field.label}
                            handleChange={handleInputChange}
                            value={formData[field.name]}
                            name={field.name}
                            inputName={field.name}
                            type={field.type}
                        />
                    )}
                </div>
            ))}


            {
                documentType &&


                <div className="flex items-center space-x-4">
                    <button
                        className='bg-button_blue p-2 md:w-auto flex justify-center items-center m-auto rounded-xl text-white text-lg'
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : 'Send Document'}
                    </button>
                </div>
            }


            <div>
                <button onClick={handlePreview}>Preview PDF</button>

                {pdfUrl && (

                    <>
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="600px"
                            style={{ border: 'none' }}
                            title="PDF Preview"
                        />

                        {/* Download Button */}
                        <a href={pdfUrl} download="generated-document.pdf">
                            <button>Download PDF</button>
                        </a>
                    </>

                )}
            </div>
        </div>
    )
}

export default Page