import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex的时候 就先从缓存中读取
  userInfo: {} // 因为我们会在**`getters`**中引用userinfo的变量，如果设置为null，则会引起异常和报错
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将获取的token存入vuex
    setToken(token) // 更新本地存储的token 同步到缓存
  },
  removeToken() {
    state.token = null // 清除vuex的token
    removeToken() // 删除本地存储的token 同步到缓存
  },
  getUserInfo(state, result) {
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result)
    // 拿到token说明登录成功 存入时间戳
    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 必须得等getUserInfo执行完毕 获取到id才能执行getUserDetailById
    // 获取员工基本信息
    const baseInfo = await getUserDetailById(result.userId)
    // 将两个接口结果合并
    // const obj = { ...result, ...baseInfo }
    context.commit('getUserInfo', { ...result, ...baseInfo })
    return result // 此处返回result 为后续做权限功能提供用户拥有的权限标识
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 将vuex中的路由清空为只剩默认静态路由
    // 问题：vuex如何在子模块调用另一个子模块中的action？
    // 情况1：不加命名空间的情况下，所有的mutation和action都挂载在全局上 可以直接调用
    // 情况2：加了命名空间的context指的不是全局的context
    //       加了{root:true}表示调用根级的mutation和action
    //       context.commit(另一个子模块/mutation名称,payload,{root:true})
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
