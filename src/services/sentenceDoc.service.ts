import alovaInstance from "@/utils/httpRequest";

export const extractDocument = (docId: number) => {
  return alovaInstance
    .Get(`/sentence-doc/${docId}`)
};

export const extractFromFileUpload = (body: any) => {
  return alovaInstance
    .Post(`/sentence-doc`, body)
};
