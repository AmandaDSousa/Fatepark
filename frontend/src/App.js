import {BrowserRouter as Router, Switch} from "react-router-dom";

import {ProvideAuth} from "./providers/ProvideAuth";
import {Login} from "./pages/Login";

import './App.css';
import {PrivateRoute} from "./components/PrivateRoute";
import {Employees} from "./pages/Employees";
import {LoginRoute} from "./components/LoginRoute";

function App() {
  return (
    <ProvideAuth>
      <Router>
        <div className="App">
          <h1>Fatepark</h1>

          <Switch>
            <LoginRoute path={"/login"}>
              <Login />
            </LoginRoute>

            <PrivateRoute path={"/"}>
              <Employees/>
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

export default App;
