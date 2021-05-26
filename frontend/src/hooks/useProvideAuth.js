import {useState} from "react";

export function useProvideAuth() {
  const [user, setUser] = useState(localStorage.getItem("user_token"));

  function login(token, cb) {
    setUser(token);

    localStorage.setItem("user_token", token);

    cb();
  }

  function logout(cb) {
    setUser(null);

    localStorage.removeItem("user_token");

    cb();
  }


  return {
    user,
    login,
    logout
  };
}
