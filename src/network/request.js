import axios from 'axios'
import qs from 'qs'
import { message, Modal } from 'ant-design-vue'

import { debounce } from '@/common/util.js'

import context from '../main.js'
// 退出登录的提示
const logOutTip = debounce((msg) => {
  Modal.warning({
    title: `${msg}`,
    okText: '确认',
    onOk() {
      context.$router.push('/login')
    },
    class: 'test',
  })
}, 500)

export function request(config) {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    transformRequest: [
      function (data, headers) {
        // 对请求头设置
        if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
          return qs.stringify(data)
        } else if (
          headers['Content-Type'] === 'multipart/form-data;charset=UTF-8'
        ) {
          return data
        } else if (headers['Content-Type'] == 'application/json') {
          return data
        } else {
          headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
          headers.delete['Content-Type'] = 'application/x-www-form-urlencoded'
          headers.put['Content-Type'] = 'application/x-www-form-urlencoded'
          data = qs.stringify(data)
        }
        return data
      },
    ],
  })

  instance.interceptors.request.use(
    (config) => {
      let url = config.url
      // get参数编码
      if (config.method.toLowerCase() === 'get' && config.params) {
        url += '?'
        const keys = Object.keys(config.params)
        for (const key of keys) {
          url += `${encodeURIComponent(key)}=${encodeURIComponent(
            config.params[key]
          )}&`
        }
        url = url.substring(0, url.length - 1)
        config.params = {}
      }
      config.url = url
      return config
    },
    (error) => {
      message.error('请求超时')
      return Promise.resolve(error)
    }
  )

  instance.interceptors.response.use(
    (res) => {
      // 格式化 jqwidgets 的数据格式
      if (config.source) {
        let data = res.data
        if (typeof res.data == 'object' && res.data.rows) {
          data = res.data.rows
        }
        var dataArray = []
        for (var i = 0; i < data.length; i++) {
          var record = data[i]
          var datarow = {}
          for (var j = 0; j < config.source.datafields.length; j++) {
            var datafield = config.source.datafields[j]
            var value = ''
            if (undefined == datafield || datafield == null) {
              continue
            }
            if (datafield.map) {
              value = record[datafield.map]
            }
            // searches by both selectors when necessary.
            if (value === '') {
              value = record[datafield.name]
            }
            datarow[datafield.name] = value
          }
          dataArray[dataArray.length] = datarow
        }
        res.data.rows = dataArray
        res.data.records = dataArray
      }
      if (res.data.message != null) {
        message.success(res.data.message)
      }
      if (res.data.state == 403) {
        logOutTip(res.data.msg)
      }
      return res.data
    },
    (error) => {
      // 当响应异常时做一些处理
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            error.message = '请求错误(400)'
            break
          case 401:
            error.message = '未授权，请重新登录(401)'
            break
          case 403:
            error.message = '拒绝访问(403)'
            break
          case 404:
            error.message = '请求出错(404)'
            break
          case 408:
            error.message = '请求超时(408)'
            break
          case 500:
            error.message = '服务器错误(500)'
            break
          case 501:
            error.message = '服务未实现(501)'
            break
          case 502:
            error.message = '网络错误(502)'
            break
          case 503:
            error.message = '服务不可用(503)'
            break
          case 504:
            error.message = '网络超时(504)'
            break
          case 505:
            error.message = 'HTTP版本不受支持(505)'
            break
          default:
            error.message = `连接出错(${error.response.status})!`
        }
      } else {
        error.message = '连接服务器失败!'
      }
      message.error(error.message)
      return Promise.resolve(error)
    }
  )
  return instance(config)
}
