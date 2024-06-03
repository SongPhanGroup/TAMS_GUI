import alovaInstance from "@/utils/httpRequest";

export const extractDocument = (docId: number) => {
  return alovaInstance
    .Get(`/sentence-doc/${docId}`)
};
