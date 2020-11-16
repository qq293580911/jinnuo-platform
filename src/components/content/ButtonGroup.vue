<template>
  <div style="margin-left: 60px; float: left">
    <div style="margin-top: 10px">
      <JqxButton @click="AddOnClick()" :width="125" :height="25">
        添加
      </JqxButton>
    </div>
    <div style="margin-top: 10px">
      <JqxButton @click="UpdateOnClick()" :width="125" :height="25">
        编辑
      </JqxButton>
    </div>
    <div style="margin-top: 10px">
      <JqxButton @click="RemoveOnClick()" :width="125" :height="25">
        删除u
      </JqxButton>
    </div>
    <div style="margin-top: 10px">
      <JqxButton @click="ExpandOnClick()" :width="125" :height="25">
        展开
      </JqxButton>
    </div>
    <div style="margin-top: 10px">
      <JqxButton @click="CollapseOnClick()" :width="125" :height="25">
        收起
      </JqxButton>
    </div>
    <div style="margin-top: 10px">
      <JqxButton @click="ExpandAllOnClick()" :width="125" :height="25">
        展开全部
      </JqxButton>
    </div>
    <div style="margin-top: 10px">
      <JqxButton @click="CollapseAllOnClick()" :width="125" :height="25">
        收起全部
      </JqxButton>
    </div>
  </div>
</template>

<script>
import JqxButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue";
export default {
  name: "ButtonGroup",
  components: {
    JqxButton
  },
};
</script>

<style scoped>
</style>