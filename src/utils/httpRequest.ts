import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { axiosRequestAdapter } from '@alova/adapter-axios';

const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter(),
  responded: {
    onSuccess(response) {
      // response is automatically inferred as AxiosResponse type
      return response.data;
    },
    onError(err) {
      // err type is any by default, you can cast it to AxiosError
      //...
      console.log(err);
      showMessage(err?.response?.data?.message, 'error')
      return err.response.data;
    }
  }
});

export default alovaInstance;

