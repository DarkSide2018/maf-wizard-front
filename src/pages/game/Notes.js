import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "./GameTicket";
import {getCurrentGame} from "../player/AvailablePlayers";
import {getToken} from "../../api/authenticationService";
import './Drop.css';

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            currentNote:'',
            players: props.players,
            isOpen: false,
            availableNotes:[1,2,3,4]
        };
        this.toggle = this.toggle.bind(this);
        this.setNote = this.setNote.bind(this);
    }

    componentDidMount() {
        const {playersToSlot,slot} = this.props
        let filteredSlot = playersToSlot.filter(item => item.slot === slot)
        let currentNote
        if (filteredSlot !== undefined && filteredSlot.length > 0) {
            if (filteredSlot[0].note !== undefined) {
                currentNote = filteredSlot[0].note
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
            note:value
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
        const {availableNotes} = this.state
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
                    {availableNotes.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setNote(item)} key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default Notes;