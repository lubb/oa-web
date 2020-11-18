import axios from 'axios'
import apiConfig from '../../config/api.config';
import router from '../router'
// 使用element-ui Message做消息提醒
import { Message} from 'element-ui';

//1. 创建新的axios实例，
const service = axios.create({
  // 公共接口--这里注意后面会讲
  baseURL: apiConfig.baseUrl,

  withCredentials: true,
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 3 * 1000
})

// 2.请求拦截器
service.interceptors.request.use(config => {
  //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
  config.data = JSON.stringify(config.data); //数据转化,也可以使用qs转换
  config.headers = {
    'Content-Type':'application/json;charset=utf-8' //配置请求头
  }
  config.headers.Authorization = localStorage.getItem('oa_token');
  return config
}, error => {
  Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(response => {
  //接收到响应数据并成功后的一些共有的处理，关闭loading等
  return response
}, error => {
  console.log("error:"+error);
  if (error.response.status == 504 || error.response.status == 404) {
    Message.error({message: '服务器被吃了( ╯□╰ )'})
  } else if (error.response.status == 403) {
    Message.error({message: '权限不足，请联系管理员'})
  } else if (error.response.status == 401) {
    Message.error({message: error.response.data.msg ? error.response.data.msg : '尚未登录，请登录'})
    router.replace('/');
  } else {
    if (error.response.data.msg) {
      Message.error({message: error.response.data.msg})
    } else {
      Message.error({message: '未知错误!'})
    }
  }
  return;
})
//4.导入文件
export default service
