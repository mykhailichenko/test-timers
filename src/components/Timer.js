import {useEffect, useRef} from 'react';

import useTimer from '../hooks/useTimer';

import styles from './timer.module.css';

//Formatting time before displaying
const formatTime = (time) => {
    if(time < 10) {
        return `00:0${time}`;
    } else if(time > 59) {
        return `01:00`;
    } else {
        return `00:${time}`;
    }
};

const Timer = ({ timerData, status, activeTimer, setActiveTimer, deleteTimer }) => {
    const circleRef = useRef(null);

    const timer = useTimer(timerData.time);

    //Define behavior in case of different statuses
    useEffect(() => {
        switch (status) {
            case 'active':
                if (timerData.priority <= activeTimer) {
                    timer.startTimer();
                }
                break;
            case 'stopped':
                timer.stopTimer();
                break;
            case 'paused':
                timer.pauseTimer();
                break;
            default:
                timer.stopTimer();
        }
    }, [status, activeTimer]);

    //Pass "start" for next timer
    useEffect(() => {
        if(timer.currentTime === timerData.changeStatusAfter) {
            setActiveTimer(activeTimer + 1);
        }
    }, [timer.currentTime])

    //For circle animation
    useEffect(() => {
        if (circleRef) {
            const initialRadius = circleRef.current.r.baseVal.value;
            const circumference = 2 * Math.PI * initialRadius;
            circleRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
            circleRef.current.style.strokeDashoffset = circumference;

            circleRef.current.style.strokeDashoffset = circumference - timer.currentTime / 60 * circumference;
        }
    }, [timer.currentTime])

    const showTime = formatTime(timer.currentTime);

    return (
        <div className={styles.timer_container}>
            <span>{timerData.time} seconds</span>

            <div className={styles.timer_item}>
                {showTime}

                <svg className={styles.timer_circle}>
                    <circle
                        className={styles.timer_progress}
                        cx='50'
                        cy='50'
                        r="47.5"
                        ref={circleRef}
                    ></circle>
                </svg>
            </div>

            <div className={styles.timer_delete} onClick={() => deleteTimer(timerData.id)}>
                <span>X</span>
            </div>
        </div>
    );
};

export default Timer;
