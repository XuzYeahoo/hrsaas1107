const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立token的快捷访问
  name: state => state.user.userInfo.username, // 建立用户名称的映射
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立头像的快捷访问
  companyId: state => state.user.userInfo.companyId, // 建立公司ID的快捷访问
  routes: state => state.permission.routes // 建立权限模块下的快捷访问
}
export default getters
