import request from '@/utils/request'
import http from '@/utils/http'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

// 获取用户列表
export async function findUserListApi(params) {
  return await http.get('/admin/findUserList', params)
}

// 新增用户
export async function addUserApi(params) {
  return await http.post('/admin/addUser', params)
}
// 编辑用户
export async function editUserApi(params) {
  return await http.put('/admin/editUser', params)
}
// 删除用户
export async function deleteUserApi(params) {
  return await http.delete('/admin/deleteUser', params)
}
