import { API } from "./API"

export const getCourse = async (query) => {
  const uri = `/course`
  const res = await API.get(uri, query)
  return res
}

export const postCourse = async (body) => {
  const uri = `/course`
  const res = await API.post(uri, body)
  return res
}

export const editCourse = async (id, body) => {
  const uri = `/course/${id}`
  const res = await API.put(uri, body)
  return res
}

export const detailCourse = async (id) => {
  const uri = `/course/${id}`
  const res = await API.get(uri)
  return res
}

export const deleteCourse = async (id) => {
  const uri = `/course/${id}`
  const res = await API.delete(uri)
  return res
}