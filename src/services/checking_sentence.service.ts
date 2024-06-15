import alovaInstance from "@/utils/httpRequest";

export const uploadCheckingSentence = (body: any) => {
  return alovaInstance
    .Post("/checking-sentence/upload", body)
};
