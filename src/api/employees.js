import request from '@/utils/request'

// 获取员工的简单列表
export const getEmployeeSimple = () => {
  return request.get('/sys/user/simple')
}

// 获取员工综合列表
export const getEmployeeList = (params) => {
  return request.get('/sys/user', {
    params
  })
}
