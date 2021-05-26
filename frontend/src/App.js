import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import {ProvideAuth} from "./providers/ProvideAuth";
import {Login} from "./pages/Login";

import './App.css';
import {PrivateRoute} from "./components/PrivateRoute";
import {Users} from "./pages/Users";
import {LoginRoute} from "./components/LoginRoute";
import {AppLayout} from "./layouts/AppLayout/AppLayout";

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
