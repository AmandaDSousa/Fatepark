import {apiBaseService} from "./apiBaseService";

export function usersService() {
  const resource = "users";

  async function getAllPaged(page, pageSize) {
    const response = await apiBaseService.get(`${resource}/${page}/${pageSize}`);

    const [items, count] = response.data;

    return { items, count };
  }

  function create(user) {
    return apiBaseService.post(`${resource}`, user);
  }

  function update(user) {
    return apiBaseService.put(`${resource}/${user.id}`, user);
  }

  return { getAllPaged, create, update }
}
