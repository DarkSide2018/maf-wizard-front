import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "./GameTicket";
import {getCurrentGame} from "../player/AvailablePlayers";
import {getToken} from "../../api/authenticationService";
import './Drop.css';

class AdditionalPoints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            currentNote:'',
            players: props.players,
            isOpen: false,
            availablePoints:[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
        };
        this.toggle = this.toggle.bind(this);
        this.setNote = this.setNote.bind(this);
    }

    componentDidMount() {
        const {playersToSlot,slot} = this.props
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

    toggle() {
        let currentState = this.state.isOpen
        this.setState(
            {
                isOpen: !currentState
            }
        )
    }

    setNote(value) {
        const {slot} = this.props
        let pls = {
            slot:slot,
            addPoints:value
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


    render() {
        const {availablePoints} = this.state
        let dropDownToggle = 'Cвободно'
        if (this.state.currentNote !== '') {
            dropDownToggle = this.state.currentNote
        }
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"}  caret>
                    {dropDownToggle}
                </DropdownToggle>
                <DropdownMenu>
                    {availablePoints.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setNote(item)} key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default AdditionalPoints;