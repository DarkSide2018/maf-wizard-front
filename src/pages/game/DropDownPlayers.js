import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "./GameTicket";


class DropDownPlayers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            players: props.players,
            currentPlayer: '',
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setPlayer = this.setPlayer.bind(this);
    }

    componentDidMount() {
        this.setState(
            {
                players: this.props.players
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
    setPlayer(value){
        let name = value.nickName
        this.setState(
            {
                currentPlayer: name
            }
        )
    }
    render() {
        const {players} = this.state
        let currentPlayer='свободно'
        if (this.state.currentPlayer !== '') {
            currentPlayer = this.state.currentPlayer
        }
        return <div>

            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    item
                </DropdownToggle>
                <DropdownMenu>
                    {players.map(item => {
                        return <DropdownItem onClick={()=>this.setPlayer(item)} key={generateGuid()}>{item.nickName}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default DropDownPlayers;