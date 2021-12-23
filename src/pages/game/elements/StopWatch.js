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
        this.setState({
            incrementer: setInterval(() =>
                    this.setState({
                        secondsElapsed: this.state.secondsElapsed + 1
                    })
                , 1000)
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
            secondsElapsed: 0
        });
    }

    render() {
        return (
            <div className="stopwatch">
                <h1 className="stopwatch-timer">{formattedSeconds(this.state.secondsElapsed)}</h1>

                {(this.state.secondsElapsed === 0
                        ? <Button className="start-btn" onClick={this.handleStartClick.bind(this)
                        }>start</Button>
                        : <Button className="stop-btn" onClick={this.handleStopClick.bind(this)}>stop</Button>
                )}
                {(this.state.secondsElapsed !== 0
                        ? <Button onClick={this.handleResetClick.bind(this)}>reset</Button>
                        : null
                )}
            </div>
        );
    }
}

const Button = (props) => {
    const [playOn] = useSound(
        sound,
        {volume: 0.25}
    );
    return <button type="button" onMouseUp={() => {playOn()}} {...props} className={"btn " + props.className}/>;
}
