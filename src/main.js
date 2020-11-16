import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import router from './router'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '../public/styles/jqx.base.css';
import '../public/styles/jqx.ui-smoothness.css';
import 'assets/css/base.css';
Vue.use(Antd)

// 自定义全局
import authority from "@/common/authority.js"
Vue.prototype.authority = authority
Vue.use(authority)

Vue.config.productionTip = false

//引入Ant Design Vue中的icon
import {Icon} from 'ant-design-vue'
//这个iconfont.js就是从iconfont.cn网站上下载后的解压JS文件
import iconFront from './assets/iconfont/iconfont.js'
const myicon = Icon.createFromIconfontCN({
  scriptUrl: iconFront
})
Vue.component('my-icon', myicon)

//添加事件总线对象
Vue.prototype.$bus = new Vue()



let myVue = new Vue({
  render: h => h(App),
  // 挂载到Vue示例上
  router,
  store
}).$mount('#app')
