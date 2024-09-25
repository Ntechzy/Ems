'use client'
import Table from '@/components/Table';
import React, { useState } from 'react'

const page = () => {
    const employees = [
        { id: 'A081C058', name: 'Vikas Kumar', title: 'Tech Lead', location: 'Kanpur', department: 'IT', skills: ['Dev Ops', 'Server', 'backend', '2+'], status: 'Active',joiningDate:"28-01-2023",link:"#" },
        { id: 'A081C039', name: 'Pankaj Upadhyay', title: 'Software Engineer', location: 'Noida', department: 'IT', skills: ['Full stack', 'NodeJS', '3+'], status: 'Pending',joiningDate:"28-02-2024" ,link:"/"},
    ];
    const [tableData , setTableData] = useState(employees);
    const handleSearch = (searchVal)=>{
        if(searchVal == ""){
            setTableData(employees);
            return;
        }
        console.log(searchVal)
        setTableData((prev)=>prev.filter(obj => obj.id.toLowerCase().includes(searchVal.toLowerCase()) || obj.name.toLowerCase().includes(searchVal.toLowerCase())))
    }
    return (
        // #1d6ba3
        <div className='p-10'>
            <Table data={tableData} handleSearchChange={handleSearch} />
        </div>
    )
}

export default page