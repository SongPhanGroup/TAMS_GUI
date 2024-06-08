import alovaInstance from "@/utils/httpRequest";

export const getDocument = (query: any) => {
  return alovaInstance
    .Get("/document", {params: query})
};

export const postDocument = (body: any) => {
  return alovaInstance
    .Post("/document", body)
};

export const editDocument = (id: number, body: any) => {
  return alovaInstance
    .Put(`/document/${id}`, body)
};

export const detailDocument = (id: any) => {
  return alovaInstance
    .Get(`/document/${id}`)
};

export const deleteDocument = (docId: any) => {
  return alovaInstance
    .Delete(`/document/${docId}`)
};

