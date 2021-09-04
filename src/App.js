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
import PlayerEdit from "./pages/PlayerEdit";


function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LoginPage}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route  path='/players' exact={true} component={PlayerList}/>
          <Route  path='/player/:id' component={PlayerEdit}/>

        </Switch>
      </BrowserRouter>
  );
}

export default App;
