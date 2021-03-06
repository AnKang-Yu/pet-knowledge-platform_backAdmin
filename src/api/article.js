import http from '@/utils/http'
// 获取图片
export async function findImageApi(params) {
  return await http.img('/showImage', params)
}
// 获取文章列表
export async function findArticleListApi(params) {
  return await http.get('/article/findArticleList', params)
}
// 根据文章Id查询文章
export async function findArticleByIdApi(params) {
  return await http.getRestApi('/article/findArticleById', params)
}

// 获取文章所有分类列表
export async function findAllArticleCategoryListApi(params) {
  return await http.get('/article/findAllArticleCategoryList', params)
}
// 获取文章所有标签列表
export async function findAllTagsListApi(params) {
  return await http.get('/article/findAllTagsList', params)
}
// 存草稿文章
export async function saveDraftApi(params) {
  return await http.post('/article/saveDraft', params)
}

// 编辑文章评论
export async function changeArticleAllowCommentStatusApi(params) {
  return await http.post('/article/changeArticleAllowCommentStatus', params)
}

// 新增文章
export async function addArticleApi(params) {
  return await http.upload('/article/addArticle', params)
}
// 编辑文章
export async function editArticleApi(params) {
  return await http.upload('/article/editArticle', params)
}
// 删除文章
export async function deleteArticleApi(params) {
  // return await http.deleteByObject('/article/deleteArticle', params)
  return await http.delete('/article/deleteArticle', params)
}
