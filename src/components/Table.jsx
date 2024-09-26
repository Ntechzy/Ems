import { useEffect, useState } from "react";
import Input from "./Input";
import { FaFilter } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

const FilterComponent = ({ filters, handleFilterChange, handleClearFilters }) => {
    const [isLocationOpen, setLocationOpen] = useState(false);
    const [isDepartmentOpen, setDepartmentOpen] = useState(false);
    const [isDateOfJoiningOpen, setDateOfJoiningOpen] = useState(false);

    return (
        <div className="absolute top-14 p-4 w-[350px] bg-gray-100 shadow-2xl rounded-lg border-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filter</h2>
                <button className="text-red-500 font-semibold" onClick={handleClearFilters}>CLEAR</button>
            </div>

            {/* Location Filter */}
            <div className="mb-4">
                <button className="w-full flex justify-between items-center py-2" onClick={() => setLocationOpen(!isLocationOpen)}>
                    <span>Location</span>
                    <IoIosArrowDown className={`transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLocationOpen && (
                    filters.locations.map((location, i) => (
                        <div className="mt-2 ml-2 flex justify-between text-gray-500" key={i}>
                            {location}
                            <input
                                type="checkbox"
                                className="size-4 cursor-pointer checked:bg-blue-400"
                                name="location"
                                value={location}
                                onChange={handleFilterChange}
                                checked={filters.location.includes(location)}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Department Filter */}
            <div className="mb-4">
                <button className="w-full flex justify-between items-center py-2" onClick={() => setDepartmentOpen(!isDepartmentOpen)}>
                    <span>Department</span>
                    <IoIosArrowDown className={`transform ${isDepartmentOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDepartmentOpen && (
                    <div className="mt-2 ml-2">
                        <select
                            name="department"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={filters.department}
                            onChange={handleFilterChange}>
                            <option value="">Select Department</option>
                            {filters.departments.map((dept, i) => (
                                <option key={i} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Date of Joining Filter */}
            <div className="mb-4">
                <button className="w-full flex justify-between items-center py-2" onClick={() => setDateOfJoiningOpen(!isDateOfJoiningOpen)}>
                    <span>Date of Joining</span>
                    <IoIosArrowDown className={`transform ${isDateOfJoiningOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDateOfJoiningOpen && (
                    <div className="mt-2 ml-2">
                        <input
                            type="date"
                            name="dateOfJoining"
                            value={filters.dateOfJoining}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const Table = ({ isModal, data, title = "Employees", subtitle = "Manage all your full-time, part-time & contractor employees.", addBtnTitle = "EMPLOYEE", handleSearchChange = () => { } }) => {
    const [searchVal, setSeachVal] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        location: ["Kanpur", "Noida"], // List of selected locations
        locations: ["Kanpur", "Noida", "Delhi", "Mumbai"], // Available locations
        department: '',
        departments: ["IT", "HR", "Engineering", "Finance", "Marketing"], // Available departments
        dateOfJoining: ''
    });

    const handleSearchSubmit = (e) => {
        setSeachVal(e.target.value);
        handleSearchChange(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "location") {
            const updatedLocations = checked
                ? [...filters.location, value]
                : filters.location.filter(loc => loc !== value);
            setFilters({ ...filters, location: updatedLocations });
        } else {
            setFilters({ ...filters, [name]: value });
        }
    };

    const handleClearFilters = () => {
        setFilters({
            location: [],
            locations: ["Kanpur", "Noida", "Delhi", "Mumbai"],
            department: '',
            departments: ["IT", "HR", "Engineering", "Finance", "Marketing"],
            dateOfJoining: ''
        });
    };

    const filteredData = data.filter((employee) => {
        const isLocationMatch = filters.location.length === 0 || filters.location.includes(employee.location);
        const isDepartmentMatch = filters.department === '' || employee.department === filters.department;

        const [day, month, year] = employee.joiningDate.split('-');
        const formattedEmployeeDate = `${year}-${month}-${day}`;
        const employeeDate = new Date(formattedEmployeeDate);

        const filterDate = new Date(filters.dateOfJoining);

        const isDateMatch = filters.dateOfJoining === '' || employeeDate <= filterDate;

        return isLocationMatch && isDepartmentMatch && isDateMatch;
    });




    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-gray-500">{subtitle}</p>
                </div>
                <button onClick={() => isModal(true)} className="bg-[#1d6ba3] text-white px-4 py-2 rounded">+ {addBtnTitle}</button>
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
                            <th className="py-2 px-4 border">Department</th>
                            <th className="py-2 px-4 border">Date of Joining</th>
                            <th className="py-2 px-4 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.length ? filteredData.map((employee, index) => (
                            <tr key={index} className="border-t">
                                <td className="py-2 px-4 border">{employee.id}</td>
                                <td className="py-2 px-4 border">
                                    <Link href={employee.link || "#"} className="flex flex-col md:flex-row items-center">
                                        <img src="https://img.freepik.com/free-photo/beautiful-male-half-length-portrait-isolated-white-studio-background-young-emotional-hindu-man-blue-shirt-facial-expression-human-emotions-advertising-concept-standing-smiling_155003-25250.jpg?w=826&t=st=1727176643~exp=1727177243~hmac=d883f4c6ab692bb09bd6684c8e42efc270bca8adb3487e5b4b5a5eaaaf36fab3" alt={`Profile of ${employee.name}`} className="w-8 h-8 rounded-full mr-2 object-cover" />
                                        <div>
                                            <div className="font-bold">{employee.name}</div>
                                            <div className="text-gray-500 text-sm">{employee.title}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="py-2 px-4 border">{employee.location}</td>
                                <td className="py-2 px-4 border font-bold text-center">{employee.department}</td>
                                <td className="py-2 px-4 border text-center">
                                    <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">{employee.joiningDate}</span>
                                </td>
                                <td className="py-2 px-4 border">
                                    <div className={`inline-block px-2 py-1 text-xs rounded-full text-white ${employee.status === "Active" ? "bg-green-500" : employee.status === "Pending" ? "bg-blue-500" : "bg-red-500"}`}>
                                        {employee.status}
                                    </div>
                                </td>
                            </tr>
                        )) :
                            <tr className="text-center" >
                                <td colSpan={6} className="p-4 text-gray-500  ">No Data</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};



export default Table;
