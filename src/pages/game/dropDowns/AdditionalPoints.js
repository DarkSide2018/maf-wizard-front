import React, {Component} from "react";
import {getToken} from "../../../api/authenticationService";
import './Drop.css';
import {getCurrentGame} from "../../../common/Common";


const regexp = /\d+\.\d{1,2}/;

export class AdditionalPoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            playerName: '',
            currentNote: 0.0,
            players: props.players,
            isOpen: false,
            availablePoints: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
        };
    }

    componentDidMount() {
        const {playersToSlot, editProp, slot} = this.props
        let filteredSlot = playersToSlot.filter(item => item.slot === slot)
        let currentNote
        if (filteredSlot !== undefined && filteredSlot.length > 0) {
            if (filteredSlot[0].addPoints !== undefined) {

                currentNote = filteredSlot[0].addPoints
            }
        }
        if (currentNote !== undefined) {
            this.setState(
                {
                    edit: editProp,
                    currentNote: currentNote
                }
            )
        }
    }

    setNote(value) {
        const {slot} = this.props
        let pls = {
            slot: slot,
            addPoints: value
        }
        this.setState(
            {
                currentNote: value
            }
        )
        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'ACTIVE',
            messageType: 'UpdateGameRequest',
            playerToCardNumber: [pls]
        }
        fetch('/game', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(gameCommand),
        });
    }

    handlePointsChange = event => {
        this.setState({
            currentNote: event.target.value
        })
    }

    onKeyDown = (event) => {
        // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            this.handleClickAdd(this.state.currentNote);
        }
    }

    handleClickAdd(value) {
        let match = regexp.test(value);
        if (match && value.length < 5) {
            const {slot} = this.props
            let pls = {
                slot: slot,
                addPoints: value
            }
            this.setState(
                {
                    currentNote: value
                }
            )
            let gameCommand = {
                gameUuid: getCurrentGame(),
                status: 'ACTIVE',
                messageType: 'UpdateGameRequest',
                playerToCardNumber: [pls]
            }
            fetch('/game', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(gameCommand),
            });
        } else {
            alert("Данные нужно ввести в формате 0.00")
        }

    }

    render() {
        const {currentNote} = this.state
        return <div style={{width: "50%"}}>
            <input
                type="text"
                style={{width: "100%"}}
                placeholder="0.0"
                value={currentNote}
                onChange={this.handlePointsChange}
                onKeyDown={this.onKeyDown}
            />
        </div>
    }
}

export default AdditionalPoints;