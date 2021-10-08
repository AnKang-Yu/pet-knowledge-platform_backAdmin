import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  // 自定义 baseURL = ''
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
// 请求前
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 如果token存在 添加到请求头
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 请求返回后
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    //自定义默认成功是200
    if (res.code !== 200) {
      Message({
        message: res.msg || '服务器出错！',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // 自定义NO_LOGIN_CODE 状态码为600  一般是token过期或token验证失败
      if (res.code === 600) {
        // to re-login
        MessageBox.confirm('登录信息过期,请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      if (res.code === 700) {
        // 无权限
        MessageBox.confirm('该账户没有权限操作', '系统提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || '服务器出错！'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg || '服务器出错！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

 //请求方法
const http = {
//   getWithObject(url,object,params) {
//     //console.log(encodeURIComponent(JSON.stringify(params))) 
//     //url =  encodeURIComponent(JSON.stringify(params))
//     console.log(JSON.stringify(object))
//     url = url +  encodeURI(JSON.stringify(object)) 
//     console.log(url)
//     return service.get(url, {
//         params: params,
//         paramsSerializer: (params) => {
//           return qs.stringify(params)
//         }
//     })
     
   
//         // return service.get(url, {
//         //     params: params,
//         //     paramsSerializer: (params) => {
//         //     return encodeURIComponent(JSON.stringify(params))
//         //     }
//         // })
//     },
  post(url,params) {
    return service.post(url, params,{
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
      'Content-Type': 'application/json'
      }
    })
  },
  put(url,params) {
    return service.put(url, params,{
      transformRequest: [(params) => {
        return JSON.stringify(params)
      }],
      headers: {
      'Content-Type': 'application/json'
      }
    })
  },
  //parm => {id:10}
  // http://localhost:9876/user?id=10
  get(url,params) {
    return service.get(url, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      }
    })
  },
  //parm => {id:10}
  // http://localhost:9876/api/user/10
  getRestApi(url, params) {
    let _params
    if (Object.is(params, undefined || null)) {
          _params =''
    } else {
          _params ='/'
          for (const key in params) {
              console.log(key)
              console.log(params[key])
              // eslint-disable-next -1ine no-prototype-builtins
              if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
                  _params += `${params[key]}/`
              }
            }
        //去掉参数最后一位?
        _params = _params.substr(0, _params.length-1)
    }
    console.log(_params)
    if (_params) {
      return service.get(`${url}${_params}`)
    } else {
      return service.get(url)
    }
  },
  //parm => {id:10}
  // http://localhost:9876/api/user/10
  delete(url, params) {
    let _params
    if (Object.is(params, undefined || null)) {
          _params =''
    } else {
          _params ='/'
          for (const key in params) {
              // console.log(key)
              // console.log(params[key])
              // eslint-disable-next -1ine no-prototype-builtins
              if (params.hasOwnProperty(key) && params[key] !== null && params[key] !== '') {
                  _params += `${params[key]}/`
              }
            }
        //去掉参数最后一位?
        _params = _params.substr(0, _params.length-1)
    }
    if (_params) {
        return service.delete(`${url}${_params}`).catch(err => {
          //message.error(err.msg)
          return Promise.reject(err)
        })
    } else {
        return service.delete(url).catch(err => {
          //message.error(err.msg)
          return Promise.reject(err)
      })
    }
  },
  upload(url,params) {
    return service.post(url, params,{
      headers: {
      'Content-Type': 'multipart/form-data'
      }
    })
  }    
}
export default http
