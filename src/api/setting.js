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
