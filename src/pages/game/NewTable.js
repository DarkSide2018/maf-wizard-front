
import AppNavbar from "../AppNavbar";
import React from 'react';
import CreateGame from "../game/CreateGame";
import AvailablePlayers from "../player/AvailablePlayers";


const PlayersContext = React.createContext("as")
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

