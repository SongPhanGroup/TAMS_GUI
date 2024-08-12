import { API_TAMS } from "./API_TAMS"

export const getSimilarDocument = async (id, query) => {
  const uri = `/getResult/${id}`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const getTop3SimilarDocument = async (id) => {
  const uri = `/getTop3Result/${id}`
  const res = await API_TAMS.get(uri)
  return res
}

export const getListSentenceByCheckingResult = async (id, type) => {
  const uri = `/getListSentenceByCheckingResult?id=${id}&type=${type}`
  const res = await API_TAMS.get(uri)
  return res
}

export const getCheckingResult = async (query) => {
  const uri = `/checking-result`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const getCheckingResultHTML = async (query) => {
  const uri = `/getHtmlResult`
  const res = await API_TAMS.get(uri, query)
  return res
}