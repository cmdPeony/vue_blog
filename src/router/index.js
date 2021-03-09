import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/Home.vue'
import login from '../views/Login.vue'
import admin from '../views/Admin.vue'
import NotFoundPage from '../views/404Page.vue'
Vue.use(VueRouter)

const routes = [
  // 默认访问博客首页
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: home,
    children: [
      {
        path: '',
        name: 'blog-list',
        component: resolve => require(['@/components/home/component/blog-list.vue'], resolve)
      },
      {
        path: 'detail/:id',
        name: 'detail',
        component: resolve => require(['@/components/home/component/blog-detail.vue'], resolve),
        beforeEnter: (to, from, next) => {
          if (to.params.id) {
            next()
          } else {
            console.log('非法访问')
            next('/home')
          }
        }
      },
      {
        path: ':type/:id',
        name: 'id',
        component: resolve => require(['@/components/home/component/blog-list.vue'], resolve),
        beforeEnter: (to, from, next) => {
          if (to.params.id) {
            next()
          } else {
            console.log('非法访问')
            next('/home')
          }
        }
      },
      { path: '*', component: NotFoundPage }
    ]
  },
  {
    path: '/admin',
    component: admin,
    children: [
      {
        path: '/',
        name: 'admin-home',
        component: resolve => require(['@/components/admin/admin-home.vue'], resolve)
      },
      {
        path: 'user-list',
        name: 'user-list',
        component: resolve => require(['@/components/admin/user-admin/user-list.vue'], resolve)
      },
      {
        path: 'add-user',
        name: 'add-user',
        component: resolve => require(['@/components/admin/user-admin/user-add.vue'], resolve)
      },
      {
        path: 'article-admin', // 文章管理
        name: 'article-admin',
        component: resolve => require(['@/components/admin/blog-admin/article-admin.vue'], resolve)
      },
      {
        path: 'article-sort', // 文章类别
        name: 'article-sort',
        component: resolve => require(['@/components/admin/blog-admin/article-sort.vue'], resolve)
      },
      {
        path: 'background-menu', // 文章类别
        name: 'background-menu',
        component: resolve => require(['@/components/admin/menu-admin/background-menu.vue'], resolve)
      },
      {
        path: 'friend-link', // 友情链接
        name: 'friend-link',
        component: resolve => require(['@/components/admin/system-admin/friend-link.vue'], resolve)
      },
      {
        path: 'login-log', // 登录日志
        name: 'login-log',
        component: resolve => require(['@/components/admin/system-admin/login-log.vue'], resolve)
      },
      {
        path: 'system-notice', // 系统公告
        name: 'system-notice',
        component: resolve => require(['@/components/admin/system-admin/system-notice.vue'], resolve)
      },
      { path: '*', component: NotFoundPage }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  { path: '*', component: NotFoundPage } // 404界面
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.path.startsWith('/admin')) {
    next()
  } else {
    if (localStorage.getItem('token')) {
      next()
    } else {
      console.log('路由拦截')
      next('/login')
    }
  }
})

// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

export default router
