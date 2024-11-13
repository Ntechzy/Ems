'use client'
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import { documentFields } from '@/data/documentFields';
import { documentValidationSchemas } from '@/Validation/LetterValidation';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const Page = () => {
    const [documentType, setDocumentType] = useState('');
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDocumentTypeChange = (e) => {
        setDocumentType(e.target.value);
        setFormData({});
    }

    const validateForm = async () => {
        const schema = documentValidationSchemas[documentType];
        if (!schema) {
            console.error("Validation schema not found for document type:", documentType);
            return false;
        }
    
        try {
            await schema.validate(formData, { abortEarly: false });
            setFormErrors({}); // Clear errors if validation passes
            return true;
        } catch (error) {
            const errors = {};
            error.inner.forEach(err => {
                errors[err.path] = err.message; // Map each field error to formErrors
            });
            setFormErrors(errors);
            return false;
        }
    };
    
    

   

    const [pdfUrl, setPdfUrl] = useState()

    const handlePreview = async () => {
       const valid= await validateForm();
        if(!valid){
            return
        }
        const requestId = uuidv4();

        try {
            const response = await axios.post('/api/admin-actions/genrate',
                {
                    action: 'preview',
                    documentType,
                    formData,
                    requestId
                }, {
                responseType: 'blob',
            }
            );

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
        } catch (err) {
            toast.error(err.message)
        }
    };


    const handleSubmit = async () => {
        const requestId = uuidv4();
        try {
            const response = await axios.post('/api/admin-actions/genrate',
                {
                    action: 'confirm',
                    formData,
                    documentType,
                    requestId
                }
            );

            toast.success(response.data.message)
            console.log(response);
        } catch (err) {
            toast.error(err.message)
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


                <div className="flex justify-center items-center m-auto ">
                    <button
                        className='bg-button_blue p-2 md:w-auto flex justify-center items-center m-auto rounded-xl text-white text-lg'
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : 'Send Document'}
                    </button>
                    <button
                        className='bg-button_blue p-2 md:w-auto flex justify-center items-center m-auto rounded-xl text-white text-lg'
                        onClick={handlePreview}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : 'Preview PDF'}
                    </button>
                </div>
            }


            <div>
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