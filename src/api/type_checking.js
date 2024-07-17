import { API } from "./API"

export const getTypeChecking = async (query) => {
  const uri = `/type-checking`
  const res = await API.get(uri, query)
  return res
}

export const postTypeChecking = async (body) => {
  const uri = `/type-checking`
  const res = await API.post(uri, body)
  return res
}

export const editTypeChecking = async (id, body) => {
  const uri = `/type-checking/${id}`
  const res = await API.put(uri, body)
  return res
}

export const detailTypeChecking = async (id) => {
  const uri = `/type-checking/${id}`
  const res = await API.get(uri)
  return res
}

export const deleteTypeChecking = async (id) => {
  const uri = `/type-checking/${id}`
  const res = await API.delete(uri)
  return res
}