import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  // 当执行npm run dev => .evn.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置超时时间
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // config是请求的配置信息
  // 注入token
  // 先判断有无token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果超时
      // 删除token和用户信息 => 退出登录
      store.dispatch('user/logout')
      // 跳转到首页
      router.push('/login')
      return Promise.reject(new Error('token过期了'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  // 必须return config，因为请求进入请求拦截器必须返回请求的配置信息
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  // 根据success决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错了 不能进then，要进catch
    Message.error(message)
    // 没有错误对象 new一个
    return Promise.reject(new Error(message))
  }
}, error => {
  // error信息里面有response对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于code=10002时，表示后端提示token超时
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})
function IsCheckTimeOut() {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
