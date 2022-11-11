import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

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
    return result
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户信息
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
