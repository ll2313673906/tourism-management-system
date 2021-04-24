import axios from "axios";
import { Message } from "element-ui";
const httpService = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

const errorHandle = (status, message) => {
  switch (status) {
    case 404:
      this.$message.error("网络请求不存在");
      break;
    // 其他错误，直接抛出错误提示
    default:
    // Message({
    //   type: "error",
    //   message
    // });
  }
};
// // 请求拦截器
// httpService.interceptors.request.use(
//   config => {
//     const token = sessionStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = "Bearer" + token;
//     }
//     return config;
//   },
//   error => {
//     return Promise.error(error);
//   }
// );
// // 响应拦截器
// httpService.interceptors.response.use(
//   response => {
//     const data = response.data;
//     if (response.status === 200) {
//       if (data.code !== 0) {
//         errorHandle(data.code, data.msg);
//       }
//       return Promise.resolve(data.data);
//     } else {
//       errorHandle(response.status, data.msg);
//       return Promise.resolve(data);
//     }
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

export default httpService;
