
import AppNavbar from "../AppNavbar";
import React, {useContext, useState} from 'react';
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
                <AvailablePlayers/>
        </div>);
    }

}

export default NewTable;

