import React from "react";
import {getToken} from "../../../api/authenticationService";
import {getCurrentGame} from "../../player/AvailablePlayers";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMinus} from "@fortawesome/free-solid-svg-icons";
import {generateGuid} from "../GameTicket";

export function Search(props) {

    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([""]);
    const [currentName, setCurrentName] = React.useState("");
    const [createdPlayer, setCreatedPlayer] = React.useState("");
    const [isOpen, toggle] = React.useState(false);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    const handlePlayerChange = event => {
        setCreatedPlayer(event.target.value);
    };
    const handleClickCreate = value => {
        let queryItem = {
            nickName: value
        }
        fetch('/player', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(queryItem),
        }).then(r => {
            if(r.status === 400){
                alert("Такой игрок уже существует")
            }
        });
        setCurrentName(value)
    };

    React.useEffect(() => {
        let players = ["Новый Игрок"]
        fetch('/player/like/all/' + searchTerm, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                        data.players.sort((a, b) => a.nickName.localeCompare(b.nickName));
                        players = data.players.map(it => it.nickName);
                        console.log("players like => " + JSON.stringify(players))
                        setSearchResults(players);
                    }
                )
            }
        })
        setSearchResults(players);
    }, [searchTerm]);

    React.useEffect(() => {

        let gameCommand = {
            gameUuid: getCurrentGame(),
            status: 'ACTIVE',
            messageType: 'UpdateGameRequest',
            playerToCardNumber: ["pls"]
        }
        fetch('/game', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify(gameCommand),
        });
    }, [setCurrentName]);
    return (
        <div className="App">
            <Dropdown isOpen={isOpen} toggle={() => toggle(!isOpen)}>
                <DropdownToggle className={"dropStyle"} caret>
                    {currentName === "" ? (
                        <input
                            type="text"
                            placeholder="Search Player"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                    ) : null}
                    {currentName}
                    {currentName !== "" ? (
                        <Button
                            size="sm"
                            variant="outline-danger"
                            style={{marginLeft: "10px"}}
                            onClick={() => setCurrentName("")}>
                            <FontAwesomeIcon icon={faMinus}/>
                        </Button>
                    ) : null}
                </DropdownToggle>
                <DropdownMenu>
                    {searchResults.map(item => (
                        <DropdownItem className={"dropStyle"} onClick={() => setCurrentName(item)} key={generateGuid()}>
                            {item}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
                {currentName === "Новый Игрок" ? (
                    <div style={{marginTop: "10px"}}>
                        <input
                            type="text"
                            placeholder="Создать нового игрока"
                            value={createdPlayer}
                            onChange={handlePlayerChange}
                        /> <Button
                        size="sm"
                        variant="outline-danger"
                        style={{marginTop: "10px"}}
                        onClick={() => handleClickCreate(createdPlayer)}>
                        Создать
                    </Button>
                    </div>
                ) : null}
            </Dropdown>
        </div>
    );
}