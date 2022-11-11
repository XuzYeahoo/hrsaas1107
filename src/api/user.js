import request from '@/utils/request'

// 登录接口
export const login = (data) => {
  return request.post('/sys/login', data)
}

// 获取用户资料
export const getUserInfo = () => {
  return request.post('/sys/profile')
}

// 根据Id获取用户的基本信息
export const getUserDetailById = (id) => {
  return request.get(`/sys/user/${id}`)
}
export function logout() {

}
