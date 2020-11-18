// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import "@/assets/vue/vue-mixins";
import store from './store'
import { hasPermission } from './utils/permissionDirect'
//import 'element-ui/lib/theme-chalk/index.css'
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
