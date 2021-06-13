import {apiBaseService} from "./apiBaseService";

export function affiliatedParkingService() {
  const resource = "affiliated";

  async function getAllPaged(page, pageSize) {
    const response = await apiBaseService.get(`${resource}/${page}/${pageSize}`);

    const [items, count] = response.data;

    return { items, count };
  }

  function create(affiliated) {
    return apiBaseService.post(`${resource}`, affiliated);
  }

  function update(affiliated) {
    return apiBaseService.put(`${resource}/${affiliated.id}`, affiliated);
  }

  function deleteAffiliated(id) {
    return apiBaseService.delete(`${resource}/${id}`);
  }

  return { getAllPaged, create, update, deleteAffiliated }
}