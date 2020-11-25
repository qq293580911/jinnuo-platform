// 路由整合
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 导入对应的路由
const Login = ()=> import('components/content/Login')
const Home = ()=> import('components/content/home/Home')

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name:'login',
      component: Login,
    },
    {
      // 主面板
      path: '/home',
      name:'home',
      component: Home,
      // 下面这个meta是重点，这里面配置requireAuth 为true，就是说必须登录的才能访问
      // meta : {
      //   requireAuth: true, 
      // }
    }
  ],
  // base:'/admin/',
  mode:'history'
})

//导航守卫
//为什么传这三个参数，官网有详细介绍
router.beforeEach((to,from,next) => {
   //如果访问的登录页，直接放行
   if(to.path==='/login'){
      return next()
   }
   //从sessio中取到保存到额token值
   const token  = window.sessionStorage.getItem('token')
   //没有token，强制跳转登录页
   if(!token){
      return next('/login')
   }
   //放行
   next()
});

//3、导出
export default router