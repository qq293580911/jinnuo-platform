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
      <machine
        v-if="currentMenuName == menus[0]"
        :key="`machineKey${machineKey}`"
      ></machine>
      <tube
        v-else
        :key="`tubeKey${tubeKey}`"
      ></tube>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue'
import Machine from './childComps/Machine'
import Tube from './childComps/Tube'
export default {
  name: 'OrderManagement',
  components: {
    JqxMenu,
    Machine,
    Tube,
  },
  data() {
    return {
      menus: ['设备部分', '风管部分'],
      currentMenuName: '设备部分',
      machineKey: 0,
      tubeKey: 0,
    }
  },
  created() {},
  methods: {
    onItemclick(event) {
      const menuName = event.args.textContent
      switch (menuName) {
        case this.menus[0]:
          this.machineKey += 1
          break
        case this.menus[1]:
          this.tubeKey += 1
          break
        default:
          break
      }
      this.currentMenuName = menuName
    },
  },
}
</script>

<style scoped>
</style>
