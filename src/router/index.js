import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/common/Login'
import Home from '@/components/common/Home'
import Dashboard from '@/components/common/Dashboard'
import Department from '@/components/page/sys/Department'
import Menu from '@/components/page/sys/Menu'
import Role from '@/components/page/sys/Role'
import User from '@/components/page/sys/User'

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
        {
          path: '/menu',
          name: 'Menu',
          meta: { title: '菜单管理' },
          component: Menu
        },
        {
          path: '/role',
          name: 'Role',
          meta: { title: '角色管理' },
          component: Role
        },
        {
          path: '/user',
          name: 'User',
          meta: { title: '用户管理' },
          component: User
        },
      ]
    }
  ]
})
