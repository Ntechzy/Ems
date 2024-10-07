'use client'
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { fireworks } from "@tsparticles/fireworks"
import BirthdayCard from "@/components/BirthDayCard";
import toast from "react-hot-toast";
import axiosRequest from "@/lib/axios";
import Loader from "@/components/Loader";

const Page = () => {
  const [init, setInit] = useState(false);
  const [birthdays , setBirthdays] = useState([]);
  const [loading , setLoading] = useState(true);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      let particleAnimation = await fireworks(engine  , {sounds:true})
      setTimeout(() => {
        particleAnimation.stop();
      }, 10000);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  let options = useMemo(()=>({
    duration:3
  }))
 
  const fetchTodaysBirthdays = async()=>{
    const todaysdate = new Date();
    try {
      const res = await axiosRequest.get(`/resources/birthday?date=${todaysdate.toLocaleDateString()}`);
      const data = await res.data.data;
      setBirthdays(data);
    } catch (err) {
      console.log(err);
      toast.error("Some Error Occured While fetching Birthdays" , {position:"top-center"});
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchTodaysBirthdays();
  },[]);

 

  return (
    <div className="min-h-screen  bg-gradient-to-r from-blue-300 to-blue-300 p-10">
      <p className="text-5xl text-center font-bold drop-shadow-lg pb-9 text-red-500">Today's BirthDay</p>
      <div className="flex items-center justify-center gap-12 overflow-x-auto h-full ">
        {
          birthdays.length ? birthdays.map((item , id)=>{
            return (
              <BirthdayCard key={id} name={item.name} userId={item.userId}/>
            )
          }):
            loading ? 
          <Loader/>:
            <p className="text-4xl mt-12">No Birthday Today</p>
        }
       
      </div>
      {init  && birthdays.length && <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options}/>}
    </div>
  )
};

export default Page;

