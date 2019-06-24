import axios from "axios";
import { message } from "antd";

export default function ajax(url, data, method) {
  let reqPs = data;
  method = method.toLowerCase();
  if (method === "get") {
    reqPs={
      params:data
    }
  }
  return axios[method](url, reqPs)
    .then(res => {
      const { data } = res;
      if (data.status === 0) {
        return data.data;
      } else {
        message.error(data.msg, 1);
      }
    })
    .catch(err => {
      message.error("网络异常", 1);
    });
}
