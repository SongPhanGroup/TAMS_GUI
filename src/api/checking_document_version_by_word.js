import { API_TAMS } from "./API_TAMS"
import { API_FormData } from "./API_FormData"
import { API_FormData_CheckingUpload } from "./API_FormData_CheckingUpload"

export const getCheckingDocumentVersion = async (query) => {
    const uri = `/checking-document-version-by-word`
    const res = await API_TAMS.get(uri, query)
    return res
}

export const postCheckingDocumentVersion = async (body) => {
    const uri = `/checking-document-version-by-word`
    const res = await API_FormData_CheckingUpload.post(uri, body)
    return res
}