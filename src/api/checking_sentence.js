import { API_TAMS } from "./API_TAMS"
import { API_FormData } from "./API_FormData"

export const extractingFromDoc = async (docId) => {
  const uri = `/checking-sentence/${docId}`
  const res = await API_TAMS.get(uri)
  return res
}

export const extractingFromFileUpload = async (body) => {
  const uri = `/checking-sentence/upload`
  const res = await API_FormData.post(uri, body)
  return res
}