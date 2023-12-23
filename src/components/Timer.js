import {useEffect} from 'react';

const CountDown = ({ timer }) => {
    useEffect(() => {
        console.log(timer.currentTime);
        }, [timer.isActive]);

    return (
        <div style={{border: '1px solid black', width: 150}}>
            <div>Time: {timer.currentTime} seconds</div>
            <button onClick={timer.start} disabled={timer.isActive}>
                Start
            </button>
            <button onClick={timer.pause} disabled={!timer.isActive}>
                Pause
            </button>
            <button onClick={timer.stop}>
                Stop
            </button>
        </div>
    );
};

export default CountDown;
