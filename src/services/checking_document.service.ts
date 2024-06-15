import alovaInstance from "@/utils/httpRequest";

export const getCheckingDocument = (query: any) => {
  return alovaInstance
    .Get("/checking-document", {params: query})
};

export const postCheckingDocument = (body: any) => {
  return alovaInstance
    .Post("/checking-document", body)
};

export const editCheckingDocument = (id: number, body: any) => {
  return alovaInstance
    .Put(`/checking-document/${id}`, body)
};

export const detailCheckingDocument = (id: any) => {
  return alovaInstance
    .Get(`/checking-document/${id}`)
};

export const deleteCheckingDocument = (id: any) => {
  return alovaInstance
    .Delete(`/checking-document/${id}`)
};

