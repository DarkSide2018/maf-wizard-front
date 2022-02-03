import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";

import './Drop.css';
import {getCurrentGame} from "../../player/AvailablePlayers";
import {getToken} from "../../../api/authenticationService";
import {generateGuid} from "../GameTicketFast";

export class DropDownRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            availablePlayers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            currentPlayer: 0,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setRole = this.setRole.bind(this);
    }

    componentDidMount() {
        this.setState(
            {
                availablePlayers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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

    setRole(value) {

        let gameCommand = {
            gameUuid: getCurrentGame(),
            role:  this.props.role,
            slot: value
        }
        console.log("gameCommand -> " + JSON.stringify(gameCommand))
        fetch('/game/role', {
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
                currentPlayer: value
            }
        )
    }

    render() {
        const {availablePlayers} = this.state
        let currentPlayer = '0'

        let currentSlot = this.props.currentSlot;
        console.log("currentSlot=> " + JSON.stringify(currentSlot))
        if (currentSlot !== 0) {
            currentPlayer = currentSlot
        }
        let statePlayer = this.state.currentPlayer;
        console.log("statePlayer=> " + JSON.stringify(statePlayer))
        if (statePlayer !== 0) {
            currentPlayer = statePlayer
        }
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"} caret>
                    {currentPlayer}
                </DropdownToggle>
                <DropdownMenu>
                    {availablePlayers.map(item => {
                        return <DropdownItem className={"dropStyle"} onClick={() => this.setRole(item)}
                                             key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default DropDownRole;