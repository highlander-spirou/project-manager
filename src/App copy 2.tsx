// // src/Timer.tsx

// import React, { useState, useEffect } from 'react';
// import supabase from './supabase';
// import { getPriorityLabel } from './enums'



// const App: React.FC = () => {
//   const [time, setTime] = useState(0);
//   const [isActive, setIsActive] = useState(false);
//   const [data, setData] = useState([])

//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null;

//     interval = setInterval(() => {
//       if(data[0] !== undefined) {
//         const today = new Date()
//         const checkin = new Date(data[0].created_at)
//         const differenceInMilliseconds = today.valueOf() - checkin.valueOf();
//         setTime(Math.round(differenceInMilliseconds / 1000))
//       }

//     }, 1000);

//     return () => {
//       if (interval) {
//         clearInterval(interval);
//       }
//     };
//   }, [data, time]);

//   useEffect(() => {
//     async function fetch() {
//       const { data } = await supabase.from('current_project').select(`
//         id, created_at, project-list (*)
//       `)
//       setData(data)
//     }
//     fetch()
//   }, [])


//   useEffect(() => {
//     console.log('data', data)
//   }, [data])

//   const toggleTimer = () => {
//     setIsActive(!isActive);
//   };

//   const resetTimer = () => {
//     setIsActive(false);
//     setTime(0);
//   };

//   const formatDate = (date) => {
//     const dt = new Date(date)
//     return dt.toLocaleDateString()
//   }

//   return (
//     <div className="timer">
//       {data.map((x, index) => {
//         return <div key={index}>
//           <p>{x['project-list'].title}</p>
//           <p>{getPriorityLabel(x['project-list'].priority)}</p>
//           <p>Created at: {formatDate(x['project-list'].created_at)}</p>
//           <p>Checkin: {formatDate(x.created_at)}</p>
//           <p>{formatTime(time)}</p>
//         </div>
//       })}
//       {/* <div className="time">{formatTime(time)}</div>
//       <p>{time}</p>
//       <div className="controls">
//         <button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</button>
//         <button onClick={resetTimer}>Reset</button>
//       </div> */}
//     </div>
//   );
// };

// const formatTime = (seconds: number) => {
//   if(seconds > 3600) {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
//   }
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// };

// export default App;
import { useCallback, useEffect, useState } from "react";


const App = () => {
  const [countDownTime, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });


  const sampleDate = new Date("2023-11-05T06:07:16.154579+00:00")

  const getTimeDifference = (checkin: Date) => {

    const today = new Date();
    const timeDiffrence = today.valueOf() - checkin.valueOf();
    const hours = Math.floor(
      (timeDiffrence % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDiffrence % (60 * 60 * 1000)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDiffrence % (60 * 1000)) / 1000);
    setTime({ hours, minutes, seconds })

  };
  const startCountDown = useCallback(() => {
    setInterval(() => {
      getTimeDifference(sampleDate);
    }, 1000);
  }, []);


  useEffect(() => {
    startCountDown();
  }, [startCountDown]);


  return (
    <div className="mx-[100px] mt-10 w-[400px]">
      <div className="flex gap-3 flex-row bg-slate-800 h-36 rounded-lg pt-2 pr-3">

        <div className="hour-section flex flex-col w-32">
          <div className="hour-num h-16 mx-auto text-3xl text-slate-300 relative top-5">
            {countDownTime?.hours}
          </div>
          <div className="hour-text flex justify-center text-2xl text-slate-300">
            {countDownTime?.hours == 1 ? "Hour" : "Hours"}
          </div>
        </div>
        <div className="minute-section flex flex-col w-32">
          <div className="minute-num h-16 mx-auto text-3xl text-slate-300 relative top-5">
            {countDownTime?.minutes}
          </div>
          <div className="minute-text flex justify-center text-2xl text-slate-300">
            {countDownTime?.minutes == 1 ? "Minute" : "Minutes"}
          </div>
        </div>
        <div className="second-section flex flex-col w-32">
          <div className="second-num h-16 mx-auto text-3xl text-slate-300">
            <div className="relative top-5">{countDownTime?.seconds}</div>
          </div>
          <div className="second-text flex justify-center text-2xl text-slate-300">
            {countDownTime?.seconds == 1 ? "Second" : "Seconds"}
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;