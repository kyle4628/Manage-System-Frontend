import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/members',
    component: Layout,
    redirect: '/members/members',
    children: [
      {
        path: 'members',
        component: () => import('@/views/members/members'),
        name: 'Members',
        meta: { title: 'members', icon: 'people' }
      }
    ]
  },
  {
    path: '/tags',
    component: Layout,
    redirect: '/tags/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/tags/index'),
        name: 'Members_Table',
        meta: { title: 'tags', icon: 'tab' }
      }
    ]
  },
  {
    path: '/places',
    component: Layout,
    redirect: '/places/place',
    alwaysShow: true, // will always show the root menu
    name: 'Places',
    meta: {
      title: 'places',
      icon: 'list',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'places',
        component: () => import('@/views/places/places'),
        name: 'Places_Table',
        meta: {
          title: 'places'
        }
      },
      {
        path: 'place-lists',
        component: () => import('@/views/places/place-lists'),
        name: 'Place-Lists',
        meta: {
          title: 'placelists'
        }
      }
    ]
  },

  chartsRouter,
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-selected-excel-place',
        component: () => import('@/views/excel/select-excel-place'),
        name: 'SelectExcelPlace',
        meta: { title: 'selectExcelPlace' }
      },
      {
        path: 'export-selected-excel-list',
        component: () => import('@/views/excel/select-excel-list'),
        name: 'SelectExcelList',
        meta: { title: 'selectExcelList' }
      },
      {
        path: 'export-selected-excel-tag',
        component: () => import('@/views/excel/select-excel-tag'),
        name: 'SelectExcelTag',
        meta: { title: 'selectExcelTag' }
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

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
