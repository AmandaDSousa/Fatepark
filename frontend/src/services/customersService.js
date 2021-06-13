import {apiBaseService} from "./apiBaseService";

export function customersService() {
  const resource = "customers";

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

  function deleteCustomer(id) {
    return apiBaseService.delete(`${resource}/${id}`);
  }

  async function getAllWithCpf(cpf) {
    const response = await apiBaseService.get(resource, { params: { cpf } });
    return response.data
  }

  return { getAllPaged, create, update, deleteCustomer, getAllWithCpf }
}
