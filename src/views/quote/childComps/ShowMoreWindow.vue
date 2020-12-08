<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="200"
      :height="200"
      :maxHeight="500"
      :animationType="'none'"
      :autoOpen="false"
      :resizable="false"
      :draggable="false"
      :showCloseButton="true"
      :showCollapseButton="false"
      :position="position"
      @closed="closed($event)"
    >
      <div>显示更多列</div>
      <div>
        <JqxListBox
          ref="myListBox"
          :width="'100%'"
          :height="'100%'"
          :source="source"
          :checkboxes="true"
          :displayMember="'label'"
          :valueMember="'value'"
          @checkChange="checkChange($event)"
        ></JqxListBox>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxListBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue";
export default {
  components: {
    JqxWindow,
    JqxListBox,
  },
  data() {
    return {
      position: {
        x: 0,
        y: 0,
      },
      source: [
        { label: "加点", value: "transfer", checked: false },
        { label: "公式", value: "formula", checked: false },
        { label: "指派类型", value: "designateType", checked: false },
      ],
    };
  },
  methods: {
    checkChange(event) {
      const that = this;
      console.log(that);
      const field = event.args.value;
      if (event.args.checked) {
        that.$emit("showColumn", field);
      } else {
        that.$emit("hiddenColumn", field);
      }
    },
    open(...params) {
      this.$refs.myWindow.position = {
        x: params[0] - 12,
        y: params[1] + 10,
      };
      this.$refs.myWindow.open();
    },
    close() {
      this.$refs.myWindow.close();
    },
    closed(event) {
      this.$parent.showMore = false;
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.destroy();
  },
};
</script>

<style>
</style>