// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 默认所有角色都能访问静态路由
  routes: constantRoutes
}
const mutations = {
  // 定义修改routes的mutations
  // payload是登录成功后需要添加的新路由
  setRoutes(state, newRoutes) {
    // state.routes = [...state.routes, ...newRoutes] 业务不正确
    // 直接在静态路由的基础上加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选路由
  // 第二个参数menus为得到的用户基本信息userInfo中roles里面的menus:[] 是用户所有的菜单权限
  // asyncRoutes:[{path:'xxx',name:'xxx'}]是所有的动态路由
  filterRoutes(context, menus) {
    // 筛选出动态路由中与menus中相匹配的路由
    const routes = []
    menus.forEach(key => {
      // key是用户拥有的一个个权限标识
      // 找到动态路由中name和key相同的路由 如果找不到就没有权限 找到了就要加入
      // item => {path:'xxx',name:'xxx'...}
      // asyncRoutes.filter(item => item.name === key) 返回的是数组
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 得到routes是所有用户拥有权限访问的动态路由
    context.commit('setRoutes', routes)
    // state数据是用来显示左侧菜单的 return routes是路由用来addRoutes
    return routes // 此处返回routes为后面做权限接口提供用户拥有权限访问的动态路由
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
