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
        v-if="currentMenuName == menus[1]"
        :key="`machineKey${machineKey}`"
      ></machine>
      <tube
        v-if="currentMenuName == menus[2]"
        :key="`tubeKey${tubeKey}`"
      ></tube>
      <delivery-done
        v-if="currentMenuName == menus[3]"
        :key="`doneKey${doneKey}`"
      ></delivery-done>
      <detail
        v-else
        :key="`detailKey${detailKey}`"
      ></detail>
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
      machineKey: 0,
      tubeKey: 0,
      doneKey: 0,
      detailKey: 0,
    }
  },
  created() {},
  methods: {
    onItemclick(event) {
      const menuName = event.args.textContent
      switch (menuName) {
        case this.menus[0]:
          this.detailKey += 1
          break
        case this.menus[1]:
          this.machineKey += 1
          break
        case this.menus[2]:
          this.tubeKey += 1
          break
        case this.menus[3]:
          this.doneKey += 1
          break
        default:
          break
      }
      this.currentMenuName = menuName
    },
  },
}
</script>

<style>
</style>
