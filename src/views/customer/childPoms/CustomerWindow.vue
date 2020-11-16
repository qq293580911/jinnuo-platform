<template>
  <JqxWindow
    ref="myWindow"
    :width="'400px'"
    :height="'390px'"
    :autoOpen="false"
    :position="{ x: '40%', y: '30%' }"
  >
    <div></div>
    <div>
      <JqxForm ref="myForm" :template="template"> </JqxForm>
    </div>
  </JqxWindow>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";
import jqxRadioButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxradiobutton.vue";
import jqxDropDownButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdropdownbutton.vue";
import jqxTree from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue";
import jqxNumberInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxnumberinput.vue";
import jqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";
export default {
  name: "CustomerWindow",
  components: {
    JqxWindow,
    JqxForm,
    jqxDropDownButton,
    jqxTree,
    jqxNumberInput,
  },
  data() {
    return {
      template: [
        {
          name: "name",
          bind: "name",
          type: "text",
          label: "客户姓名",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          info: "输入客户姓名",
          infoPosition: "right",
        },
        {
          name: "type",
          bind: "type",
          type: "text",
          label: "客户类别",
          labelWidth: "80px",
          width: "250px",
          required: false,
          info: "输入客户类别",
          infoPosition: "right",
        },
        {
          name: "gender",
          type: "custom",
          width: "250px",
          label: "客户性别",
          required: false,
          labelWidth: "80px",
          init: function (component) {
            var div = `<div id="male" style="float: left;margin-left:50px;"><span>男</span></div>
                                        <div id="female" style="float: left;margin-left:10px;"><span>女</span></div>`;
            component.append(div);
            let maleRadioButton = jqwidgets.createInstance(
              "#male",
              "jqxRadioButton",
              {
                width: "30%",
                height: 30,
                checked: true,
              }
            );
            let femaleRadioButton = jqwidgets.createInstance(
              "#female",
              "jqxRadioButton",
              {
                width: "30%",
                height: 30,
                checked: true,
              }
            );

            $("#male").jqxRadioButton({
              width: "30%",
              height: 30,
            });
          },
        },
        {
          name: "phone",
          bind: "phone",
          type: "text",
          width: "250px",
          label: "客户电话",
          required: true,
          labelWidth: "80px",
          info: "输入客户电话",
          infoPosition: "right",
        },
        {
          name: "company",
          bind: "company",
          type: "text",
          width: "250px",
          label: "客户公司",
          required: false,
          labelWidth: "80px",
          info: "输入客户公司",
          infoPosition: "right",
        },
        {
          name: "position",
          bind: "position",
          type: "text",
          width: "250px",
          label: "客户职位",
          required: false,
          labelWidth: "80px",
          info: "输入客户职位",
          infoPosition: "right",
        },
        {
          name: "id",
          type: "custom",
          init: function (component) {
            component.append('<input id="customerId" type="hidden"/>');
          },
        },
        {
          columns: [
            {
              name: "submitButton",
              type: "button",
              text: "提交",
              width: "60px",
              height: "30px",
              rowHeight: "50px",
              align: "right",
              columnWidth: "50%",
            },
            {
              name: "cancelButton",
              type: "button",
              text: "取消",
              width: "60px",
              height: "30px",
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
      if (params[1]) {
      }
      this.$refs.myWindow.open();
    },
  },
};
</script>

<style>
</style>