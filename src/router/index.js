import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Test from '@/components/Test'
import Department from '@/components/page/sys/Department'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/test'
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
          path: '/test',
          name: 'Test',
          meta: { title: '欢迎页' },
          component: Test
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
