'use client'
import { useEffect, useState } from "react";
import { initParticlesEngine } from "@tsparticles/react";
import { fireworks } from "@tsparticles/fireworks"
import BirthdayCard from "@/components/BirthDayCard";
import toast from "react-hot-toast";
import axiosRequest from "@/lib/axios";
import Loader from "@/components/Loader";

const Page = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(birthdays.length){
      initParticlesEngine(async (engine) => {
        let particleAnimation = await fireworks(engine, { sounds: true });
        setTimeout(() => {
          particleAnimation.stop();
        }, 10000);
      });
    }
  }, [birthdays]);

  

  const fetchTodaysBirthdays = async () => {
    const todaysdate = new Date();
    try {
      const res = await axiosRequest.get(`/resources/birthday?date=${todaysdate.toLocaleDateString()}`);
      const data = await res.data.data;
      setBirthdays(data);
    } catch (err) {
      console.log(err);
      toast.error("Some Error Occurred While fetching Birthdays", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodaysBirthdays();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-500 p-2 md:p-10">
      <p className="text-3xl md:text-5xl text-center font-bold drop-shadow-lg pb-9 text-red-500 mt-9 md:mt-0">Today&apos;s BirthDay</p>
      <div className="flex items-center justify-center gap-12 overflow-x-auto h-full flex-col md:flex-row">
        {
          birthdays.length ? birthdays.map((item, id) => {
            return (
              <BirthdayCard key={id} name={item.name} userId={item.userId} />
            );
          }) :
            loading ? <Loader /> :
              <p className="text-xl sm:text-4xl mt-8 sm:mt-12">No Birthday Today</p>
        }
      </div>
    </div>
  );
};

export default Page;
