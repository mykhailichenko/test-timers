import { useState, useEffect, useRef } from 'react';

const useTimer = (initialTime = 0) => {
    const [isActive, setIsActive] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    //Create ref to ensure correct timer management
    const timerRef = useRef(null);

    const startTimer = () => {
        setIsActive(true);
    };

    const pauseTimer = () => {
        setIsActive(false);
    };

    const stopTimer = () => {
        setIsActive(false);
        setCurrentTime(0);
    };

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                //Check if time greater that initial
                setCurrentTime(prevTime => {
                    if (prevTime + 1 > initialTime) {
                        pauseTimer();
                        return prevTime;
                    }
                    return prevTime + 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        //Delete timer after unmount
        return () => clearInterval(timerRef.current);
    }, [isActive, initialTime]);

    return { isActive, currentTime, startTimer, pauseTimer, stopTimer };
};

export default useTimer;
