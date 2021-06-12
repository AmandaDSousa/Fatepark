import {apiBaseService} from "./apiBaseService";

export function parkingPlacesService() {
  const resource = "parking-places";

  async function getAllPaged(page, pageSize) {
    const response = await apiBaseService.get(`${resource}/${page}/${pageSize}`);

    const [items, count] = response.data;

    return { items, count };
  }

  async function getOccupiedRelation() {
    const response = await apiBaseService.get(`${resource}/occupied-relation`);

    return response.data
  }

  function update(user) {
    return apiBaseService.put(`${resource}/${user.id}`, user);
  }

  return { getAllPaged, getOccupiedRelation, update }
}
