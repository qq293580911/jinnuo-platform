<template>
  <div>
    <JqxMenu
      ref="myMenu"
      :width="'100%'"
      :height="30"
      @itemclick="onItemclick($event)"
    >
      <ul>
        <li
          v-for="(item, index) in menus"
          :key="index"
        >{{ item }}</li>
      </ul>
    </JqxMenu>
    <keep-alive>
      <authority-tree v-if="currentMenuName == menus[0]"></authority-tree>
      <authority-detail v-if="currentMenuName == menus[1]"></authority-detail>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue'
import AuthorityTree from './childComps/AuthorityTree'
import AuthorityDetail from './childComps/AuthorityDetail'
export default {
  components: {
    JqxMenu,
    AuthorityTree,
    AuthorityDetail
  },
  data() {
    return {
      menus: ["权限树", "权限列表"],
      currentMenuName: "权限树"
    }
  },
  mounted() {},
  methods: {
    onItemclick(event) {
      const menuName = event.args.textContent
      this.currentMenuName = menuName
    },
  },
}
</script>

<style scoped>
</style>