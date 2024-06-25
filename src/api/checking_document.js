import { API } from "./API"
import { API_FormData } from "./API_FormData"

export const getCheckingDocument = async (query) => {
  const uri = `/checking-document`
  const res = await API.get(uri, query)
  return res
}

export const postCheckingDocument = async (body) => {
  const uri = `/checking-document`
  const res = await API_FormData.post(uri, body)
  return res
}

export const detailCheckingDocument = async (id) => {
    const uri = `/checking-document/${id}`
    const res = await API.get(uri)
    return res
  }

export const deleteCheckingDocument = async (id) => {
    const uri = `/checking-document/${id}`
    const res = await API.delete(uri)
    return res
  }