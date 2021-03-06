import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import {ProvideAuth} from "./providers/ProvideAuth";
import {Login} from "./pages/Login";

import './App.css';
import {AppLayout} from "./layouts/AppLayout/AppLayout";
import {PrivateRoute} from "./components/PrivateRoute";
import {LoginRoute} from "./components/LoginRoute";
import {Users} from "./pages/Users";
import {ParkingPlaces} from "./pages/ParkingPlaces";
import {ParkingLogs} from "./pages/ParkingLogs";
import {Payments} from "./pages/Payments";
import {Customers} from "./pages/Customers";
import {Partners} from "./pages/Partners";

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
                    <ParkingPlaces />
                  </PrivateRoute>
                  <PrivateRoute path={"/parking-logs"} exact>
                    <ParkingLogs />
                  </PrivateRoute>
                  <PrivateRoute path={"/partners"} exact>
                    <Partners />
                  </PrivateRoute>
                  <PrivateRoute path={"/customers"} exact>
                    <Customers />
                  </PrivateRoute>
                  <PrivateRoute path={"/payments"} exact>
                    <Payments />
                  </PrivateRoute>
                  <PrivateRoute path={"/users"} exact>
                    <Users />
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
