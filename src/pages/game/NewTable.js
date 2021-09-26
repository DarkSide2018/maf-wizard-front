import {Component} from "react";
import AppNavbar from "../AppNavbar";
import React from 'react';
import CreateGame from "../game/CreateGame";
import AvailablePlayers from "../player/AvailablePlayers";



class NewTable extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    render() {
        return( <div className={"bg-dark App"}>
                <AppNavbar/>
                <CreateGame/>
                <AvailablePlayers/>
        </div>);
    }

}

export default NewTable;

