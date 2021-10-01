import {getToken} from "../../api/authenticationService";
import {getCurrentGame} from "../player/AvailablePlayers";

export const incrementPoints = (thatObject, playerUuid) => {
    let others = [...thatObject.state.gamePlayers].filter(i => i.playerUuid !== playerUuid);
    let updatedPlayer = [...thatObject.state.gamePlayers].filter(i => i.playerUuid === playerUuid)[0];
    let points = updatedPlayer.points
    points++;
    updatedPlayer.points = points

    others.push(updatedPlayer)
    console.log('others -> ' + JSON.stringify(others))
    thatObject.setState({
            gamePlayers: [...new Set(others)]
        }
    )
    let updatedPlayerElement = updatedPlayer;
    updatedPlayerElement.gameUuid = getCurrentGame()
    updatedPlayerElement.messageType = 'UpdatePlayerInGameRequest'
    let body = JSON.stringify(updatedPlayerElement);
    console.log("body -> " + body)
    fetch('/game/player', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: body,
    })
    console.log("gamePlayers -> " + others)

}
export const decrementPoints = (thatObject, playerUuid) => {


}
export const incrementAdditionalPoints = (thatObject) => {

}
export const decrementAdditionalPoints = (thatObject) => {

}
export const incrementPenalties = (thatObject) => {

}
export const decrementPenalties = (thatObject) => {

}

export const incrementWasKilled = (thatObject) => {

}
export const decrementWasKilled = (thatObject) => {

}