import { API } from "./API"

export const getMajor = async (query) => {
  const uri = `/major`
  const res = await API.get(uri, query)
  return res
}

export const postMajor = async (body) => {
  const uri = `/major`
  const res = await API.post(uri, body)
  return res
}

export const editMajor = async (id, body) => {
  const uri = `/major/${id}`
  const res = await API.put(uri, body)
  return res
}

export const detailMajor = async (id) => {
  const uri = `/major/${id}`
  const res = await API.get(uri)
  return res
}

export const deleteMajor = async (id) => {
  const uri = `/major/${id}`
  const res = await API.delete(uri)
  return res
}