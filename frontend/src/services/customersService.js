import {apiBaseService} from "./apiBaseService";

export function customerssService() {
  const resource = "customers";

  async function getAllWithCpf(cpf) {
    const response = await apiBaseService.get(resource, { params: { cpf } });
    return response.data
  }

  return { getAllWithCpf }
}
