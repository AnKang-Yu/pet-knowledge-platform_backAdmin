import http from '@/utils/http'

  //获取字典列表
  export async function findDictListApi(params){
    return await http.get("/dict/findDictList",params)
  }
  
  //新增字典
  export async function addDictApi(params){
    return await http.post("/dict/addDict",params)
  }
  //编辑字典
  export async function editDictApi(params){
    return await http.put("/dict/editDict",params)
  }
  //删除字典
  export async function deleteDictApi(params){
    return await http.delete("/dict/deleteDict",params)
  }

  //根据父字典查字典
  export async function findAllDictByParentIdApi(){
      return await http.get("/dict/findAllDictByParentId")
  }