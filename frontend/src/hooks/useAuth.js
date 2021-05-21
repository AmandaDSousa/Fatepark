import {useContext} from "react";

import {authContext} from "../contexts/authContext";

export function useAuth() {
  return useContext(authContext);
}
