import { API } from "./API"

export const getRole = async (query) => {
  const uri = `/role`
  const res = await API.get(uri, query)
  return res
}

export const postRole = async (body) => {
  const uri = `/role`
  const res = await API.post(uri, body)
  return res
}

export const editRole = async (id, body) => {
  const uri = `/role/${id}`
  const res = await API.put(uri, body)
  return res
}

export const detailRole = async (id) => {
  const uri = `/role/${id}`
  const res = await API.get(uri)
  return res
}

export const deleteRole = async (id) => {
  const uri = `/role/${id}`
  const res = await API.delete(uri)
  return res
}