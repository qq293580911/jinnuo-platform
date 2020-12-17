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
        <JqxValidator
          ref="myValidator"
          @validationSuccess="onValidationSuccess($event)"
        >
          <JqxForm ref="myForm" :template="template"> </JqxForm>
        </JqxValidator>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxValidator from "jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";

import { EDIT_PRODUCT_PRICE } from "@/common/const";
import {
  getAllNonMachineProduct,
  addNonMachinePrice,
  updateNonMachinePrice
} from "@/network/product.js";
export default {
  name: "NonMachinePriceWindow",
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm
  },
  data() {
    const that = this;
    return {
      template: [
        {
          name: "name",
          type: "custom",
          label: "选择产品",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          init: function(component) {
            getAllNonMachineProduct().then((res) => {
              res.map((item) => {
                item[
                  "html"
                ] = `<div tabIndex=0 style='padding: 1px;'><div>${item["pnm_name"]}</div><div>`;
                item["group"] = item["pc_name"];
                return item;
              });
              jqwidgets.createInstance(component, "jqxComboBox", {
                width: 250,
                height: 30,
                source: res,
                displayMember: "pnm_name",
                valueMember: "pnm_id",
                animationType: 'none'
              });
            });
          }
        },
        {
          name: "pricePlan",
          type: "custom",
          label: "价格方案",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          init: function(component) {
            const pricePlan = that.$store.state.pricePlan;
            jqwidgets.createInstance(component, "jqxComboBox", {
              width: 250,
              height: 30,
              displayMember: "rule",
              valueMember: "id",
              source: pricePlan,
              animationType: 'none'
            });
          }
        },
        {
          name: "panelPrice",
          type: "custom",
          label: "产品价格",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          info: "面板/常规/非3C",
          infoPosition: "right",
          init: function(component) {
            jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true
              }
            );
          }
        },
        {
          name: "valvePrice",
          type: "custom",
          label: "产品价格",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          info: "阀体/圆形/3C",
          init: function(component) {
            jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true
              }
            );
          }
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
              columnWidth: "50%"
            },
            {
              name: "cancelButton",
              type: "button",
              text: "取消",
              width: "60px",
              height: "30px",
              rowHeight: "50px",
              columnWidth: "50%"
            }
          ]
        },
        {
          type: "custom",
          init: function(component) {
            component.append('<input id="priceId" type="hidden"/>');
          }
        }
      ]
    };
  },
  mounted() {
    const $product = this.$refs.myForm.getComponentByName("name");
    const $pricePlan = this.$refs.myForm.getComponentByName("pricePlan");
    const $panelPrice = this.$refs.myForm.getComponentByName("panelPrice");
    const $valvePrice = this.$refs.myForm.getComponentByName("valvePrice");

    this.productInstance = $product;
    this.pricePlanInstance = $pricePlan;
    this.panelPriceInstance = $panelPrice;
    this.valvePriceInstance = $valvePrice;

    this.$refs.myValidator.rules = [
      {
        input: $product,
        message: "该项必选",
        action: "select",
        rule: function() {
          var index = $product.jqxComboBox("getSelectedIndex");
          return index > -1;
        }
      },
      {
        input: $pricePlan,
        message: "该项必选",
        action: "select",
        rule: function() {
          var index = $pricePlan.jqxComboBox("getSelectedIndex");
          return index > -1;
        }
      }
    ];

    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName("submitButton");
    confirmBtn[0].addEventListener("click", (event) => {
      this.$refs.myValidator.validate(document.getElementById("myForm"));
    });
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      if (params[0] == EDIT_PRODUCT_PRICE) {
        const data = params[1]
        console.log(data)
        this.productInstance.jqxComboBox('selectItem', data['pnm_id'])
        this.pricePlanInstance.jqxComboBox('selectItem', data['ps_id'])
        this.panelPriceInstance.jqxNumberInput('setDecimal', data['panel_price'])
        this.valvePriceInstance.jqxNumberInput('setDecimal', data['valve_price'])
        this.id = this['price_id']
      }
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const formData = {};
      formData.pnmId = this.productInstance.val();
      formData.psId = this.pricePlanInstance.val();
      formData.panelPrice = this.panelPriceInstance.val();
      formData.valvePrice = this.valvePriceInstance.val();
      formData.priceId = this.id;
      const title = this.$refs.myWindow.title;
      if (title == EDIT_PRODUCT_PRICE) {
        this.update(formData);
      } else {
        this.add(formData);
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      addNonMachinePrice(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      updateNonMachinePrice(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    }
  },
  beforeDestroy() {
    this.$refs.myWindow.close();
  }
};
</script>

<style scoped>
</style>
