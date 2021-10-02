import {getToken} from "../../api/authenticationService";
import {getCurrentGame} from "../player/AvailablePlayers";

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
export const setOthersIntoState = (thatObject,others)=>{
    thatObject.setState({
            gamePlayers: [...new Set(others)]
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