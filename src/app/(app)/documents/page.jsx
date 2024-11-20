"use client"
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import { documentFields } from '@/data/documentFields';
import { documentValidationSchemas } from '@/Validation/LetterValidation';
import axios from 'axios';
import { set } from 'mongoose';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
    const [documentType, setDocumentType] = useState('');
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [pdfUrl, setPdfUrl] = useState();
    const [isPdfGenerated, setIsPdfGenerated] = useState(false); // New state for tracking PDF generation

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDocumentTypeChange = (e) => {
        setDocumentType(e.target.value);
        setFormData({});
        setIsPdfGenerated(false);
    };

    const validateForm = async () => {
        const schema = documentValidationSchemas[documentType];
        if (!schema) return false;

        try {
            await schema.validate(formData, { abortEarly: false });
            setFormErrors({});
            return true;
        } catch (error) {
            const errors = {};
            error.inner.forEach(err => {
                errors[err.path] = err.message;
            });
            setFormErrors(errors);
            return false;
        }
    };

    const handleDownloadPdf = async () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'document.pdf';
        link.click();
        URL.revokeObjectURL(pdfUrl);
    };

    const handleViewPdf = async () => {
        const requestId = uuidv4();
        try {
            setIsLoading(true)
            const response = await axios.post('/api/admin-actions/genrate', {
                action: "preview",
                documentType,
                formData,
                requestId
            }, { responseType: 'arraybuffer' });

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            const pdfUrl = URL.createObjectURL(pdfBlob);

            setPdfUrl(pdfUrl);
            setIsLoading(false)
            setIsPdfGenerated(true);
        } catch (err) {
            setIsLoading(false)
            toast.error('Ooopss! Page will be refresh in 5 sec. Please Hold Tight server is low');
            setTimeout(() => { 
                toast.success("");
                window.location.reload();
            }, 5000);
        }

    };


    const handleSendDocument = async () => {
        const requestId = uuidv4();

        try {
            setIsLoading(true)
            const response = await axios.post('/api/admin-actions/genrate', {
                action: 'send',
                documentType,
                formData,
                requestId
            });
            setIsLoading(false)
            toast.success(response.data.message);
        } catch (err) {
            setIsLoading(false)
            toast.error('Failed to send document');
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
                    <option value="JoiningLetter">Joining Letter</option>
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
                            {formErrors[field.name] && <p className="text-red-500">{formErrors[field.name]}</p>}
                        </div>
                    ) : (
                        <div>
                            <Input
                                label={field.label}
                                handleChange={handleInputChange}
                                value={formData[field.name]}
                                name={field.name}
                                inputName={field.name}
                                type={field.type}
                            />
                            {formErrors[field.name] && <p className="text-red-500">{formErrors[field.name]}</p>}
                        </div>
                    )}
                </div>
            ))}

            {
                documentType &&


                <div className="flex md: justify-center items-center m-auto my-4">
                    <button
                        className='bg-button_blue p-2 md:w-auto flex justify-center items-center m-auto rounded-xl text-white text-lg'
                        onClick={handleSendDocument}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : 'Send Document'}
                    </button>
                    <button
                        className='bg-button_blue p-2 md:w-auto flex justify-center items-center m-auto rounded-xl text-white text-lg'
                        onClick={handleViewPdf}
                        disabled={isLoading}
                    >
                        Preview
                    </button>


                    {/* download pdf from url */}
                    <button
                        className='bg-button_blue p-2 md:w-auto flex justify-center items-center m-auto rounded-xl text-white text-lg'

                        onClick={handleDownloadPdf}
                    >Download

                    </button>
                </div>


            }

            {isLoading ? <Loader /> : (
                isPdfGenerated && (
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="600px"
                        aria-label="PDF Preview"
                        title="PDF Preview"
                    />

                )

            )}
        </div>
    );
};

export default Page;
