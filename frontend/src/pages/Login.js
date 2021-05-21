import {useLocation, useHistory} from "react-router-dom";

import {useAuth} from "../hooks/useAuth";

export function Login() {
  const auth = useAuth();
  const location = useLocation();
  const history = useHistory();

  const { from } = location.state || { from: { pathname: "/" } };

  function handleLogin(event) {
    event.preventDefault();

    auth.login({ email: "takato@fatepark.com", password: "12345" }, () => history.replace(from));
  }


  return (
    <div>
      <h1>Login</h1>

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  )
}