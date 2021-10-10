import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "./GameTicket";


class Drop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            players: props.players,
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
        this.setPlayerName = this.setPlayerName.bind(this);
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

    setPlayerName(value) {
        this.setState(
            {
                playerName: value.nickName
            }
        )
    }


    render() {
        const {players} = this.props
        let dropDownTogglePlayerName = 'Cвободно'
        if (this.state.playerName !== '') {
            dropDownTogglePlayerName = this.state.playerName
        }
        return <div>

            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {dropDownTogglePlayerName}
                </DropdownToggle>
                <DropdownMenu>
                    {players.map(item => {
                        return <DropdownItem onClick={() => this.setPlayerName(item)} key={generateGuid()}>{item.nickName}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default Drop;