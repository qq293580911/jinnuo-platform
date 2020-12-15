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
      <price-plan v-if="currentMenuName == menus[0]"></price-plan>
      <machine-price v-else-if="currentMenuName == menus[1]"></machine-price>
      <non-machine-price v-else></non-machine-price>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import PricePlan from "./childPoms/PricePlan";
import MachinePrice from "./childPoms/MachinePrice";
import NonMachinePrice from "./childPoms/NonMachinePrice";
export default {
  name: "ProductPrice",
  components: {
    JqxMenu,
    PricePlan,
    MachinePrice,
    NonMachinePrice
  },
  data() {
    return {
      menus: ["价格方案", "设备价格", "非设备价格"],
      currentMenuName: "价格方案"
    };
  },
  created() {

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
