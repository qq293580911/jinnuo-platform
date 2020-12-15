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
      <machine v-if="currentMenuName == menus[0]"></machine>
      <tube v-else></tube>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import Machine from "./childComps/Machine";
import Tube from "./childComps/Tube";
export default {
  components: {
    JqxMenu,
    Machine,
    Tube
  },
  data() {
    return {
      menus: ["设备", "风管"],
      currentMenuName: "设备"
    };
  },
  methods: {
    onItemclick(event) {
      const menuName = event.args.textContent;
      this.currentMenuName = menuName;
    }
  }
};
</script>

<style>
</style>
