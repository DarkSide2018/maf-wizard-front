import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "./GameTicket";
import {getCurrentGame} from "../player/AvailablePlayers";
import {getToken} from "../../api/authenticationService";

import './Drop.css';
class DropDownRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            roles: props.roles,
            currentRole: '',
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setRole = this.setRole.bind(this);
    }

    componentDidMount() {
        const {playersToSlot,slot} = this.props
        let filteredSlot = playersToSlot.filter(item => item.slot === slot)
        let currentRole
        if (filteredSlot !== undefined && filteredSlot.length > 0) {
            if (filteredSlot[0].playerUuid !== undefined) {
                currentRole = filteredSlot[0].role
            }
        }
        if (currentRole !== undefined) {
            this.setState(
                {
                    currentRole: currentRole
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
    setRole(value){
        const {slot} = this.props
        let pls = {
            slot:slot,
            role:value
        }
        this.setState(
            {
                currentRole: value
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
        this.setState(
            {
                currentRole: value
            }
        )
    }
    render() {
        const {roles} = this.props
        let currentRole = 'Свободно'
        if (this.state.currentRole !== '') {
            currentRole = this.state.currentRole

        }
        return <div>
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle className={"dropStyle"}  caret>
                    {currentRole}
                </DropdownToggle>
                <DropdownMenu>
                    {roles.map(item => {
                        return <DropdownItem className={"dropStyle"}  onClick={()=>this.setRole(item)} key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default DropDownRole;