'use client'
import Registration from '@/components/EmplRegister/Registration';
import Table from '@/components/Table';
import axiosRequest from '@/lib/axios'; import { handleError, handleResponse } from '@/lib/helper/YupResponseHandler';
;
import React, { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import toast from 'react-hot-toast';
const Page = () => {
    const [tableData, setTableData] = useState([]);
    const [selected, setSelected] = useState();
    const [initialTableData, setInitialTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModal, setisModal] = useState(false);

    const handleSearch = (searchVal) => {
        if (searchVal == "") {
            setTableData(initialTableData);
            return;
        }
        setTableData((prev) =>
            prev.filter((obj) => {
                const id = obj.id ? obj.id.toLowerCase() : "";
                const name = obj.name ? obj.name.toLowerCase() : "";
                return id.includes(searchVal.toLowerCase()) || name.includes(searchVal.toLowerCase());
            })
        );
    }

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await axiosRequest.get(`/user`);
            let employees = await res.data;
            employees = employees.data;

            const all_employees = employees?.map((obj) => {
                let dt = new Date(obj?.user_id?.createdAt);
                let joiningDate = `${dt.getDate().toString().padStart(2, "0")}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getFullYear()}`;
                return {
                    user_id: obj?.user_id?._id,
                    id: obj?.user_id?.employee_id,
                    name: obj?.user_id?.name,
                    title: obj?.user_id?.designation,
                    location: obj?.user_id?.associated_with,
                    department: obj?.user_id?.department?.name,
                    status: (obj?.user_id?.status && obj?.user_id?.isFormCompleted) ? "Active" : obj?.user_id?.isFormCompleted ? "Inactive" : "Pending",
                    joiningDate: joiningDate,
                    link: `/employee/${obj?.user_id?._id}`,
                    role: obj?.user_id?.role
                }
            });
            setInitialTableData(all_employees);
            setTableData(all_employees);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleSelect = (dates) => {
        const selectedDatesArray = Array.isArray(dates) ? dates : dates ? [dates] : [];

        const utcDates = selectedDatesArray.map(date => {
            const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            return utcDate.toISOString().split('T')[0];
        });

        setSelected(utcDates);
    };

    useEffect(() => {
        fetchEmployees();
    }, [])

    const handleSubmit = async () => {
        if (!selected) {
            toast.error('Please select at least one date.');
            return;
        }

        try {
            console.log("selected", selected);

            const response = await axiosRequest.post('/admin-actions', { dates: selected });
            handleResponse(response)
            setSelected([]);
        } catch (error) {
            handleError(error)
        }
    };


    return (
        <>

            <div className='p-10'>
                <div>
                    <DayPicker
                        mode="multiple"
                        selected={selected && selected.map(date => new Date(date))}
                        onSelect={handleSelect}
                        disabled={{ before: new Date() }}
                    />
                    <button onClick={handleSubmit} className="mt-4 p-2 bg-button_blue text-white rounded">
                        Submit Official Leave Days
                    </button>
                </div>
                <Table data={tableData} handleSearchChange={handleSearch} isModal={setisModal} loading={loading} />
            </div>


            {isModal &&
                <div className='fixed top-0 left-0 w-full h-full overflow-auto bg-black/50 z-10'>
                    <Registration close={setisModal} />
                </div>
            }
        </>
    )
}

export default Page