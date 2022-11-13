import request from '@/utils/request'

// 获取角色列表
export const getRoleList = (params) => {
  return request.get('/sys/role', {
    params
  })
}

// 获取公司信息
export const getCompanyInfo = (companyId) => {
  return request.get(`/company/${companyId}`)
}

// 删除角色
export const deleteRole = (id) => {
  return request.delete(`/sys/role/${id}`)
}

// 根据ID获取角色详情
export const getRoleDetail = (id) => {
  return request.get(`/sys/role/${id}`)
}

// 根据ID更新角色
export const updateRole = (data) => {
  return request.put(`/sys/role/${data.id}`, data)
}
