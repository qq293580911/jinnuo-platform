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
      <base-category v-if="currentMenuName == menus[0]"></base-category>
      <standard-category
        v-else-if="currentMenuName == menus[1]"
      ></standard-category>
      <assign-type v-else></assign-type>
    </keep-alive>
  </div>
</template>

<script>
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";
import BaseCategory from "./childPoms/BaseCategory";
import StandardCategory from "./childPoms/StandardCategory";
import AssignType from "./childPoms/AssignType";

export default {
  name: "ProductCategory",
  data() {
    return {
      menus: ["产品分类", "标准分类", "指派类型"],
      currentMenuName: "产品分类",
    };
  },
  components: {
    JqxMenu,
    BaseCategory,
    StandardCategory,
    AssignType,
  },
  methods: {
    onItemclick(event) {
      const menuName = event.args.textContent;
      this.currentMenuName = menuName;
    },
  },
};
</script>

<style>
</style>