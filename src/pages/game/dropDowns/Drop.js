import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {getToken} from "../../../api/authenticationService";

import './Drop.css';
import {generateAvailableSlots, generateGuid, getCurrentGame} from "../../../common/Common";

class Drop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableSlots:generateAvailableSlots(),
            playerSlot: 0,
            players: props.players,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setPlayerSlot = this.setPlayerSlot.bind(this);
    }

    componentDidMount() {
        const {type, nightNumber, nights} = this.props
        let parse = JSON.parse(nights);
        let filteredNight = parse.filter(item => item.nightNumber === nightNumber)
        let slot = 0
        if (filteredNight !== undefined && filteredNight.length > 0) {
            if (type === 'killedPlayer' && filteredNight[0].killedPlayer !== undefined) {
                slot = filteredNight[0].killedPlayer
            } else if (type === 'sheriffChecked' && filteredNight[0].sheriffChecked !== undefined) {
                slot = filteredNight[0].sheriffChecked
            } else if (type === 'donChecked' && filteredNight[0].donChecked !== undefined) {
                slot = filteredNight[0].donChecked
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