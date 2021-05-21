import {Route, Redirect} from "react-router-dom";

import {useAuth} from "../hooks/useAuth";

export function LoginRoute({ children, ...rest }) {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}