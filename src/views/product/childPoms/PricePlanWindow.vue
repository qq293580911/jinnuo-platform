<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :height="'225px'"
      :autoOpen="false"
      :position="{ x: '40%', y: '30%' }"
    >
      <div>
        <JqxForm ref="myForm" :template="template"> </JqxForm>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";
export default {
  name: "PricePlanWindow",
  components: {
    JqxWindow,
    JqxForm,
  },
  data() {
    return {
      template: [
        {
          name: "rule",
          bind: "rule",
          type: "text",
          label: "方案规则",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px",
        },
        {
          name: "obsolete",
          bind: "obsolete",
          type: "dropdownlist",
          label: "过时状态",
          labelWidth: "80px",
          width: "250px",
          required: false,
          options: [{ value: "新" }, { value: "旧" }],
        },
        {
          name: "remark",
          type: "text",
          label: "备注",
          labelWidth: "80px",
          width: "250px",
          required: false,
          rowHeight: "40px",
        },
        {
          columns: [
            {
              name: "submitButton",
              type: "button",
              text: "提交",
              width: "60px",
              rowHeight: "50px",
              align: "right",
              columnWidth: "50%",
            },
            {
              name: "cancelButton",
              type: "button",
              text: "取消",
              width: "60px",
              rowHeight: "50px",
              columnWidth: "50%",
            },
          ],
        },
        {
          name: "id",
          type: "custom",
          init: function (component) {
            component.append('<input id="id" type="hidden"/>');
          },
        },
      ],
    };
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      this.$refs.myWindow.open();
    },
  }
};
</script>

<style>
</style>