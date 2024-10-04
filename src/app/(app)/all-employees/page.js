'use client'
import Registration from '@/components/EmplRegister/Registration';
import Table from '@/components/Table';
import axiosRequest from '@/lib/axios';
import React, { useEffect, useState } from 'react'


const Page = () => {
    const employees = [
        { id: 'A081C058', name: 'Vikas Kumar', title: 'Tech Lead', location: 'Kanpur', department: 'IT', skills: ['Dev Ops', 'Server', 'backend', '2+'], status: 'Active', joiningDate: "28-01-2023", link: "/employee/lfjsd" },
        { id: 'A081C039', name: 'Pankaj Upadhyay', title: 'Software Engineer', location: 'Noida', department: 'IT', skills: ['Full stack', 'NodeJS', '3+'], status: 'Pending', joiningDate: "28-02-2024", link: "/employee/lfjsd" },
    ];
    const [tableData, setTableData] = useState([]);
    const [initialTableData , setInitialTableData] = useState([]);
    const [loading , setLoading] = useState(true);
    const handleSearch = (searchVal) => {
        if (searchVal == "") {
            setTableData(initialTableData);
            return;
        }
        setTableData((prev) => prev.filter(obj => obj.id.toLowerCase().includes(searchVal.toLowerCase()) || obj.name.toLowerCase().includes(searchVal.toLowerCase())))
    }

    const [isModal, setisModal] = useState(false);

    const fetchEmployees = async()=>{
        try {
            setLoading(true);
            const res = await axiosRequest.get(`/user`);
            let employees = await res.data;
            employees = employees.data;
            console.log(employees);
            const all_employees = employees?.map((obj)=>{
                let dt = new Date(obj?.user_id?.createdAt);
                let joiningDate = `${dt.getDate().toString().padStart(2,"0")}-${(dt.getMonth()+1).toString().padStart(2,"0")}-${dt.getFullYear()}`;
                return {
                id:obj?.user_id?.employee_id,
                name: obj?.user_id?.name,
                title: obj?.user_id?.designation,
                location: obj?.user_id?.associated_with,
                department: obj?.user_id?.department,
                status: (obj?.status) ? "Active":"Inactive",
                joiningDate : joiningDate,
                link: `/employee/${obj?.user_id?._id}`
                }
            });
            console.log(all_employees);
            setInitialTableData(all_employees);
            setTableData(all_employees);
        } catch (err) {
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchEmployees();
    },[])
    

    return (
        <>
            <div className='p-10'>
                <Table data={tableData} handleSearchChange={handleSearch} isModal={setisModal} loading={loading}/>
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