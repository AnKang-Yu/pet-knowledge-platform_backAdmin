import http from '@/utils/http'

// 获取宠物列表
export async function findPetListApi(params) {
  return await http.get('/pet/findPetList', params)
}
// 查询宠物分类列表
export async function findAllVarietyListApi(params) {
  return await http.get('/pet/findAllVarietyList', params)
}
// 查询宠物状态列表
export async function findAllStatusListApi(params) {
  return await http.get('/pet/findAllStatusList', params)
}
// 添加宠物
export async function addPetApi(params) {
  return await http.post('/pet/addPet', params)
}
// 编辑宠物
export async function editPetApi(params) {
  return await http.put('/pet/editPet', params)
}
// 删除宠物
export async function deletePetApi(params) {
  return await http.delete('/pet/deletePetById', params)
}
