import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import {ProvideAuth} from "./providers/ProvideAuth";
import {Login} from "./pages/Login";

import './App.css';
import {AppLayout} from "./layouts/AppLayout/AppLayout";
import {PrivateRoute} from "./components/PrivateRoute";
import {LoginRoute} from "./components/LoginRoute";
import {Users} from "./pages/Users";
import {ParkingPlaces} from "./pages/ParkingPlaces";

function App() {
  return (
    <ProvideAuth>
      <Router>
        <div className="App">
          <Switch>
            <LoginRoute path={"/login"}>
              <Login />
            </LoginRoute>

            <Route>
              <AppLayout>
                <Switch>
                  <PrivateRoute path={"/"} exact>
                    <ParkingPlaces/>
                  </PrivateRoute>
                  <PrivateRoute path={"/users"} exact>
                    <Users/>
                  </PrivateRoute>
                </Switch>
              </AppLayout>
            </Route>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

export default App;
