import { useState } from "react";
import Input from "./Input";
import { FaFilter } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const FilterComponent = ({ filters, handleFilterChange, handleClearFilters }) => {
    const [isLocationOpen, setLocationOpen] = useState(false);
    const [isWorkAllocationOpen, setWorkAllocationOpen] = useState(false);
    const [isStatusOpen, setStatusOpen] = useState(false);

    return (
        <div className="absolute top-14 p-4 w-[350px] bg-gray-100 shadow-2xl rounded-lg border-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filter</h2>
                <button className="text-red-500 font-semibold" onClick={handleClearFilters}>CLEAR</button>
            </div>
            <div className="mb-4">
                <button className="w-full flex justify-between items-center py-2" onClick={() => setLocationOpen(!isLocationOpen)}>
                    <span>Location</span>
                    <IoIosArrowDown className={`transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLocationOpen && (
                    filters.location.map((item, i) => {

                        return (
                            <div className="mt-2 ml-2 flex justify-between text-gray-500" key={i}>
                                {item}
                                <input type="checkbox" className="size-4 cursor-pointer checked:bg-blue-400" />
                            </div>
                        )
                    }))}
            </div>
            <div className="mb-4">
                <button className="w-full flex justify-between items-center py-2" onClick={() => setWorkAllocationOpen(!isWorkAllocationOpen)}>
                    <span>Work Allocation</span>
                    <IoIosArrowDown className={`transform ${isWorkAllocationOpen ? 'rotate-180' : ''}`} />
                </button>
                {isWorkAllocationOpen && (
                    <div className="mt-2">
                        {/* <Input label="Work Allocation" value={filters.workAllocation} name="workAllocation" handleChange={handleFilterChange} /> */}
                        <div className="relative">
                            <input type="range" className="w-full"/>
                            <div className="flex justify-between absolute right-0 left-0 top-4 text-gray-500">
                                <p>Bench</p>
                                <p>40Hrs</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="mb-4">
                <button className="w-full flex justify-between items-center py-2" onClick={() => setStatusOpen(!isStatusOpen)}>
                    <span>Status</span>
                    <IoIosArrowDown className={`transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                </button>
                {isStatusOpen && (
                    <div className="mt-2">
                        <Input label="Status" value={filters.status} name="status" handleChange={handleFilterChange} />
                    </div>
                )}
            </div>
        </div>
    );
};

const Table = ({ data, title = "Employees", subtitle = "Manage all your full-time, part-time & contractor employees.", addBtnTitle = "EMPLOYEE", handleSearchChange = () => { } }) => {
    const [searchVal, setSeachVal] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({ location: ["Kanpur", "Noida"], workAllocation: '', status: '' });

    const handleSearchSubmit = (e) => {
        setSeachVal(e.target.value);
        handleSearchChange(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleClearFilters = () => {
        setFilters({ location: ["Kanpur", "Noida"], workAllocation: '', status: '' });
    };

    const filteredData = data.filter((employee) => {
        return (
            // (filters.location === '' || employee.location.includes(filters.location)) &&
            // (filters.workAllocation === '' || employee.workAllocation.includes(filters.workAllocation)) &&
            // (filters.status === '' || employee.status === filters.status)
            true
        );
    });

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-gray-500">{subtitle}</p>
                </div>
                <button className="bg-[#1d6ba3] text-white px-4 py-2 rounded">+ {addBtnTitle}</button>
            </div>
            <div className="mb-4 flex justify-between">
                <div className="">
                    <Input label={"Search ID, Name & Title"} name={"Search"} value={searchVal} handleChange={handleSearchSubmit} />
                </div>
                <div className="flex items-center justify-end relative">
                    <button className="bg-gray-200 text-gray-600 px-4  rounded flex items-center p-2 hover:bg-gray-300" onClick={() => setShowModal(!showModal)}>
                        <FaFilter className="mr-2" /> FILTER
                    </button>
                    {showModal && <FilterComponent filters={filters} handleFilterChange={handleFilterChange} handleClearFilters={handleClearFilters} />}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">ID</th>
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">Location</th>
                            <th className="py-2 px-4 border">Work Allocation</th>
                            <th className="py-2 px-4 border">Skills</th>
                            <th className="py-2 px-4 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((employee, index) => (
                            <tr key={index} className="border-t">
                                <td className="py-2 px-4 border">{employee.id}</td>
                                <td className="py-2 px-4 border">
                                    <div className="flex items-center">
                                        <img src="https://placehold.co/32x32" alt={`Profile of ${employee.name}`} className="w-8 h-8 rounded-full mr-2" />
                                        <div>
                                            <div className="font-bold">{employee.name}</div>
                                            <div className="text-gray-500 text-sm">{employee.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border">{employee.location}</td>
                                <td className="py-2 px-4 border font-bold">{employee.workAllocation}</td>
                                <td className="py-2 px-4 border">
                                    {employee.skills.map((skill, i) => (
                                        <span key={i} className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-1">{skill}</span>
                                    ))}
                                </td>
                                <td className="py-2 px-4 border">
                                    <span className={`inline-block px-2 py-1 rounded text-xs ${employee.status === 'Active' ? 'bg-green-100 text-green-700' : employee.status === 'Pending' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                        {employee.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div>
                    Rows per page:
                    <select>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div>1-5 of {filteredData.length}</div>
            </div>
        </div>
    );
};

export default Table;
