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
      <non-machine v-else></non-machine>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import Machine from './childPoms/Machine'
import NonMachine from './childPoms/NonMachine'
export default {
  name: "ProductManagement",
  components: {
    JqxMenu,
    Machine,
    NonMachine
  },
  data: function () {
    return {
      menus: ["设备类", "非设备类"],
      currentMenuName: "设备类",
    }
  },
  methods: {
    onItemclick(event){
      const menuName = event.args.textContent
      this.currentMenuName = menuName
    }
  }
};
</script>

<style scoped>
</style>