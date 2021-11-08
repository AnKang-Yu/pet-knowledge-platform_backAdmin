import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      // 路由懒加载
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/article',
    component: Layout,
    // 总是显示可以下拉，防单个子列表他不显示
    alwaysShow: true,
    name: 'article',
    meta: { title: '文章管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/createArticle',
        name: 'ArticleModel',
        component: () => import('@/views/article/createArticle'),
        meta: { title: '文章创建', icon: 'table' }
      },
      {
        path: '/articleList',
        name: 'articleList',
        component: () => import('@/views/article/articleList'),
        meta: { title: '文章列表', icon: 'table' }
      }
      // {
      //   path: '/offLineActicleList',
      //   name: 'offLineActicleList',
      //   component: () => import('@/views/acticle/offlineActicleList'),
      //   meta: { title: '下架文章', icon: 'table' }
      // }
    ]
  },
  {
    path: '/audit',
    component: Layout,
    // 总是显示可以下拉，防单个子列表他不显示
    alwaysShow: true,
    name: 'audit',
    meta: { title: '审核管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/auditArticle',
        name: 'auditArticle',
        component: () => import('@/views/audit/auditArticle'),
        meta: { title: '审核文章', icon: 'table' }
      },
      {
        path: '/auditSuccour',
        name: 'auditSuccour',
        component: () => import('@/views/audit/auditSuccour'),
        meta: { title: '审核救助', icon: 'table' }
      }
    ]
  },
  {
    path: '/pet',
    component: Layout,
    // 总是显示可以下拉，防单个子列表他不显示
    alwaysShow: true,
    name: 'pet',
    meta: { title: '宠物管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/petList',
        name: 'petList',
        component: () => import('@/views/pet/petList'),
        meta: { title: '宠物列表', icon: 'table' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/dictionaries',
    component: Layout,
    // 总是显示可以下拉，防单个子列表他不显示
    alwaysShow: true,
    name: 'dictionaries',
    meta: {
      title: '字典管理',
      icon: 'el-icon-s-help',
      roles: [20]
    },
    children: [
      {
        path: '/sysDictList',
        name: 'sysDictList',
        component: () => import('@/views/dictionaries/sysDictList'),
        meta: { title: '字典', icon: 'table' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    // 总是显示可以下拉，防单个子列表他不显示
    alwaysShow: true,
    name: 'system',
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-help',
      // you can set roles in root nav
      roles: [20, 21]
    },
    children: [
      {
        path: '/sysUserList',
        name: 'sysUserList',
        component: () => import('@/views/system/sysUserList'),
        meta: { title: '用户', icon: 'table' }
      },
      {
        path: '/adminList',
        name: 'adminList',
        component: () => import('@/views/system/adminList'),
        meta: { title: '管理员', icon: 'tree', roles: [20] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
