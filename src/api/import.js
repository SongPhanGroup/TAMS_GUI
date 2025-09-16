import { REACT_APP_IMPORT } from './API_import'

export const importNotImported = async (data) => {
    const uri = `/document/import-not-imported`
    const res = await REACT_APP_IMPORT.post(uri, data)
    return res
}

export const getNotImportedCount = async (data) => {
    const uri = `/document/not-imported-count`
    const res = await REACT_APP_IMPORT.get(uri, data)
    return res
}
