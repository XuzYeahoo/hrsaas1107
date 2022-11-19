import store from '@/store'
// 做一个混入对象
export default {
  methods: {
    // 检查权限点
    // 哪个按钮有规定权限 就给哪个按钮加入此方法
    checkPermission(key) {
      // key就是权限点的权限标识
      // 在用户信息中查找points中是否有key 如果有，就是有该权限
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
