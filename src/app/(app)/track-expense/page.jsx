'use client'

import { DateIstConvert } from "@/lib/DateIstConvert";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const page = () => {
    const [search, setSearch] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");
    const [data, setData] = useState([])
    const [locationFilter, setLocationFilter] = useState("");
    const [filteredData, setFilteredData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/admin-actions/expense");

                setData(response.data.expenseSheet);

            } catch (error) {
                toast.error(`Error fetching data: ${error.message}`);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = data;

        if (search) {
            filtered = filtered.filter((item) =>
                item.createdBy.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (companyFilter) {
            filtered = filtered.filter((item) => item.company === companyFilter);
        }

        if (locationFilter) {
            filtered = filtered.filter((item) => item.location === locationFilter);
        }

        setFilteredData(filtered);
    }, [search, companyFilter, locationFilter, data]);

    return (
        <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
            {/* Filters Section */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by Created By..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4"
                />

                <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4"
                >
                    <option value="">Filter by Company</option>
                    {[...new Set(data.map((item) => item.company))].map((company) => (
                        <option key={company} value={company}>
                            {company}
                        </option>
                    ))}
                </select>

                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full md:w-1/4"
                >
                    <option value="">Filter by Location</option>
                    <option value="Noida">Noida</option>
                    <option value="Kanpur">Kanpur</option>
                </select>
            </div>

            <div>
                Total Amount :- {data.totalAmount}
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-[#114061] text-white">
                            <th className="px-4 py-2 text-left">Title</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Company</th>
                            <th className="px-4 py-2 text-left">Location</th>
                            <th className="px-4 py-2 text-left">Created By</th>
                            <th className="px-4 py-2 text-left">Created At</th>
                            <th className="px-4 py-2 text-left">Added At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={`${index % 2 === 0 ? "bg-blue-50" : "bg-white"
                                        }`}
                                >
                                    <td className="border px-4 py-2">{item.title}</td>
                                    <td className="border px-4 py-2">{item.amount}</td>
                                    <td className="border px-4 py-2">{item.company}</td>
                                    <td className="border px-4 py-2">{item.location}</td>
                                    <td className="border px-4 py-2">{item.createdBy.name}</td>
                                    <td className="border px-4 py-2">{DateIstConvert(item.createdAt)}</td>
                                    <td className="border px-4 py-2">{DateIstConvert(item.date)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center py-4 text-gray-500"
                                >
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default page;
