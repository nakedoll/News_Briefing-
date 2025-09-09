import React, { useState, useEffect } from 'react';

interface WaitingDisplayProps {
  targetTime: Date | null;
}

const WaitingDisplay: React.FC<WaitingDisplayProps> = ({ targetTime }) => {
    const calculateTimeLeft = () => {
        if (!targetTime) return null;

        const difference = targetTime.getTime() - new Date().getTime();
        let timeLeft: { hours?: string; minutes?: string; seconds?: string } | null = null;

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
                minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
                seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-lg animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-slate-700 font-sans">오전 7시 30분에 브리핑이 시작됩니다.</h2>
            <p className="text-slate-500 mt-2 font-sans">오늘의 최신 창업 뉴스를 곧 만나보실 수 있습니다.</p>
            {timeLeft && (
                 <div className="mt-6 text-4xl font-bold text-slate-800 tracking-wider font-mono bg-slate-100 px-4 py-2 rounded-lg">
                    <span>{timeLeft.hours}</span>:<span>{timeLeft.minutes}</span>:<span>{timeLeft.seconds}</span>
                 </div>
            )}
        </div>
    );
};

export default WaitingDisplay;
