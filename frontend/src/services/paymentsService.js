import {apiBaseService} from "./apiBaseService";

export function paymentsService() {
  const resource = "payments";

  async function getAllPaged(page, pageSize) {
    const response = await apiBaseService.get(`${resource}/${page}/${pageSize}`);

    const [items, count] = response.data;

    return { items, count };
  }

  function create(user) {
    return apiBaseService.post(`${resource}`, user);
  }

  return { getAllPaged, create }
}
