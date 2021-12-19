import {getToken} from "../../../api/authenticationService";
import {getCurrentGame} from "../../player/AvailablePlayers";

export const updatePlayerInCurrentGame = (player) =>{
    player.gameUuid = getCurrentGame()
    player.messageType = 'UpdatePlayerInGameRequest'
    let body = JSON.stringify(player);
    fetch('/game/player', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: body,
    })
}
export const updatePlayersArrayToFreeStatus = (players) =>{
    let playersArray = players.map(function (item){
        item.status = 'FREE'
        item.messageType = 'UpdatePlayerRequest'
        return item ;
    });
    let query = {
        messageType: "UpdatePlayerArrayRequest",
    }
    query.players = playersArray
    let body = JSON.stringify(query);
    fetch('/player', {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: body,
    })
}
export const setOthersIntoState = (thatObject,others)=>{
    thatObject.setState({
            gamePlayers: [...new Set(others.sort((a, b) => a.nickName.localeCompare(b.nickName)))]
        }
    )
}
export const incrementPoints = (thatObject, playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.points
    points++;
    updatedPlayer.points = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}

export const decrementPoints = (thatObject, playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.points
    points--;
    updatedPlayer.points = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}

export const incrementAdditionalPoints = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.additionalPoints
    points++;
    updatedPlayer.additionalPoints = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementAdditionalPoints = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.additionalPoints
    points--;
    updatedPlayer.additionalPoints = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const incrementPenalties = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.penalties
    points++;
    updatedPlayer.penalties = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)

}
export const decrementPenalties = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.penalties
    points--;
    updatedPlayer.penalties = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)

}

export const incrementWasKilled = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.wasKilled
    points++;
    updatedPlayer.wasKilled = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementWasKilled = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.wasKilled
    points--;
    updatedPlayer.wasKilled = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementBestMove = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.bestMove
    points--;
    updatedPlayer.bestMove = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const incrementBestMove = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.bestMove
    points++;
    updatedPlayer.bestMove = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}

export const incrementVictoryRed = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.victoriesRed
    points++;
    updatedPlayer.victoriesRed = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementVictoryRed = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.victoriesRed
    points--;
    updatedPlayer.victoriesRed = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementDefeatRed = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.defeatRed
    points--;
    updatedPlayer.defeatRed = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const incrementDefeatRed = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.defeatRed
    points++;
    updatedPlayer.defeatRed = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const incrementVictoryBlack = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.victoriesBlack
    points++;
    updatedPlayer.victoriesBlack = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementVictoryBlack = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.victoriesBlack
    points--;
    updatedPlayer.victoriesBlack = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}

export const incrementDefeatBlack = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.defeatBlack
    points++;
    updatedPlayer.defeatBlack = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementDefeatBlack = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.defeatBlack
    points--;
    updatedPlayer.defeatBlack = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementDon = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.don
    points--;
    updatedPlayer.don = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const incrementDon = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.don
    points++;
    updatedPlayer.don = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const incrementSheriff = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.sheriff
    points++;
    updatedPlayer.sheriff = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const decrementSheriff = (thatObject,playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.sheriff
    points--;
    updatedPlayer.sheriff = points
    others.push(updatedPlayer)
    setOthersIntoState(thatObject,others)
    updatePlayerInCurrentGame(updatedPlayer)
}
export const endGame = (thatObject) => {

    let gamePlayers = thatObject.state.gamePlayers;

    updatePlayersArrayToFreeStatus(gamePlayers)

    let query = {
        messageType: "UpdateGameRequest",
        gameUuid: getCurrentGame(),
        players: gamePlayers,
        status:'FINISHED'
    }
    let body = JSON.stringify(query);
    fetch('/game', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: body,
    })
    removeGameUuid()
}

export const removeGameUuid= ()=>{
    localStorage.removeItem('GAME_UUID');
}