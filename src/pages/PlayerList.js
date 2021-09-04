import {Component} from "react";
import react,{useState} from 'react';
class PlayerList extends Component {

    constructor(props) {
        super(props);
        this.state = {players: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/players')
            .then(response => response.json())
            .then(data => this.setState({players: data}));
    }
    async remove(id) {
        await fetch(`/players/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedPlayers = [...this.state.players].filter(i => i.id !== id);
            this.setState({players: updatedPlayers});
        });
    }
    render() {
        const {players} = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <div className="App-intro">
                        <h2>Clients</h2>
                        {players.map(player =>
                            <div key={player.uuid}>
                                {player.nickName} ({player.points})
                            </div>
                        )}
                    </div>
                </header>
            </div>
        );
    }
}
export default PlayerList;

