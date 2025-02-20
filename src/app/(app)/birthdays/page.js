"use client";
import { useEffect, useState } from "react";
import { initParticlesEngine } from "@tsparticles/react";
import { fireworks } from "@tsparticles/fireworks";
import BirthdayCard from "@/components/BirthDayCard";
import toast from "react-hot-toast";
import axiosRequest from "@/lib/axios";
import Loader from "@/components/Loader";

const Page = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  let birthdaySound;

  // Function to play the song
  const playBirthdaySong = () => {
    if (!audioPlayed) {
      birthdaySound = new Audio("/hpsong.mp3");
      birthdaySound.volume = 0.5;
      birthdaySound.play().catch((error) => console.log("Error playing sound:", error));
      setAudioPlayed(true);
    }
  };

  useEffect(() => {
    if (birthdays.length) {
      document.addEventListener("click", playBirthdaySong, { once: true });

      initParticlesEngine(async (engine) => {
        let particleAnimation = await fireworks(engine, { sounds: false });

        setTimeout(() => {
          if (birthdaySound) {
            birthdaySound.pause();
            birthdaySound.currentTime = 0;
          }
          particleAnimation.stop();
        }, 10000);
      });

      return () => {
        document.removeEventListener("click", playBirthdaySong);
        if (birthdaySound) {
          birthdaySound.pause();
          birthdaySound.currentTime = 0;
        }
      };
    }
  }, [birthdays]);

  const fetchTodaysBirthdays = async () => {
    const todaysdate = new Date();
    try {
      const res = await axiosRequest.get(`/resources/birthday?date=${todaysdate.toLocaleDateString()}`);
      const data = await res.data.data;
      setBirthdays(data);
    } catch (err) {
      toast.error("Some Error Occurred While fetching Birthdays", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysBirthdays();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-blue-500 p-2 md:p-10 overflow-hidden">

      <div className="absolute w-full h-full top-0 left-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="balloon"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <p className="text-3xl md:text-5xl text-center font-bold drop-shadow-lg pb-9 text-red-500 mt-9 md:mt-0">
        Today&apos;s BirthDay
      </p>
      <div className="flex items-center hide-scrollbar justify-center gap-12 overflow-x-auto h-full flex-col md:flex-row">
        {birthdays.length ? (
          birthdays.map((item, id) => <BirthdayCard key={id} name={item.name} userId={item.userId} />)
        ) : loading ? (
          <Loader />
        ) : (
          <p className="text-xl sm:text-4xl mt-8 sm:mt-12">No Birthday Today</p>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar {
          overflow-x: hidden;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .balloon {
          position: absolute;
          bottom: -100px;
          width: 50px;
          height: 70px;
          background-color: rgba(255, 0, 0, 0.7);
          border-radius: 50% 50% 40% 40%;
          animation: rise 5s linear infinite;
        }

        .balloon::before {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          width: 2px;
          height: 20px;
          background-color: rgba(255, 0, 0, 0.7);
          transform: translateX(-50%);
        }

        @keyframes rise {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
