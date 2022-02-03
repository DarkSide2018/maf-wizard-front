import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {getCurrentGame} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";

import './Drop.css';
import {generateGuid} from "../GameTicketFast";

class Drop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableSlots:[0,1,2,3,4,5,6,7,8,9,10],
            playerSlot: 0,
            players: props.players,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setPlayerSlot = this.setPlayerSlot.bind(this);
    }

    componentDidMount() {
        const {type, nightNumber, nights} = this.props
        console.log("nights object => " + JSON.stringify(nights))
        let filteredNight = nights.filter(item => item.nightNumber === nightNumber)
        let slot = 0
        if (filteredNight !== undefined && filteredNight.length > 0) {
            if (type === 'killedPlayer' && filteredNight[0].killedPlayer !== undefined) {
                slot = filteredNight[0].killedPlayer
            } else if (type === 'sheriffChecked' && filteredNight[0].sheriffChecked !== undefined) {
                slot = filteredNight[0].sheriffChecked
            } else if (type === 'donChecked' && filteredNight[0].donChecked !== undefined) {
                slot = filteredNight[0].donChecked
            } else if (type === 'leftGame' && filteredNight[0].playerLeftGame !== undefined) {
                slot = filteredNight[0].playerLeftGame
            }
        }
        this.setState(
            {
                playerSlot: slot
            }
        )
    }

    toggle() {
        let currentState = this.state.isOpen
        this.setState(
            {
                isOpen: !currentState
            }
        )
    }

    setPlayerSlot(value) {
        const {type, nightNumber} = this.props
        let night = {
            nightNumber: nightNumber
        }
        if (type === 'killedPlayer') {
            night.killedPlayer = value
        } else if (type === 'sheriffChecked') {
            night.sheriffChecked = value
        } else if (type === 'donChecked') {
            night.donChecked = value
        } else if (type === 'leftGame') {
            night.playerLeftGame = value
        }
        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'ACTIVE',
            messageType: 'UpdateGameRequest',
            nights: [night]
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
        this.setState(
            {
                playerSlot: value
            }
        )

    }


    render() {
        let slots = this.state.availableSlots
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"} caret>
                    {this.state.playerSlot}
                </DropdownToggle>
                <DropdownMenu>
                    {slots.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setPlayerSlot(item)}
                                             key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default Drop;