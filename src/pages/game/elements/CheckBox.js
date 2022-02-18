import React from "react";
import {getToken} from "../../../api/authenticationService";
import {getCurrentGame} from "../../../common/Common";

export function Checkbox(props) {
    let [checked1, setChecked1] = React.useState(false);
    let [checked2, setChecked2] = React.useState(false);
    let [checked3, setChecked3] = React.useState(false);
    let [checked4, setChecked4] = React.useState(false);
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
            notes: noteSum
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

    let checks = props.checks;
    let box1 = () => {
        let value = false
        if (checks !== undefined) value = checks.checked1
        return <input type="checkbox"
                      className={"styled-checkbox"}
                      defaultChecked={value}
                      onChange={() => handleChange1(!checked1)}/>
    }
    let box2 = () => {
        let value = false
        if (checks !== undefined) value = checks.checked2
        return <input type="checkbox"
                      className={"styled-checkbox"}
                      defaultChecked={value}
                      onChange={() => handleChange2(!checked2)}
        />
    }
    let box3 = () => {
        let value = false
        if (checks !== undefined) value = checks.checked3
        return <input type="checkbox"
                      className={"styled-checkbox"}
                      defaultChecked={value}
                      onChange={() => handleChange3(!checked3)}
        />
    }
    let box4 = () => {
        let value = false
        if (checks !== undefined) value = checks.checked4
        return <input type="checkbox"
                      className={"styled-checkbox"}
                      defaultChecked={value}
                      onChange={() => handleChange4(!checked4)}
        />
    }

    return (
        <div>
            <div>
                {box1()}
                {box2()}
            </div>
            <div>
                {box3()}
                {box4()}
            </div>
        </div>
    );
}