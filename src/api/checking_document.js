import { API_FormData } from "./API_FormData"
import { API_FormData_CheckingUpload_TD } from "./API_FormData_CheckingUpload_TD"
import { API_TAMS } from "./API_TAMS"
import { API_TAMS_CheckingUpload_TD } from "./API_TAMS_CheckingUpload_TD"

export const getCheckingDocument = async (query) => {
  const uri = `/checking-document`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const postCheckingDocument = async (body) => {
  const uri = `/checking-document`
  // const res = await API_TAMS.post(uri, body) 
  const res = await API_TAMS_CheckingUpload_TD.post(uri, body)
  return res
}

export const supervisedCheckingDocument = async (body) => {
  const uri = `/checking-document/result-last-version`
  const res = await API_TAMS.post(uri, body)
  return res
}

export const editCheckingDocument = async (id, body) => {
  const uri = `/checking-document/${id}`
  const res = await API_TAMS.put(uri, body)
  return res
}

export const detailCheckingDocument = async (id) => {
    const uri = `/checking-document/${id}`
    const res = await API_TAMS.get(uri)
    return res
  }

export const deleteCheckingDocument = async (id) => {
    const uri = `/checking-document/${id}`
    const res = await API_TAMS.delete(uri)
    return res
  }