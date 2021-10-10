import React, {Component} from "react";
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {generateGuid} from "./GameTicket";


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
    setRole(value){
        this.setState(
            {
                currentRole: value
            }
        )
    }
    render() {
        const {roles} = this.props

        if (this.state.currentRole !== '') {
            return <div>
                {this.state.currentRole}
            </div>
        }
        return <div>

            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    Dropdown
                </DropdownToggle>
                <DropdownMenu>
                    {roles.map(item => {
                        return <DropdownItem onClick={()=>this.setRole(item)} key={generateGuid()}>{item}</DropdownItem>
                    })}
                </DropdownMenu>
            </Dropdown>
        </div>
    }
}

export default DropDownRole;