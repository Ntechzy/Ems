'use client'
import Table from '@/components/Table';
import React from 'react'

const page = () => {
    const employees = [
        { id: 'A081C058', name: 'Vikar Kumar', title: 'Tech Lead', location: 'Kanpur', workAllocation: '20 Hrs/week', skills: ['Dev Ops', 'Server', 'backend', '2+'], status: 'Active' },
        { id: 'A081C039', name: 'Pankaj Upadhyay', title: 'Software Engineer', location: 'Noida', workAllocation: '20 Hrs/week', skills: ['Full stack', 'NodeJS', '3+'], status: 'Active' },
    ];
    
    return (
        // #1d6ba3
        <div className='p-10'>
            <Table data={employees}/>
        </div>
    )
}

export default page