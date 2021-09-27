
import AppNavbar from "../AppNavbar";
import React, {useContext, useState} from 'react';
import CreateGame from "../game/CreateGame";
import AvailablePlayers from "../player/AvailablePlayers";
import PlayersContext from "../player/PlayersContext";

class NewTable extends React.Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
    }

    render() {
        return( <div className={"bg-dark App"}>
            <PlayersContext.Provider>
                <AppNavbar/>
                <CreateGame/>
                <AvailablePlayers/>
            </PlayersContext.Provider>
        </div>);
    }

}

export default NewTable;

