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
      <detail
        v-if="currentMenuName == menus[0]"
        :key="`detail${detailKey}`"
      ></detail>
      <detail
        v-if="currentMenuName == menus[1]"
        :is-signed="true"
        :key="`signed${signedKey}`"
      ></detail>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue'
import Detail from './childComps/Detail'
export default {
  name: 'ContractManagement',
  components: {
    JqxMenu,
    Detail,
  },
  data() {
    return {
      menus: ['数据汇总', '只看已签'],
      currentMenuName: '数据汇总',
      detailKey: 0,
      signedKey: 0,
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
          this.signedKey += 1
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
