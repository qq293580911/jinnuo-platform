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
      <base-authority v-if="currentMenuName == menus[0]"></base-authority>
      <group-authority v-if="currentMenuName == menus[1]"></group-authority>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue'
import BaseAuthority from './childComps/BaseAuthority'
import GroupAuthority from './childComps/GroupAuthority'
export default {
  components: {
    JqxMenu,
    BaseAuthority,
    GroupAuthority
  },
  data() {
    return {
      menus: ['基本权限', '部门权限'],
      currentMenuName: '基本权限',
    }
  },
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
