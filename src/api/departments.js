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

// 根据ID查询部门详情
export const getDepartDetail = (id) => {
  return requset.get(`/company/department/${id}`)
}

// 根据ID修改部门详情
export const updateDepartments = (data) => {
  return requset.put(`/company/department/${data.id}`, data) // 因为data中有id，所以直接合并，从data中获取id
}
