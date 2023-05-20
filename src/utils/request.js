import axios from 'axios'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import ErrorCodes from 'utils/enum-error.js'
import { useUserStore } from 'store'
import { getToken } from 'utils/auth.js'

// 创建请求实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  // 指定请求超时的毫秒数
  timeout: 10000,
  // 表示跨域请求时是否需要使用凭证
  withCredentials: false,
})

// 前置拦截器（发起请求之前的拦截）
instance.interceptors.request.use(
    (config) => {

      /** ---------------- 接口是否需要携带token, 默认携带 ---------------- **/
      const isToken = config.headers?.isToken === false
      if (getToken() && !isToken) {
        config.headers['Authorization'] = 'Bearer ' + getToken()
      }
      return config

    },
    (error) => {
      console.log(error)
      return Promise.reject(error)
    },
)

// 后置拦截器（获取到响应时的拦截）
instance.interceptors.response.use(
    (res) => {
      /**
       * 根据你的项目实际情况来对 response 和 error 做处理，以下为常见错误类型
       * 200 操作成功
       * 201 对象创建成功
       * 202 请求已经被接受
       * 204 操作已经执行成功，但是没有返回数据
       * 301 资源已被移除
       * 303 重定向
       * 304 资源没有被修改
       * 400 参数列表错误（缺少，格式不匹配）
       * 401 未授权
       * 403 访问受限，授权过期
       * 404 资源，服务未找到
       * 405 不允许的http方法
       * 409 资源冲突，或者资源被锁
       * 415 不支持的数据，媒体类型
       * 500 系统内部错误
       * 501 接口未实现
       * 601 系统警告消息
       */

      // 未设置状态码则默认为200
      const code = res.data.code || 200
      // 获取错误信息
      const msg = ErrorCodes[code] || res.data.msg || ErrorCodes['default']
      // 响应判断处理
      if (code === 401) {
        // 数据获取出错: 登录过期
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
          useUserStore().logOut().then(() => {
            location.href = '/index';
          })
        }).catch(() => {});
        return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
      } else if (code === 500) {
        // 数据获取出错: 后端已知500错误
        ElMessage.error(msg)
        return Promise.reject(new Error(msg))
      } else if (code === 601) {
        // 数据获取出错: 后端已知系统警告
        ElMessage.warning(msg)
        return Promise.reject(new Error(msg))
      } else if (code !== 200) {
        // 数据获取出错: 其他未知错误，使用消息通知框
        ElNotification.error(msg)
        return Promise.reject(new Error('error'))
      } else {
        // 数据响应成功
        return Promise.resolve(res.data)
      }

    }, (error) => {

      // 在这里处理HTTP状态码非200的错误信息
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时'
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substr(message.length - 3) + '异常'
      }
      console.log('error: ' + error)
      ElMessage.error(message)
      return Promise.reject(error)

    },
)

export default instance