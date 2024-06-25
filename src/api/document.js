import { API } from "./API"
import { API_FormData } from "./API_FormData"

export const getDocument = async (query) => {
  const uri = `/document`
  const res = await API.get(uri, query)
  return res
}

export const postDocument = async (body) => {
  const uri = `/document`
  const res = await API_FormData.post(uri, body)
  return res
}

export const editDocument = async (id, body) => {
  const uri = `/document/${id}`
  const res = await API_FormData.put(uri, body)
  return res
}

export const detailDocument = async (id) => {
  const uri = `/document/${id}`
  const res = await API.get(uri)
  return res
}


export const deleteDocument = async (id) => {
  const uri = `/document/${id}`
  const res = await API.delete(uri)
  return res
}