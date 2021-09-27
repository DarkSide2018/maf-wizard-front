import React from "react";

const PlayersContext = React.createContext({
    gamePlayers:[],
    setGamePlayers: () => {}
})

export default PlayersContext