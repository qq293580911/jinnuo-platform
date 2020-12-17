<template>
  <div>
    <a-menu
      :default-selected-keys="['1']"
      :default-open-keys="[]"
      :mode="mode"
      theme="dark"
    >
      <a-sub-menu
        v-for="(item, index) in menus"
        :key="index"
      >
        <span slot="title">
          <my-icon :type="item.type" /><span>{{ item.name }}</span>
        </span>

        <a-menu-item
          v-for="(child, index) in item.children"
          @click="menuItemClick(child)"
          :key="index"
        >
          {{ child.name }}
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script>
import { getMenus, Menu } from '@/network/home.js'
import { formatToTree } from '@/common/util.js'
export default {
  name: 'HomeAside',
  components: {},
  data() {
    return {
      mode: 'inline',
      menus: [],
      user: {},
    }
  },
  created() {
    this.user = JSON.parse(window.sessionStorage.getItem('user'))
    this.initMenu()
  },
  methods: {
    // collapsed() {},
    // changeMode(checked) {
    //   this.mode = checked ? 'vertical' : 'inline'
    // },
    menuItemClick(menu) {
      const params = {
        title: menu.name,
        content: menu.component,
        component: menu.component,
      }
      this.$bus.$emit('addTab', params)
    },
    initMenu() {
      const params = {
        userId: this.user.id,
      }
      getMenus(params).then((res) => {
        let menus = []
        for (const element of res) {
          menus.push(new Menu(element))
        }
        menus = formatToTree(menus)
        this.menus = menus
      })
    },
  },
}
</script>

<style scoped>
</style>
