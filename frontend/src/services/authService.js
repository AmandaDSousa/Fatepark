export function authService() {
  const resource = "login";


  async function login(email, password) {
    const response = await fetch(`http://localhost:4000/${resource}`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    });
    const { access_token } = await response.json();

    return access_token;
  }

  return { login }
}