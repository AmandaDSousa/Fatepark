import {apiBaseService} from "./apiBaseService";

export function partnersService() {
  const resource = "partners";

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

  function deletePartner(id) {
    return apiBaseService.delete(`${resource}/${id}`);
  }

  return { getAllPaged, create, update, deletePartner }
}
