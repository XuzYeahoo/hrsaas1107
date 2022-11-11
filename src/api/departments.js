import requset from '@/utils/request'

// 获取组织架构的数据
export const getDepartments = () => {
  return requset.get('/company/department')
}

// 删除组织架构的部门
export const delDepartments = (id) => {
  return requset.delete(`/company/department/${id}`)
}

// 新增部门
export const addDepartments = (data) => {
  return requset.post('/company/department', data)
}
