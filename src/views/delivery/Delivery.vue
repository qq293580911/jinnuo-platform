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
      <base-management
        v-if="currentMenuName == menus[1]"
        :key="`baseKey${baseKey}`"
      ></base-management>
      <delivery-done
        v-if="currentMenuName == menus[2]"
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
import BaseManagement from './childComps/BaseManagement'
import Detail from './childComps/Detail'
import DeliveryDone from './childComps/Done'
export default {
  name: 'DeleveryManagement',
  components: {
    JqxMenu,
    BaseManagement,
    Detail,
    DeliveryDone,
  },
  data() {
    return {
      menus: ['数据汇总', '数据管理', '送货完成'],
      currentMenuName: '数据汇总',
      baseKey: 0,
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
          this.baseKey += 1
          break
        case this.menus[2]:
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
