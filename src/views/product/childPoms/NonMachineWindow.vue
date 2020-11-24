<template>
  <JqxWindow
    ref="myWindow"
    :width="'400px'"
    :height="'545px'"
    :autoOpen="false"
    :position="{ x: '40%', y: '30%' }"
  >
    <div>
      <JqxForm ref="myForm" :template="template"> </JqxForm>
    </div>
  </JqxWindow>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";
import jqxDropDownButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdropdownbutton.vue";
import jqxTree from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue";
import jqxNumberInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxnumberinput.vue";
import jqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";

import { getCategory } from "@/network/product.js";
export default {
  name: "NonMachineWindow",
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
          type: "text",
          label: "产品名称",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          info: "输入产品名称",
          infoPosition: "right",
        },
        {
          name: "category",
          label: "产品类型",
          labelWidth: "80px",
          type: "custom",
          required: true,
          rowHeight: "40px",
          init: function (component) {
            component.append(
              `<div id="categoryButton"><div style="border: none;" id='pmPcId'></div></div>`
            );
            let dropDownButton = jqwidgets.createInstance(
              "#categoryButton",
              "jqxDropDownButton",
              {
                width: 250,
                height: 30,
              }
            );
            const source = {
              datatype: "json",
              dataFields: [
                { name: "id", map: "pc_id" },
                { name: "pId", map: "pc_pid" },
                { name: "name", map: "pc_name" },
              ],
              url: "/productCateg/getAllProductCategory.do",
            };
            const dataAdapter = new jqx.dataAdapter(source, {
              loadServerData(serverdata, source, callback) {
                getCategory(source.url, source, serverdata).then((res) => {
                  callback({
                    originaldata: res,
                    records: res,
                  });
                });
              },
              loadComplete(records) {},
            });
            dataAdapter.dataBind();
            const records = dataAdapter.getRecordsHierarchy(
              "id",
              "pId",
              "items",
              [
                {
                  name: "name",
                  map: "label",
                },
              ]
            );

            let dropDownTree = jqwidgets.createInstance("#pmPcId", "jqxTree", {
              source: records,
              width: 250,
              height: 250,
            });

            //树绑定选择事件
            dropDownTree.addEventHandler("select", (event) => {

            });
          },
        },
        {
          name: "limitSize",
          label: "界定尺寸",
          type: "custom",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          init: function (component) {
            component.append(
              '<div style="display:inline-block;vertical-align: middle;" id="limitSizeLong"></div>'
            );
            component.append(
              '<span style="margin-left:2px;margin-right:2px;display:inline-block;vertical-align: middle;">*</span>'
            );
            component.append(
              '<div style="display:inline-block;vertical-align: middle;" id="limitSizeShort"></div>'
            );
            let numberInput = jqwidgets.createInstance(
              "#limitSizeLong,#limitSizeShort",
              "jqxNumberInput",
              {
                width: 120,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true,
              }
            );
          },
        },
        {
          name: "minSize",
          type: "custom",
          label: "最小尺寸",
          labelWidth: "80px",
          width: "250px",
          required: false,
          rowHeight: "40px",
          init: function (component) {
            let numberInput = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true,
              }
            );
          },
        },
        {
          name: "maxSize",
          type: "custom",
          label: "最大尺寸",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          init: function (component) {
            let numberInput = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true,
              }
            );
          },
        },
        {
          name: "minSizeRound",
          type: "custom",
          label: "最小尺寸",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          info:'圆形的最小尺寸',
          infoPosition:'right',
          init: function (component) {
            let numberInput = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true,
              }
            );
          },
        },
        {
          name: "maxSizeRound",
          type: "custom",
          label: "最大尺寸",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          info:'圆形的最大尺寸',
          infoPosition:'right',
          init: function (component) {
            let numberInput = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true,
              }
            );
          },
        },
        {
          name: "formula",
          type: "custom",
          label: "计算公式",
          labelWidth: "80px",
          required: true,
          rowHeight: "40px",
          init: function (component) {
            let comboBox = jqwidgets.createInstance(component, "jqxComboBox", {
              width: 250,
              height: 30,
              source: [],
            });
            // component.jqxComboBox({
            //   source: (function () {
            //     const source = {
            //       dataFields: [{ map: 0, type: "string" }],
            //       url: "../../productManage/getAllProductFormula.do",
            //       type: "get",
            //       dataType: "json",
            //       async: false,
            //     };
            //     const dataAdapter = new $.jqx.dataAdapter(source);
            //     dataAdapter.dataBind();
            //     return dataAdapter.recordids;
            //   })(),
            //   width: 250,
            //   height: 30,
            // });
          },
        },
        {
          name: "unit",
          label: "计量单位",
          type: "dropdownlist",
          labelWidth: "80px",
          width:'250px',
          required: true,
          rowHeight: "40px",
          options:[
            { label: "个"}
          ]
        },
        {
          name: "isCCC",
          type: "dropdownlist",
          label: "强制认证",
          labelWidth: "80px",
          width:'250px',
          required: true,
          rowHeight: "40px",
          options:[
            { label: "是", value: 1 },
            { label: "否", value: 0 }
          ]
          // init: function (component) {
          //   let comboBox = jqwidgets.createInstance(component, "jqxComboBox", {
          //     source: [
          //       { label: "是", value: 1 },
          //       { label: "否", value: 0 },
          //     ],
          //     width: 250,
          //     height: 30,
          //     displayMember: "label",
          //     valueMember: "value",
          //   });
          // },
        },
        {
          name: "remark",
          label: "备注",
          type: "text",
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
            component.append('<input id="pnmId" type="hidden"/>');
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
  },
};
</script>

<style scoped>
</style>