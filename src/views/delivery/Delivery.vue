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
      <machine v-if="currentMenuName == menus[1]"></machine>
      <tube v-if="currentMenuName == menus[2]"></tube>
      <delivery-done v-if="currentMenuName == menus[3]"></delivery-done>
      <detail v-else></detail>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue'
import Machine from './childComps/Machine'
import Tube from './childComps/Tube'
import Detail from './childComps/Detail'
import DeliveryDone from './childComps/Done'
export default {
  name: 'DeleveryManagement',
  components: {
    JqxMenu,
    Machine,
    Tube,
    Detail,
    DeliveryDone,
  },
  data() {
    return {
      menus: ['数据汇总', '设备', '风管', '送货完成'],
      currentMenuName: '数据汇总',
    }
  },
  created() {},
  methods: {
    onItemclick(event) {
      const menuName = event.args.textContent
      this.currentMenuName = menuName
    },
  },
}
</script>

<style>
</style>
