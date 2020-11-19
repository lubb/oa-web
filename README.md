OA办公系统前端页面搭建步骤

1、安装vue-cli
2、新建项目oa-web，进入到文件路径下 运行vue init webpack
3、初始化项目的时候需要确认创建项目后，后续还需输入一下项目名称、项目描述、作者、打包方式、是否使用ESLint规范代码等等，详见上图。安装顺利执行后会，生成如下文件目录
4、生成好项目目录后，使用cnpm install安装插件
5、安装必要的plugins，使用命令 npm install --save XXX
      "axios": "^0.19.2",
      "element-ui": "^2.13.0",
      "node-sass": "^4.14.1",
      "sass-loader": "^4.1.0",
      "style-loader": "^1.2.1",
      "vue": "^2.6.11",
      "vue-axios": "^3.2.0",
      "vue-puzzle-vcode": "^1.1.4",
      "vue-router": "^3.1.5",
      "vuex": "^3.1.2"
6、npm run dev运行项目
6、main.js修改
  import Vue from 'vue'
  import axios from 'axios'
  import VueAxios from 'vue-axios'
  import ElementUI from 'element-ui'
  import App from './App'
  import router from './router'
  import "@/assets/vue/vue-mixins";
  import store from './store'
  import { hasPermission } from './utils/permissionDirect'
  import './assets/style/theme-green/index.css'; // 浅绿色主题
  Vue.config.productionTip = false;
  const Plugins = [ hasPermission ]
  Plugins.map((plugin) => {
    Vue.use(plugin)
  })
  
  Vue.use(VueAxios, axios);
  axios.defaults.withCredentials = true;
  
  Vue.use(ElementUI, {
    size: 'small',
  });
  
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })
7、配置router
  import Vue from 'vue'
  import Router from 'vue-router'
  import Login from '@/components/common/Login'
  import Home from '@/components/common/Home'
  import Dashboard from '@/components/common/Dashboard'
  import Department from '@/components/page/sys/Department'
  
  Vue.use(Router)
  
  export default new Router({
    routes: [
      {
        path: '/',
        redirect: '/dashboard'
      },
      {
        path: '/login',
        name: 'Login',
        meta: { title: '登录页面' },
        component: Login
      },
      {
        path: '/',
        name: 'Home',
        meta: { title: '首页' },
        component: Home,
        children:[
          {
            path: '/dashboard',
            name: 'Dashboard',
            meta: { title: '欢迎页' },
            component: Dashboard
          },
          {
            path: '/department',
            name: 'Department',
            meta: { title: '部门管理' },
            component: Department
          },
        ]
      }
    ]
  })
8、可拷贝tags页面、头部页面、侧边栏页面Sidebar.vue、home页面
9、配置代理
  proxyTable: {
        '/api/**': {  //使用"/api"来代替"
          target: 'http://localhost:8080', //源地址
          changeOrigin: true, //改变源
          pathRewrite: {
            '^/api':'/oa' //路径重写
          }
        },
      }
  
10、新增request axiox的请求
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
11、npm run dev运行项目
