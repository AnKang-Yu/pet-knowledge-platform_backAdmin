import http from '@/utils/http'

// 获取文章申请单列表
export async function findArticleApplicationFormApi(params) {
  return await http.get('/aduit/findArticleApplicationForm', params)
}

// 更新文章申请单(成功)
export async function editArticleApplicationFormSuccessApi(params) {
  return await http.put('/aduit/editArticleApplicationFormSuccess', params)
}
// 更新文章申请单(失败)
export async function editArticleApplicationFormFailureApi(params) {
  return await http.put('/aduit/editArticleApplicationFormFailure', params)
}

// 获取救助申请单列表
export async function findRescueApplicationFormListApi(params) {
  return await http.get('/aduit/findRescueApplicationFormList', params)
}

// 更新救助申请单(成功)
export async function editSuccourApplicationFormSuccessApi(params) {
  return await http.put('/aduit/editSuccourApplicationFormSuccess', params)
}
// 更新救助申请单(失败)
export async function editSuccourApplicationFormFailureApi(params) {
  return await http.put('/aduit/editSuccourApplicationFormFailure', params)
}
