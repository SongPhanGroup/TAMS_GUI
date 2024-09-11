import { API_TAMS } from "./API_TAMS"
import { API_FormData } from "./API_FormData"

export const getCheckingDocumentVersion = async (query) => {
  const uri = `/checking-document-version`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postCheckingDocumentVersion = async (body) => {
  const uri = `/checking-document-version`
  const res = await API_FormData.post(uri, body)
  return res
}

export const editCheckingDocumentVersion = async (id, body) => {
  const uri = `/checking-document-version/${id}`
  const res = await API_FormData.put(uri, body)
  return res
}

export const detailCheckingDocumentVersion = async (id) => {
  const uri = `/checking-document-version/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const deleteCheckingDocumentVersion = async (id) => {
  const uri = `/checking-document-version/${id}`
  const res = await API_TAMS.delete(uri)
  return res
}