const formValidation = {
  // 验证手机号
  validatePhone: (rule, value, callback) => {
    // 可以为空
    if (!value) {
      callback()
    }
    const reg = /^1[3|4|5|7|8][0-9]{9}$/
    if (!reg.test(value)) {
      callback(new Error('手机格式错误'))
    } else {
      callback()
    }
  },
  // 验证邮箱
  validateEmail: (rule, value, callback) => {
    if (!value) {
      callback()
    }
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/
    if (!reg.test(value)) {
      callback(new Error('邮箱格式错误'))
    } else {
      callback()
    }
  }

}
export default formValidation
