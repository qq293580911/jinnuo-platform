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
      <sales-group-assign v-if="currentMenuName == menus[0]"></sales-group-assign>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import SalesGroupAssign from './childComps/SalesGroupAssign.vue'
export default {
  name: "ProductManagement",
  components: {
    JqxMenu,
    SalesGroupAssign
  },
  data: function() {
    return {
      menus: ["组人员分配"],
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
