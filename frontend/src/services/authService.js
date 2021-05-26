import {apiBaseService} from "./apiBaseService";

export function authService() {
  const resource = "login";

  async function login(credentials) {
    const response = await apiBaseService.post(resource, credentials);

    const { access_token } = response.data;

    return access_token;
  }

  return { login }
}