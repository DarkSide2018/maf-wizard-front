import React, {Component} from 'react';
import {Navbar, NavbarBrand} from 'reactstrap';
import {Link} from 'react-router-dom';
import '../pages/dashboard/DashBoard.css';
export default class AppNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return <Navbar className={"bg-second"} dark style={{width:'103%'}}>
            <NavbarBrand tag={Link} to="/dashboard">Home</NavbarBrand>
        </Navbar>;
    }
}