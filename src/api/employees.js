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

// 保存员工基本信息
export const saveUserDetailById = (data) => {
  return request.put(`/sys/user/${data.id}`, data)
}

// 读取用户详情的基础信息
export const getPersonalDetail = (id) => {
  return request.get(`/employees/${id}/personalInfo`)
}

// 更新用户详情的基础信息
export const updatePersonal = (data) => {
  return request.put(`/employees/${data.userId}/personalInfo`, data)
}

// 获取用户的岗位信息
export const getJobDetail = (id) => {
  return request.get(`/employees/${id}/jobs`)
}

// 保存岗位信息
export const updateJob = (data) => {
  return request.put(`/employees/${data.userId}/jobs`, data)
}

// 给员工分配角色
export const assignRoles = (data) => {
  return request.put('/sys/user/assignRoles', data)
}
