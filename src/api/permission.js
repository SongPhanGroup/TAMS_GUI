import { API } from "./API"

export const getPermission = async (query) => {
  const uri = `/permission`
  const res = await API.get(uri, query)
  return res
}

export const postPermission = async (body) => {
  const uri = `/permission`
  const res = await API.post(uri, body)
  return res
}

export const editPermission = async (id, body) => {
  const uri = `/permission/${id}`
  const res = await API.put(uri, body)
  return res
}

export const detailPermission = async (id) => {
  const uri = `/permission/${id}`
  const res = await API.get(uri)
  return res
}

export const deletePermission = async (id) => {
  const uri = `/permission/${id}`
  const res = await API.delete(uri)
  return res
}

export const getPermissionByRole = async (id) => {
  const uri = `/permission/${id}`
  const res = await API.get(uri)
  return res
}

export const listPerNotInRole = async (id) => {
  const uri = `/permission/${id}`
  const res = await API.get(uri)
  return res
}