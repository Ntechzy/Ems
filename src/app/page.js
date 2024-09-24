'use client'
import Input from '@/component/Input'; 
import React, { useState } from 'react'

const page = () => {
  const [data, setData] = useState({
    Name: "",
    Email: "",
    Mobile_Number: "",
    Applying_for: "B.D.S",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  return (
    <div className='bg-[#1d6ba3] h-[100vh] flex justify-center items-center m-auto'>
      <Input
        name={"Name"}
        label={"Name"}
        handleChange={handleChange}
        value={data.Name}
      />
    </div>
  )
}

export default page