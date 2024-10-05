"use client";
import Input from "@/components/Input";
import { first, second } from "@/data/form_field";
import { basicDetailsSchema, moreDetailsSchema } from "@/Validation/EmpValid";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmpDetail = () => {
  const [data, setData] = useState({
    father_name: "",
    dob: "",
    permanent_address: "",
    correspondence_address: "",
    blood_group: "",
    marital_status: "",
    highest_qualification: "",
    aadhaar_no: "",
    pan_card_no: "",
    date_of_joining: "",
    salary_slot: "",
    account_holder_name: "",
    bank_name: "",
    ifsc_code: "",
    account_number: ""
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
    setErrors({});
  };

  const validateStep = async () => {
    try {
      if (step === 0) {
        await basicDetailsSchema.validate(data, { abortEarly: false });
        // return true;
      } else if (step === 1) {
        await moreDetailsSchema.validate(data, { abortEarly: false });
        return true;
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateStep();
    if (isValid) {
      try {

        const response = await axios.put("/api/updatedetail", data);

        if (response.status === 200) {
          toast.success("Form submitted successfully"); 
          setData({
            father_name: "",
            dob: "",
            permanent_address: "",
            correspondence_address: "",
            blood_group: "",
            marital_status: "",
            highest_qualification: "",
            aadhaar_no: "",
            pan_card_no: "",
            date_of_joining: "",
            salary_slot: "",
            account_holder_name: "",
            bank_name: "",
            ifsc_code: "",
            account_number: ""
          });
        } else {
          toast.error("Failed to submit form");
          console.log("failed");
 
        }
      } catch (error) {
        toast.error("Error submitting form");
        console.log("Error", error.message);
      }
    }
  };

  const renderFields = () => {
    const fieldData = step === 0 ? first : second;
    return fieldData.map((item, i) => (
      <div key={i} className="mb-4">
        <Input
          name={item.name}
          label={item.label}
          handleChange={handleChange}
          value={data[item.label]}
          type={item.type}
        />
        {errors[item.label] && (
          <div className="text-red-500 text-sm">{errors[item.label]}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-6">
        Ntechzy People Portal – Innovating Employee Experience!
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 w-full max-w-2xl space-y-8">
        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-6">
          <div
            className={`${step === 0
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
              } rounded-full p-4 w-12 h-12 flex items-center justify-center font-bold`}
          >
            1
          </div>
          <div className="flex-grow h-1 bg-gray-300 mx-4"></div>
          <div
            className={`${step === 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
              } rounded-full p-4 w-12 h-12 flex items-center justify-center font-bold`}
          >
            2
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>{renderFields()}</div>

          <div className="flex justify-between">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded transition duration-300"
              >
                Previous
              </button>
            )}
            {step < 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-300"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpDetail;
