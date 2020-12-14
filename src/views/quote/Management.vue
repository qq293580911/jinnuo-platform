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
      <detail v-if="currentMenuName == menus[0]"></detail>
      <statistics v-if="currentMenuName == menus[1]"></statistics>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import Detail from "./childComps/Detail";
import Statistics from "./childComps/Statistics";
export default {
  name: "QuoteManagement",
  components: {
    JqxMenu,
    Detail,
    Statistics,
  },
  data: function () {
    return {
      menus: ["数据汇总", "图形统计"],
      currentMenuName: "数据汇总",
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