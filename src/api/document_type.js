import { API } from "./API"

export const getDocumentType = async (query) => {
  const uri = `/document-type`
  const res = await API.get(uri, query)
  return res
}

export const postDocumentType = async (body) => {
  const uri = `/document-type`
  const res = await API.post(uri, body)
  return res
}

export const editDocumentType = async (id, body) => {
  const uri = `/document-type/${id}`
  const res = await API.put(uri, body)
  return res
}

export const detailDocumentType = async (id) => {
  const uri = `/document-type/${id}`
  const res = await API.get(uri)
  return res
}

export const deleteDocumentType = async (id) => {
  const uri = `/document-type/${id}`
  const res = await API.delete(uri)
  return res
}