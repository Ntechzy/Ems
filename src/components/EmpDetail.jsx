"use client";
import Input from "@/components/Input";
import { first, second } from "@/data/form_field"; // Assuming you have a second data set for the next fields
import { basicDetailsSchema, moreDetailsSchema } from "@/Validation/EmpValid";
import { useState } from "react";

const EmpDetail = () => {
  const [data, setData] = useState({
    father_name: "",
    DOB: "",
    permanent_address: "",
    correspondence_address: "",
    blood_group: "",
    marital_status: "",
    highest_qualification: "",
    aadhaar_no: "",
    pan_card_no: "",
    date_of_joining: "",
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
        console.log("ok");
      } else if (step === 1) {
        await moreDetailsSchema.validate(data, { abortEarly: false });
      }
      setErrors({});
    } catch (error) {
      console.log("Arrive");

      const newErrors = {};

      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      console.log(errors);

      return false;
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    console.log(data);

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
    const isValid = await moreDetailsSchema.validate(data, {
      abortEarly: false,
    });
    if (isValid) {
      console.log("Form data submitted", data);
    }
  };

  const renderFields = () => {
    if (step === 0) {
      return first.map((item, i) => (
        <div key={i}>
          <Input
            name={item.name}
            label={item.label}
            handleChange={handleChange}
            value={data.label}
            type={item.type}
          />
          {errors[item.label] && (
            <div className="text-red-500 text-sm">{errors[item.label]}</div>
          )}
        </div>
      ));
    } else if (step === 1) {
      return second.map((item, i) => (
        <div key={i}>
          <Input
            name={item.name}
            label={item.label}
            handleChange={handleChange}
            value={data[item.field]}
            type={item.type}
          />
          {errors[item.field] && (
            <div className="text-red-500 text-sm">{errors[item.field]}</div>
          )}
        </div>
      ));
    }
  };

  return (
    <div className="text-center">
      <div className="flex justify-center p-5 font-bold text-4xl w-[50%] text-center m-auto">
        Ntechzy People Portal – Innovating Employee Experience!
      </div>

      <div className="bg-[#e2e8f0] flex justify-center shadow-lg shadow-slate-400 items-center m-auto md:w-[40%] w-[60%] flex-col p-3 gap-11 h-[600px]">
        <div className="flex justify-center gap-11  mt-11 w-[50%] items-center  ">
          <div
            className={
              step === 1
                ? "rounded-full shadow-lg border-2  p-4"
                : "rounded-full shadow-lg bg-slate-600 text-white   p-3"
            }
          >
            Basic Details
          </div>
          <div className="p-3">_________________________</div>
          <div
            className={
              step === 0
                ? "rounded-full shadow-lg border-2  p-4"
                : "rounded-full shadow-lg bg-slate-600 text-white  p-3"
            }
          >
            More Details
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ width: "500px", height: "500px" }}
        >
          <div className="w-full">{renderFields()}</div>

          <div className="flex justify-between mt-5">
            {step > 0 && (
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded"
                onClick={handlePrev}
              >
                Previous
              </button>
            )}

            {step < 1 && (
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={handleNext}
              >
                Next
              </button>
            )}

            {step === 1 && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
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
