import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import  LoginPage from './pages/LoginPage';
import { Dashboard } from './pages/dashboard/dashboard';
import PlayerList from "./pages/PlayerList";


function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route exact path="/players" component={PlayerList}/>
          {/*<Route exact path="/players/:id" component={PlayerEdit}/>*/}

        </Switch>
      </BrowserRouter>
  );
}

export default App;
