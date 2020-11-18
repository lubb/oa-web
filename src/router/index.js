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
