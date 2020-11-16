import axios from 'axios'

//=>基础全局配置
axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true

//=>POST请求，请求主题数据格式处理
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.transformRequest

// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
        // let token = localStorage.getItem('token')
        // token && config.headers.Authorization == token;
        // return config
      if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization');
      }
   
      return config;
    },
    error => {
      return Promise.reject(error);
    });

axios.interceptors.response.use(response=>{
    //只拿到响应主题信息
    return response.data
},error=>{
    if(error.response){
        switch (error.response.status){
            //错误状态码处理
        }
    }else{
        if(window.navigator.onLine){
            //断网处理
            return
        }
        return Promise.reject(error)
    }
})

export default axios