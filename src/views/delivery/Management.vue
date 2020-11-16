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
      <base-management v-if="currentMenuName == menus[0]"></base-management>
      <detail v-else></detail>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import BaseManagement from "./childComps/BaseManagement";
import Detail from "./childComps/Detail";
export default {
  name: "DeleveryManagement",
  components: {
    JqxMenu,
    BaseManagement,
    Detail,
  },
  data() {
    return {
      menus: ["数据管理", "数据汇总"],
      currentMenuName: "数据汇总",
    };
  },
  created() {},
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