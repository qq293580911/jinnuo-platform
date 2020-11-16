<template>
  <div>
    <a-menu v-model="current" mode="horizontal" theme="dark">
      <a-menu-item key="mail">
        <a-icon type="mail" />Navigation One
      </a-menu-item>
      <a-menu-item key="app">
        <a-icon type="appstore" />Navigation Two
      </a-menu-item>
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="setting" />Navigation Three - Submenu
        </span>
        <a-menu-item-group title="Item 1">
          <a-menu-item key="setting:1"> Option 1 </a-menu-item>
          <a-menu-item key="setting:2"> Option 2 </a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group title="Item 2">
          <a-menu-item key="setting:3"> Option 3 </a-menu-item>
          <a-menu-item key="setting:4"> Option 4 </a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
      <a-menu-item key="alipay">
        <a href="https://antdv.com" target="_blank" rel="noopener noreferrer">
          Navigation Four - Link
        </a>
      </a-menu-item>
      <a-avatar
        shape="square"
        size="large"
        icon="user"
        />
    </a-menu>
  </div>
</template>

<script>
export default {
  name: "HomeNavBar",
  data() {
    return {
      current: [""],
    };
  },
  methods: {},
};
</script>

<style scoped>
.ant-menu-horizontal {
  line-height: 64px;
}
.ant-avatar{
    float:right;
    margin: 12px;
}
</style>