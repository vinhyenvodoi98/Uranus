'use client';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endTimestamp: number;
  type: string;
}
export default function CountDown({ endTimestamp, type }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  function calculateTimeLeft() {
    const currentTime = new Date().getTime();
    const difference = endTimestamp - currentTime;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTimestamp]);

  if (type === 'right') {
    return (
      <div className='flex gap-5 m-auto p-4'>
        <div>
          <span className='countdown font-mono text-3xl'>
            <span style={{ '--value': timeLeft.days } as React.CSSProperties} ></span>
          </span>
          days
        </div>
        <div>
          <span className='countdown font-mono text-3xl'>
            <span style={{ '--value': timeLeft.hours } as React.CSSProperties}></span>
          </span>
          hours
        </div>
        <div>
          <span className='countdown font-mono text-3xl'>
            <span style={{ '--value': timeLeft.minutes } as React.CSSProperties}></span>
          </span>
          min
        </div>
        <div>
          <span className='countdown font-mono text-3xl'>
            <span style={{ '--value': timeLeft.seconds } as React.CSSProperties}></span>
          </span>
          sec
        </div>
      </div>
    );
  } else if (type === 'colons') {
    return (
      <span className='countdown font-mono text-2xl'>
        <span style={{ '--value': timeLeft.days } as React.CSSProperties} ></span>:
        <span style={{ '--value': timeLeft.hours } as React.CSSProperties}></span>:
        <span style={{ '--value': timeLeft.minutes } as React.CSSProperties}></span>:
        <span style={{ '--value': timeLeft.seconds } as React.CSSProperties}></span>
      </span>
    );
  } else {
    return (
      <div className='w-full grid grid-cols-4 place-items-center gap-5 text-center auto-cols-max'>
        <div className='flex flex-col'>
          <span className='countdown font-mono text-5xl'>
            <span style={{ '--value': timeLeft.days } as React.CSSProperties} ></span>
          </span>
          days
        </div>
        <div className='flex flex-col'>
          <span className='countdown font-mono text-5xl'>
            <span style={{ '--value': timeLeft.hours } as React.CSSProperties}></span>
          </span>
          hours
        </div>
        <div className='flex flex-col'>
          <span className='countdown font-mono text-5xl'>
            <span style={{ '--value': timeLeft.minutes } as React.CSSProperties}></span>
          </span>
          min
        </div>
        <div className='flex flex-col'>
          <span className='countdown font-mono text-5xl'>
            <span style={{ '--value': timeLeft.seconds } as React.CSSProperties}></span>
          </span>
          sec
        </div>
      </div>
    );
  }
}
