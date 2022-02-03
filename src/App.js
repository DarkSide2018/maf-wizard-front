import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import {Dashboard} from './pages/dashboard/dashboard';
import PlayerList from "./pages/player/PlayerList";
import PlayerEdit from "./pages/player/PlayerEdit";
import GameMasterList from "./pages/gameMaster/GameMasterList";
import GameMasterEdit from "./pages/gameMaster/GameMasterEdit";
import UserEdit from "./pages/user/UserEdit";
import GameList from "./pages/game/GameList";
import GameEdit from "./pages/game/GameEdit";

import GameWithConfirmedPlayers from "./pages/game/GameWithConfirmedPlayers";
import AvailablePlayers from "./pages/player/AvailablePlayers";
import GameHistory from "./pages/game/GameHistory";
import GameTicketFast from "./pages/game/GameTicketFast";


function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route exact path='/new/table' component={AvailablePlayers}/>
          <Route  path='/player/all' exact={true} component={PlayerList}/>
          <Route  path='/player/:id' component={PlayerEdit}/>
          <Route  path='/game/master/all' exact={true} component={GameMasterList}/>
          <Route  path='/game/master/:id' component={GameMasterEdit}/>
          <Route  path='/user/:id' component={UserEdit}/>
          <Route  path='/game/all' component={GameList}/>
          <Route  path='/game/history' component={GameHistory}/>
          <Route  path='/game/component/:id' component={GameEdit}/>
          <Route  path='/game/confirm' component={GameWithConfirmedPlayers}/>
          <Route  path='/game/ticket/:id' component={GameTicketFast}/>
          <Route  path='/game/fast/:id' component={GameTicketFast}/>
        </Switch>
      </BrowserRouter>
  );
}

export default App;
