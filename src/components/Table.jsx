import { useEffect, useState } from "react";
import Input from "./Input";
import { FaFilter } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import Loader from "./Loader";
import { SelectField } from "./EmplRegister/SelectField";
import Select from "./Select";
import axiosRequest from "@/lib/axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const FilterComponent = ({ filters, handleFilterChange, handleClearFilters }) => {
    const [isLocationOpen, setLocationOpen] = useState(false);
    const [isDepartmentOpen, setDepartmentOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isDateOfJoiningOpen, setDateOfJoiningOpen] = useState(false);

    return (
        <div className="absolute top-14 p-4 w-[350px] bg-gray-100 shadow-2xl rounded-lg border-2" >
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

            {/* Status Filter */}
            <div className="mb-4">
                <button className="w-full flex justify-between items-center py-2" onClick={() => setIsStatusOpen(!isStatusOpen)}>
                    <span>Status</span>
                    <IoIosArrowDown className={`transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                </button>
                {isStatusOpen && (
                    <div className="mt-2 ml-2">
                        <select
                            name="currentStatus"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={filters.currentStatus}
                            onChange={handleFilterChange}>
                            <option value="">Select Status</option>
                            {filters.status.map((val, i) => (
                                <option key={i} value={val}>{val}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

const Table = ({ isModal, data, title = "Employees", subtitle = "Manage all your full-time, part-time & contractor employees.", addBtnTitle = "EMPLOYEE", handleSearchChange = () => { }, loading }) => {
    const [searchVal, setSeachVal] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        location: ["Kanpur", "Noida"],
        locations: ["Kanpur", "Noida"],
        department: '',
        departments: ["IT", "HR", "Engineering", "Finance", "Marketing"],
        dateOfJoining: '',
        currentStatus: "",
        status: ["Active", "Inactive"]
    });
    const [filteredData, setFilteredData] = useState(data);
    const [tableHeaders , setTableHeaders] = useState(["ID", "Name", "Location", "Department", "Date of Joining", "Status"])
    const availableRole = [{ label: "Employee", value: "user" }, { label: "Hr", value: "admin" }];
    const { data: session } = useSession();
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
        handlePrepareFilterOptions()
    };

    const handlePrepareFilterOptions = () => {
        const locations = [], departments = [];
        if (data.length) {
            data.map(employee => {
                !(locations.find(str => str == employee?.location)) && employee.location && locations.push(employee?.location);
                !(departments.find(department => department == employee?.department)) && employee.department && departments.push(employee?.department);
            })
            setFilters({
                location: locations,
                locations: locations,
                department: '',
                departments: departments,
                currentStatus: "",
                status: ["Active", "Inactive"]
            })
        }
    }
    const handleRoleChangeDropdown = async (userId, role) => {
        try {
            const res = await toast.promise(
                axiosRequest.patch("/user/updateRole", {
                    userId,
                    role
                }),
                {
                    loading: "Updating User Role..",
                    success: "User Role Updated Successfully",
                    error: "Error While Updating User Role"
                },
                {
                    position: "top-center"
                }
                // return res;
            )

        } catch (err) {
            toast.error("Some Error Occured While Updating User Role");
            console.log(err);
        }
    }

    useEffect(() => {
        handlePrepareFilterOptions();
        // remove Role from tableHeaders ( To be added)
        if((session?.user.role == "super_admin") && data && data.length){
            let arr = tableHeaders;
            arr.splice(arr.length - 1, 0, "Role")
            arr.find(elem=>elem == "Role") && setTableHeaders(arr)
        } ;
    }, [data])

    useEffect(() => {
        let filterData = data.filter((employee) => {
            const isLocationMatch = filters.location.length === 0 || filters.location.includes(employee?.location);
            const isDepartmentMatch = filters.department === '' || (employee?.department?.toUpperCase()) === filters.department;
            const isStatusMatch = filters.currentStatus === '' || (employee?.status?.toUpperCase()) === filters.currentStatus.toUpperCase();
            const isSameUser = session.user.id == employee.user_id;
            return isLocationMatch && isDepartmentMatch && isStatusMatch && !isSameUser;
        });
        setFilteredData(filterData);
    }, [filters, data]);


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
                    <button className="bg-gray-200 text-gray-600 px-4  rounded flex items-center p-2 hover:bg-gray-300 cursor-pointer" onClick={() => setShowModal(!showModal)} disabled={loading}>
                        <FaFilter className="mr-2" /> FILTER
                    </button>
                    {showModal && <FilterComponent filters={filters} handleFilterChange={handleFilterChange} handleClearFilters={handleClearFilters} />}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead>
                        <tr className="bg-gray-100">
                            {
                                tableHeaders.map((val, i) => (
                                    <th className="py-2 px-4 border" key={i}>{val}</th>
                                ))
                            }
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
                                {session?.user.role == "super_admin" && <td className="py-2 px-4 border text-center">
                                    <Select options={availableRole} selectedOptionValue={employee.role} onChange={handleRoleChangeDropdown} userId={employee.user_id} key={index} />
                                </td>}
                                <td className="py-2 px-4 border">
                                    <div className={`inline-block px-2 py-1 text-xs rounded-full text-white ${employee.status === "Active" ? "bg-green-500" : employee.status === "Pending" ? "bg-blue-500" : "bg-red-500"}`}>
                                        {employee.status}
                                    </div>
                                </td>
                            </tr>
                        )) :
                            !loading ?
                                <tr className="text-center" >
                                    <td colSpan={tableHeaders.length} className="p-4 text-gray-500  ">No Data</td>
                                </tr> :
                                <tr className="text-center">
                                    <td colSpan={tableHeaders.length} className="p-4 text-gray-500  ">
                                        <Loader />
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};



export default Table;
