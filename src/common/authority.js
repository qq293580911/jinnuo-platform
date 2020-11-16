function hasAuthority(...param) {
  const permissions = param[0].$store.state.permissions
  const hasItem = permissions.filter(item=>{
    return item.perCode == param[1]
  })
  if(hasItem.length>0){
    return true
  }
  return false
}

export default {
  // Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
  install: function (Vue) {
    Vue.prototype.hasAuthority = (...param) => hasAuthority(...param)
  }
}
