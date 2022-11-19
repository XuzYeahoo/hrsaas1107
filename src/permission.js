// 权限拦截在路由 导航守卫
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 不需要导出 只需要让代码执行即可
// 前置守卫
// next 是前置守卫必须要执行的钩子 next 必须执行 如果不执行页面就死了
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) {
    // 1.如果有token
    // 只有有token的情况下才能获取资料
    if (to.path === '/login') {
      // 1.1 如果去的是登录页，跳转到主页
      // 但是如果去的是登录页，不需要获取资料
      next('/')
    } else {
      // 1.2 如果去的不是登录页，放行
      // 只有放过的时候才需要获取资料
      // 如果当前vuex中有用户资料的id，说明已经有资料，不用再去获取；如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id，获取用户信息
        const { roles } = await store.dispatch('user/getUserInfo')
        // 后续需要放行 获取用户信息为异步 必须强制等待获取用户信息的代码执行完毕才能放行 所以必须改成同步的
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 筛选得到当前用户拥有权限访问的动态路由
        // 将动态路由添加到路由表中 默认路由表中只有静态路由
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // 添加完动态路由之后 跳转到对应页面
        // 执行完addRoutes必须用next(to.path) 这是一个已知的缺陷
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 2.如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 2.1在白名单
      next()
    } else {
      // 2.2 不在白名单
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})
