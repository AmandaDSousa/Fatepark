import {apiBaseService} from "./apiBaseService";

export function parkingLogsService() {
  const resource = "parking-logs";

  async function getAllPaged(page, pageSize) {
    const response = await apiBaseService.get(`${resource}/${page}/${pageSize}`);

    const [items, count] = response.data;

    return { items, count };
  }
  return { getAllPaged }
}
