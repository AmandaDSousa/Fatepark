import {apiBaseService} from "./apiBaseService";

export function paymentsService() {
  const resource = "payments";

  async function getAllPaged(page, pageSize) {
    const response = await apiBaseService.get(`${resource}/${page}/${pageSize}`);

    const [items, count] = response.data;

    return { items, count };
  }

  async function getCustomerLast(customerId) {
    const response = await apiBaseService.get(`${resource}/${customerId}/last-payment`);

    return response.data
  }

  function create(user) {
    return apiBaseService.post(`${resource}`, user);
  }

  return { getAllPaged, getCustomerLast, create }
}
