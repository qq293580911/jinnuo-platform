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
        :key="'detail'"
      ></detail>
      <detail
        v-if="currentMenuName == menus[1]"
        :is-signed="true"
        :key="'signed'"
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
      currentMenuName: '数据汇总'
    }
  },
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
