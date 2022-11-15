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

// 删除员工
export const delEmployee = (id) => {
  return request.delete(`/sys/user/${id}`)
}

// 新增员工
export const addEmployee = (data) => {
  return request.post('/sys/user', data)
}

// 批量导入员工接口
export const importEmployee = (data) => {
  return request.post('/sys/user/batch', data)
}
