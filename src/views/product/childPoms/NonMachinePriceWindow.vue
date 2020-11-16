<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :height="'265px'"
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

import { getPricePlan } from '@/network/product.js'
export default {
  name: "NonMachinePriceWindow",
  components: {
    JqxWindow,
    JqxForm,
  },
  created() {

  },
  beforeCreate() {
    getPricePlan().then(res=>{
      this.pricePlan = res
    })
  },
  data() {
    return {
      pricePlan:[],
      template: [
        {
          name: "nonMachine",
          type: "custom",
          label: "选择产品",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          init: function (component) {
            let comboBox = jqwidgets.createInstance(component,'jqxComboBox',{
              width: 250,
              height: 30
            })
            // component.jqxComboBox({
            //   source: (function () {
            //     var source = {
            //       dataFields: [
            //         { name: "pnm_id", type: "number" },
            //         { name: "pnm_name", type: "string" },
            //         { name: "pc_name", type: "string" },
            //       ],
            //       url: "../../productManage/getAllNonMachineProduct.do",
            //       dataType: "json",
            //       async: false,
            //     };
            //     var dataAdapter = new $.jqx.dataAdapter(source, {
            //       beforeLoadComplete: function (record) {
            //         record.forEach(function (element) {
            //           element["html"] =
            //             "<div tabIndex=0 style='padding: 1px;'><div>" +
            //             element["pnm_name"] +
            //             "</div></div>";
            //           element["group"] = element["pc_name"];
            //         });
            //       },
            //     });
            //     return dataAdapter;
            //   })(),
            //   width: 250,
            //   height: 30,
            //   displayMember: "pnm_name",
            //   valueMember: "pnm_id",
            // });
          },
        },
        {
          name: "pricePlan",
          type: "custom",
          label: "价格方案",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          init: function (component) {
            let comboBox = jqwidgets.createInstance(component,'jqxComboBox',{
              width: 250,
              height: 30,
              displayMember: "rule",
              valueMember: "id",
              source:this.pricePlan
            })
            // component.jqxComboBox({
            //   source: (function () {
            //     const rowsData = $("#priceSchemeGrid").jqxGrid("getRows");
            //     const array = [];
            //     rowsData.forEach(function (element) {
            //       const map = {};
            //       map.psId = element["id"];
            //       map.psRule = element["rule"];
            //       array.push(map);
            //     });
            //     return array;
            //   })(),
            //   width: 250,
            //   height: 30,
            //   displayMember: "psRule",
            //   valueMember: "psId",
            // });
          },
        },
        {
          name: "panelPrice",
          type: "custom",
          label: "产品价格",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          init: function (component) {
            let comboBox = jqwidgets.createInstance(component,'jqxNumberInput',{
              width: 250,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true
            })
          },
        },
        {
          name: "valvePrice",
          type: "custom",
          label: "产品价格",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          init: function (component) {
            let comboBox = jqwidgets.createInstance(component,'jqxNumberInput',{
              width: 250,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true
            })
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
          type: "custom",
          init: function (component) {
            component.append('<input id="priceId" type="hidden"/>');
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

<style>
</style>