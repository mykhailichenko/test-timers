import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import Timer from '../components/Timer';

import styles from './timers.module.css';

//Get delay between timers and set priority
const sortTimes = (timesArr) => {
    timesArr.sort((a, b) => b.time - a.time);

    for (let i = 0; i < timesArr.length - 1; i++) {
        timesArr[i].changeStatusAfter = timesArr[i].time - timesArr[i + 1].time;
    }

    for (let i = 0; i < timesArr.length; i++) {
        timesArr[i].priority = i+1;
    }

    return timesArr;
};

const updateStorage = (timesArr) => {
    localStorage.setItem('timerSetup', JSON.stringify(timesArr));
};

const TimersPage = () => {
    //Time from input
    const [time, setTime] = useState(0);
    //Before timer creation pre-setup
    const [times, setTimes] = useState([]);

    const [status, setStatus] = useState('stopped');
    const [activeTimer, setActiveTimer] = useState(1);
    //Timer can be between 1 and 60
    const [err, setErr] = useState('');

    useEffect(() => {
        const savedTimes = JSON.parse(localStorage.getItem('timerSetup'));

        setTimes(savedTimes);
    }, [])

    const handleChangeInput = (e) => {
        setTime(Number(e.target.value));
    }

    const addNewTimer = () => {
        if(time > 0 && time < 61) {
            if(!times.some(item => item.time === time)) {
                const newTimes = sortTimes([
                    ...times,
                    {time, id: uuidv4()}
                ]);

                setTimes(newTimes);
                updateStorage(newTimes);
                setErr('');
            }
        } else {
            setErr('Please type number between 1 and 60!');
        }
    };

    const deleteAllTimers = () => {
        setTimes([]);
        updateStorage([]);
        setStatus('stopped');
    };

    const deleteTimer = (timerId) => {
        const updatedArray = times.filter(obj => obj.id !== timerId);

        setTimes(sortTimes(updatedArray));
        updateStorage(sortTimes(updatedArray));
    };

    const startAllTimers = () => {
        setStatus('active');
    };

    const stopAllTimers = () => {
        setStatus('stopped');
        setActiveTimer(1);
    };

    const resetAllTimers = async () => {
        await stopAllTimers();
        startAllTimers();
    };

    const pauseAllTimers = () => {
        setStatus('paused')
    }

    return(
        <>
            <div className={styles.timers_header}>
                <input
                    type='number'
                    className={styles.timers_input}
                    onChange={handleChangeInput}
                />
                <button
                    className={styles.timers_btn}
                    onClick={addNewTimer}
                    disabled={status !== 'stopped'}
                >
                    Add new Timer
                </button>

                <button className={styles.timers_btn} onClick={startAllTimers}>Start</button>
                <button className={styles.timers_btn} onClick={resetAllTimers}>Reset</button>
                {
                    status === 'paused' ?
                        <button className={styles.timers_btn} onClick={startAllTimers}>Resume</button>
                        :
                        <button className={styles.timers_btn} onClick={pauseAllTimers}>Pause</button>
                }
                <button className={styles.timers_btn} onClick={stopAllTimers}>Stop</button>
                <button className={styles.timers_deletebtn} onClick={deleteAllTimers}>Delete All</button>
            </div>

            {err && <span className={styles.timers_error}>{err}</span>}

            <div className={styles.timers_container}>
                {
                    times.map((timerData) => {
                        return (
                            <Timer
                                key={timerData.id}
                                timerData={timerData}
                                status={status}
                                activeTimer={activeTimer}
                                setActiveTimer={setActiveTimer}
                                deleteTimer={deleteTimer}
                            />
                        );
                    })
                }
            </div>
        </>
    );
};

export default TimersPage;