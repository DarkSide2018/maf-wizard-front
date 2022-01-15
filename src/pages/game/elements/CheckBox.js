import React from "react";
import {getCurrentGame} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";

export function Checkbox(props) {
    const [checked1, setChecked1] = React.useState(false);
    const [checked2, setChecked2] = React.useState(false);
    const [checked3, setChecked3] = React.useState(false);
    const [checked4, setChecked4] = React.useState(false);
    let [noteSum, setNoteSum] = React.useState(0);

    const handleChange1 = event => {
        setChecked1(event)
        processEvent(event)
    };
    const handleChange2 = event => {
        setChecked2(event)
        processEvent(event)
    };
    const handleChange3 = event => {
        setChecked3(event)
        processEvent(event)
    };
    const handleChange4 = event => {
        setChecked4(event)
        processEvent(event)
    };
    const processEvent = value => {
        if (value === true) noteSum++
        else noteSum--
        setNoteSum(noteSum)
        sendNotes(noteSum)
        console.log("noteSum=>" + noteSum)
    }
    const sendNotes = value => {
        let gameCommand = {
            gameUuid: getCurrentGame(),
            slot: props.slot,
            notes: value
        }
        fetch('/game/notes', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(gameCommand),
        });
    }
    return (
        <label>
            <input type="checkbox"
                   className={"styled-checkbox"}
                   defaultChecked={checked1}
                   onChange={() => handleChange1(!checked1)}
            />
            <input type="checkbox"
                   className={"styled-checkbox"}
                   defaultChecked={checked2}
                   onChange={() => handleChange2(!checked2)}
            />
            <input type="checkbox"
                   className={"styled-checkbox"}
                   defaultChecked={checked3}
                   onChange={() => handleChange3(!checked3)}
            />
            <input type="checkbox"
                   className={"styled-checkbox"}
                   defaultChecked={checked4}
                   onChange={() => handleChange4(!checked4)}
            />
        </label>
    );
}