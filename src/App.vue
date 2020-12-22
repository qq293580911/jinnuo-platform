<template>
  <div id="app">
    <keep-alive :exclude="['Home']">
      <router-view v-if="isRouterAlive"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true //再打开
      })
    },
  },
}
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  padding: 0;
  margin: 0;
}
@import '../public/styles/jqx.base.css';
@import '../public/styles/jqx.base.css';
@import '../public/styles/jqx.android.css';

@import '../public/styles/jqx.arctic.css';
@import '../public/styles/jqx.black.css';
@import '../public/styles/jqx.blackberry.css';

@import '../public/styles/jqx.blue.css';
@import '../public/styles/jqx.bootstrap.css';
@import '../public/styles/jqx.classic.css';
@import '../public/styles/jqx.dark-ie.css';
@import '../public/styles/jqx.darkblue.css';
@import '../public/styles/jqx.energyblue.css';
@import '../public/styles/jqx.flat.css';

@import '../public/styles/jqx.fresh.css';

@import '../public/styles/jqx.glacier.css';
@import '../public/styles/jqx.highcontrast.css';
@import '../public/styles/jqx.light-ie.css';
@import '../public/styles/jqx.light.css';
@import '../public/styles/jqx.material-green.css';
@import '../public/styles/jqx.material-purple.css';
@import '../public/styles/jqx.material.css';
@import '../public/styles/jqx.metro.css';
@import '../public/styles/jqx.metrodark.css';
@import '../public/styles/jqx.mobile.css';
@import '../public/styles/jqx.office.css';
@import '../public/styles/jqx.orange.css';
@import '../public/styles/jqx.shinyblack.css';
@import '../public/styles/jqx.summer.css';
@import '../public/styles/jqx.ui-darkness.css';
@import '../public/styles/jqx.ui-le-frog.css';
@import '../public/styles/jqx.ui-lightness.css';
@import '../public/styles/jqx.ui-overcast.css';
@import '../public/styles/jqx.ui-redmond.css';
@import '../public/styles/jqx.ui-smoothness.css';
@import '../public/styles/jqx.ui-start.css';
@import '../public/styles/jqx.ui-sunny.css';

@import '../public/styles/jqx.web.css';

@import '../public/styles/jqx.windowsphone.css';
</style>
