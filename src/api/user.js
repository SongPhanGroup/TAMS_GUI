import { API } from "./API"

export const getUser = async (query) => {
  const uri = `/user`
  const res = await API.get(uri, query)
  return res
}

export const postUser = async (body) => {
  const uri = `/user`
  const res = await API.post(uri, body)
  return res
}

export const editUser = async (id, body) => {
  const uri = `/user/${id}`
  const res = await API.put(uri, body)
  return res
}

export const detailUser = async (id) => {
  const uri = `/user/${id}`
  const res = await API.get(uri)
  return res
}

export const deleteUser = async (id) => {
  const uri = `/user/${id}`
  const res = await API.delete(uri)
  return res
}

export const getListUserByRole = async (id) => {
  const uri = `/user/${id}`
  const res = await API.get(uri)
  return res
}