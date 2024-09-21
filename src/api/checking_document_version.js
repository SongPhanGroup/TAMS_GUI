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

export const downloadFileCheckingDocumentVersion = async (id) => {
  const uri = `/checking-document-version/${id}/download`
  const res = await API_TAMS.get(uri, { responseType: 'blob' })
  return res
}

export const getSimilarityReport = async (query) => {
  const uri = `/getSimilarityReport`
  const res = await API_TAMS.get(uri, query, { responseType: 'blob' })
  return res
}

export const getDuplicateDocumentVersion = async (id) => {
  const uri = `/checking-document-version/${id}/duplicate-document`
  const res = await API_TAMS.get(uri)
  return res
}

export const getDuplicateCheckingDocumentVersion = async (id) => {
  const uri = `/checking-document-version/${id}/duplicate-checking-document`
  const res = await API_TAMS.get(uri)
  return res
}

export const getDuplicateSentenceDocument = async (query, id) => {
  const uri = `/checking-document-version/${id}/duplicate-sentence-document`
  const res = await API_TAMS.get(uri, query)
  return res
}

export const downloadTemplateBaoCao = async (id, body_) => {
  const uri = `http://api.khoanhkhac.vn:3003/templater/xlsx/${id}/file`

  try {
    // Gửi yêu cầu POST với body và nhận phản hồi dưới dạng blob
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Thêm các header khác nếu cần thiết
      },
      body: body_ // Chuyển đổi body thành JSON nếu cần
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const blob = await response.blob() // Nhận dữ liệu dưới dạng blob

    // Tạo URL từ blob và tải file
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'bao_cao_ds_trung_lap_cao.xlsx')// Đặt tên file cho việc tải xuống
    document.body.appendChild(link)
    link.click()
    link.remove()

    // Giải phóng URL blob
    window.URL.revokeObjectURL(url)

  } catch (error) {
    console.error('Error downloading file:', error)
    // Xử lý lỗi nếu cần
  }
}
