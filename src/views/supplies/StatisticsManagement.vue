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
      <statistics v-if="currentMenuName == menus[0]"></statistics>
      <purchase v-else-if="currentMenuName == menus[1]"></purchase>
      <receive v-else></receive>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import Statistics from "./childComps/Statistics";
import Purchase from "./childComps/Purchase";
import Receive from "./childComps/Receive";
export default {
  name: "SuppliesStatistics",
  components: {
    JqxMenu,
    Statistics,
    Purchase,
    Receive,
  },
  data: function () {
    return {
      menus: ["统计", "采购","领用"],
      currentMenuName: "统计",
    };
  },
  methods: {
    onItemclick(event) {
      const menuName = event.args.textContent;
      this.currentMenuName = menuName;
    },
  },
};
</script>

<style>
</style>