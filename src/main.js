import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/reset.css'
import './config/elementui.js'
import axios from 'axios'
import store from './store'
import { CHANGE_KOKEN } from './store/mutation-types'
import VueContextMenu from 'vue-contextmenu'
Vue.use(VueContextMenu)

axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8'
// axios.defaults.baseURL = 'http://127.0.0.1:3000/'
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return error.response.data
  }
)

// 添加响应拦截器
axios.interceptors.response.use(res => {
  // console.log('响应数据', res)
  // 对响应数据做点什么
  if (res && res.data) {
    // console.log('')
    return res.data
  } else {
    return Promise.reject(res.data)
  }
}, error => {
  console.log('想要那个数据')
  console.log(error.response)
  if (error.response.status === 401) {
    localStorage.clear()
    store.commit(CHANGE_KOKEN, '')
    router.replace({ name: 'login' })
  }
  return error.response.data
})

Vue.prototype.axios = axios
Vue.config.productionTip = false
// bus总线
Vue.prototype.bus = new Vue()

// 全局过滤器 所有时间都差八小时
Vue.filter('filterTime', (val, pattern = 'yyyy-mm-dd') => {
  const dt = new Date(val)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  let str = ''
  if (pattern === 'yyyy-mm-dd') {
    str = `${y}-${m}-${d}`
  } else if (pattern === 'yyyy-mm-dd hh:mm:ss') {
    str = `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  } else {
    str = `${y}-${m}-${d} ${hh}:${mm}`
  }
  return str
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
