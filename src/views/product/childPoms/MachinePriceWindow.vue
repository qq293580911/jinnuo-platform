<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :height="'255px'"
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

import {
  Message,
  ADD_PRODUCT_PRICE,
  EDIT_PRODUCT_PRICE
} from "common/const.js";

import {
  getAllMachineProduct,
  addMachinePrice,
  updateMachinePrice
} from "@/network/product.js";

export default {
  name: "MachinePriceWindow",
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
          name: "machine",
          type: "custom",
          label: "选择设备",
          labelWidth: "80px",
          rowHeight: "40px",
          required: true,
          init: function(component) {
            getAllMachineProduct().then((res) => {
              res.map((item) => {
                item[
                  "html"
                ] = `<div tabIndex=0 style='padding: 1px;'><div>${item["pm_name"]}</div><div>${item["power"]}</div></div>`;
                item["group"] = item["pc_name"];
                return item;
              });
              jqwidgets.createInstance(component, "jqxComboBox", {
                width: 250,
                height: 30,
                source: res,
                displayMember: "pnm_name",
                valueMember: "pnm_id",
                animationType: "none"
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
              source: pricePlan,
              displayMember: "rule",
              valueMember: "id",
              animationType: "none"
            });
          }
        },
        {
          name: "priceNonCcc",
          type: "custom",
          label: "非3C价格",
          labelWidth: "80px",
          rowHeight: "40px",
          required: false,
          init: function(component) {
            jqwidgets.createInstance(component, "jqxNumberInput", {
              width: 250,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true
            });
          }
        },
        {
          name: "priceCcc",
          type: "custom",
          label: "3C价格",
          labelWidth: "80px",
          rowHeight: "40px",
          required: false,
          init: function(component) {
            jqwidgets.createInstance(component, "jqxNumberInput", {
              width: 250,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true
            });
          }
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
              columnWidth: "50%"
            },
            {
              name: "cancelButton",
              type: "button",
              text: "取消",
              width: "60px",
              rowHeight: "50px",
              columnWidth: "50%"
            }
          ]
        }
      ],
      id: null
    };
  },
  mounted() {
    const that = this;
    const $machine = this.$refs.myForm.getComponentByName("machine");
    const $pricePlan = this.$refs.myForm.getComponentByName("pricePlan");
    const $priceCCC = this.$refs.myForm.getComponentByName("priceCcc");
    const $priceNonCCC = this.$refs.myForm.getComponentByName("priceNonCcc");

    this.machineInstance = $machine;
    this.pricePlanInstance = $pricePlan;
    this.priceNonCCCInstance = $priceNonCCC;
    this.priceCCCInstance = $priceCCC;

    this.$refs.myValidator.rules = [
      {
        input: $machine,
        message: "该项必选",
        action: "select",
        rule: function(input) {
          const index = that.machineInstance.jqxComboBox("getSelectedIndex");
          return index > -1;
        }
      },
      {
        input: $pricePlan,
        message: "该项必选",
        action: "select",
        rule(input) {
          const index = that.pricePlanInstance.jqxComboBox("getSelectedIndex");
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
      this.clearForm();
      if (params[0] == EDIT_PRODUCT_PRICE) {
        const data = params[1];
        this.machineInstance.jqxComboBox("selectItem", data["pm_id"]);
        this.pricePlanInstance.jqxComboBox("selectItem", data["ps_id"]);
        this.priceNonCCCInstance.jqxNumberInput(
          "setDecimal",
          data["price_non_ccc"]
        );
        this.priceCCCInstance.jqxNumberInput("setDecimal", data["price_ccc"]);
        this.id = data["price_id"];
      }
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const formData = {
        pmId: this.machineInstance.val(),
        psId: this.pricePlanInstance.val(),
        priceNonCcc: this.priceNonCCCInstance.val(),
        priceCcc: this.priceCCCInstance.val(),
        priceId: this.id
      };
      const title = this.$refs.myWindow.title;
      if (title == EDIT_PRODUCT_PRICE) {
        this.update(formData);
      } else {
        this.add(formData);
      }
    },
    clearForm() {
      // 重置部件设置
      this.machineInstance.jqxComboBox("clearSelection");
      this.pricePlanInstance.jqxComboBox("clearSelection");
      this.priceNonCCCInstance.jqxNumberInput("setDecimal", 0);
      this.priceCCCInstance.jqxNumberInput("setDecimal", 0);
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      addMachinePrice(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      updateMachinePrice(params).then((res) => {
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

<style>
</style>
