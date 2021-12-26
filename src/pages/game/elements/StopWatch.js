import React from "react";
import useSound from 'use-sound';
import sound from './silence.mp3';

const formattedSeconds = (sec) =>
    Math.floor(sec / 60) +
    ':' +
    ('0' + sec % 60).slice(-2)


export class Stopwatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsElapsed: 0,
            incrementer: null
        };
    }


    handleStartClick() {
        if(this.state.incrementer !== null) return
        this.setState({
            incrementer: setInterval(() =>{
                    let seconds = this.state.secondsElapsed

                    this.setState({
                        secondsElapsed: seconds + 1

                    })
            }, 1000)
        });
    }

    handleStopClick() {
        clearInterval(this.state.incrementer);
        this.setState({
            incrementer: null
        });
    }

    handleResetClick() {
        clearInterval(this.state.incrementer);
        this.setState({
            incrementer: null,
            secondsElapsed: 0
        });
    }

    render() {
        return (
            <div className="stopwatch">
                <h1 className="stopwatch-timer">{formattedSeconds(this.state.secondsElapsed)}</h1>

                {(this.state.secondsElapsed === 0
                        ? <Button className="start-btn text-white" onClick={this.handleStartClick.bind(this)
                        }>start</Button>
                        : <StopButton className="stop-btn text-white" onClick={this.handleStopClick.bind(this)}>stop</StopButton>
                )}
                {(this.state.secondsElapsed !== 0
                        ? <Button className={"text-white"} onClick={this.handleResetClick.bind(this)}>reset</Button>
                        : null
                )}
            </div>
        );
    }
}

const Button = (props) => {
    return <button type="button"  {...props} className={"btn " + props.className}/>;
}
const StopButton = (props) => {

    return <button type="button" {...props} className={"btn " + props.className}/>;
}
