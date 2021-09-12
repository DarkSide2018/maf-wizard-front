
import './App.css';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import  LoginPage from './pages/LoginPage';
import { Dashboard } from './pages/dashboard/dashboard';
import PlayerList from "./pages/player/PlayerList";
import PlayerEdit from "./pages/player/PlayerEdit";
import GameMasterList from "./pages/gameMaster/GameMasterList";
import GameMasterEdit from "./pages/gameMaster/GameMasterEdit";


function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route  path='/player/all' exact={true} component={PlayerList}/>
          <Route  path='/player/:id' component={PlayerEdit}/>
          <Route  path='/game/master/all' exact={true} component={GameMasterList}/>
          <Route  path='/game/master/:id' component={GameMasterEdit}/>
        </Switch>
      </BrowserRouter>
  );
}

export default App;
