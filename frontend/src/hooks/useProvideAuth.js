import {useState} from "react";
import {authService} from "../services/authService";

export function useProvideAuth() {
  const [user, setUser] = useState(localStorage.getItem("user_token"));

  async function login({email, password}, cb) {
    const token = await authService().login(email, password);

    setUser(token);

    localStorage.setItem("user_token", token);

    cb();
  }

  return {
    user,
    login,
  };
}
