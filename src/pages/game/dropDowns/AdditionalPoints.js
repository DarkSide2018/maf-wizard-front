import React, {Component} from "react";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "../GameTicket";
import {getCurrentGame} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";
import './Drop.css';


const regexp = /\d+\.\d{1,2}/;
export class AdditionalPoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            currentNote: 0.0,
            players: props.players,
            isOpen: false,
            availablePoints: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
        };
    }

    componentDidMount() {
        const {playersToSlot, slot} = this.props
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

    handleClickAdd(value) {
        let match = regexp.test(value);
        if(match && value.length < 5){
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
        }else{
            alert("Данные нужно ввести в формате 0.00")
        }

    }

    render() {
        const {currentNote} = this.state

        return <div style={{ width:"50%"}}>
            <input
                type="text"
                style={{width:"100%"}}
                placeholder="0.0"
                value={currentNote}
                onChange={this.handlePointsChange}
            /> <Button
            size="sm"
            variant="outline-danger"
            onClick={() => this.handleClickAdd(currentNote)}>
            Сохранить
        </Button>
        </div>
    }
}

export default AdditionalPoints;