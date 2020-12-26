<template>
  <div>
    <JqxMenu
      ref="myMenu"
      :width="'100%'"
      :height="30"
      @itemclick="onItemclick($event)"
    >
      <ul>
        <li v-for="(item, index) in menus" :key="index">{{ item }}</li>
      </ul>
    </JqxMenu>
    <keep-alive>
      <group-management v-if="currentMenuName == menus[0]"></group-management>
      <sales-group-assign v-if="currentMenuName == menus[1]"></sales-group-assign>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import GroupManagement from './childComps/GroupManagement.vue'
import SalesGroupAssign from './childComps/SalesGroupAssign.vue'
export default {
  name: "ProductManagement",
  components: {
    JqxMenu,
    GroupManagement,
    SalesGroupAssign
  },
  data: function() {
    return {
      menus: ["组管理", "组人员分配"],
      currentMenuName: "组人员分配"
    }
  },
  methods: {
    onItemclick(event) {
      const menuName = event.args.textContent
      this.currentMenuName = menuName
    }
  }
};
</script>

<style scoped>
</style>
