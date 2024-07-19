import { API } from "./API"

export const getOrganization = async (query) => {
  const uri = `/organization`
  const res = await API.get(uri, query)
  return res
}

export const postOrganization = async (body) => {
  const uri = `/organization`
  const res = await API.post(uri, body)
  return res
}

export const editOrganization = async (id, body) => {
  const uri = `/organization/${id}`
  const res = await API.put(uri, body)
  return res
}

export const detailOrganization = async (id) => {
  const uri = `/organization/${id}`
  const res = await API.get(uri)
  return res
}

export const deleteOrganization = async (id) => {
  const uri = `/organization/${id}`
  const res = await API.delete(uri)
  return res
}