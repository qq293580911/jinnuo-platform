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
import JqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";

import {
  Message,
  ADD_MACHICNE_PRICE,
  EDIT_MACHINE_PRICE,
} from "common/const.js";

import {
  getAllMachineProduct,
  addMachinePrice,
  updateMachinePrice,
} from "@/network/product.js";

export default {
  name: "MachinePriceWindow",
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
    JqxComboBox,
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
          init: function (component) {
            const source = {
              dataFields: [
                { name: "pm_id", type: "number" },
                { name: "pm_name", type: "string" },
                { name: "pc_name", type: "string" },
                { name: "power", type: "string" },
              ],
              url: "/productManage/getAllMachineProduct.do",
              type: "get",
              datatype: "json",
            };
            const dataAdapter = new jqx.dataAdapter(source, {
              loadServerData(serverdata, source, callback) {
                getAllMachineProduct(source, serverdata).then((res) => {
                  callback({
                    originaldata: res,
                    records: res,
                  });
                });
              },
              loadComplete(records) {
                records.records.forEach(function (element) {
                  element["html"] =
                    "<div tabIndex=0 style='padding: 1px;'><div>" +
                    element["pm_name"] +
                    "</div><div>" +
                    element["power"] +
                    "</div></div>";
                  element["group"] = element["pc_name"];
                });
              },
            });

            that.machineInstance = jqwidgets.createInstance(
              component,
              "jqxComboBox",
              {
                width: 250,
                height: 30,
                source: dataAdapter,
                displayMember: "pm_name",
                valueMember: "pm_id",
              }
            );
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
            const pricePlan = that.$store.state.pricePlan;
            that.pricePlanInstance = jqwidgets.createInstance(
              component,
              "jqxComboBox",
              {
                width: 250,
                height: 30,
                source: pricePlan,
                displayMember: "rule",
                valueMember: "id",
              }
            );
          },
        },
        {
          name: "priceNonCcc",
          type: "custom",
          label: "非3C价格",
          labelWidth: "80px",
          rowHeight: "40px",
          required: false,
          init: function (component) {
            that.priceNonCccInstance = jqwidgets.createInstance(
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
          name: "priceCcc",
          type: "custom",
          label: "3C价格",
          labelWidth: "80px",
          rowHeight: "40px",
          required: false,
          init: function (component) {
            that.priceCccInstance = jqwidgets.createInstance(
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
          columns: [
            {
              name: "submitButton",
              type: "custom",
              rowHeight: "40px",
              align: "right",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component, "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "提交",
                });
              },
            },
            {
              name: "cancelButton",
              type: "custom",
              rowHeight: "40px",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component, "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "取消",
                });
              },
            },
          ],
        },
        {
          name: "id",
          type: "custom",
          init: (component) => {
            component.append('<input id="priceId" type="hidden"/>');
          },
        },
      ],
    };
  },
  mounted() {
    const that = this;
    const $machine = this.$refs.myForm.getComponentByName("machine");
    const $pricePlan = this.$refs.myForm.getComponentByName("pricePlan");
    this.$refs.myValidator.rules = [
      {
        input: $machine,
        message: "该项必选",
        action: "select",
        rule: function (input) {
          const index = that.machineInstance.getSelectedIndex();
          return index > -1;
        },
      },
      {
        input: $pricePlan,
        message: "该项必选",
        action: "select",
        rule(input) {
          const index = that.pricePlanInstance.getSelectedIndex();
          return index > -1;
        },
      },
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
      if (params[0] == EDIT_MACHINE_PRICE) {
        const data = params[1];
        const $id = this.$refs.myForm.getComponentByName("id");

        // 设置产品
        this.machineInstance.selectItem(data.pm_id);
        // 设置价格方案
        this.pricePlanInstance.selectItem(data.ps_id);
        // 设置非3C价格
        this.priceNonCccInstance.val(data.price_non_ccc);
        // 设置3C价格
        this.priceCccInstance.val(data.price_ccc);
        // 设置id
        $id[0].children[0].value = data.price_id;
      }
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title;
      const $machine = this.$refs.myForm.getComponentByName("machine");
      const $pricePlan = this.$refs.myForm.getComponentByName("pricePlan");
      const $priceCcc = this.$refs.myForm.getComponentByName("priceCcc");
      const $priceNonCcc = this.$refs.myForm.getComponentByName("priceNonCcc");
      const $id = this.$refs.myForm.getComponentByName("id");

      this.formValue = {
        pmId: this.machineInstance.val(),
        psId: this.pricePlanInstance.val(),
        priceNonCcc: this.priceNonCccInstance.val(),
        priceCcc: this.priceCccInstance.val(),
        priceId: $id[0].children[0].value,
      };
      if (title == EDIT_MACHINE_PRICE) {
        this.update();
      } else {
        this.add();
      }
    },
    clearForm() {
      const $machine = this.$refs.myForm.getComponentByName("machine");
      const $pricePlan = this.$refs.myForm.getComponentByName("pricePlan");
      const $priceCcc = this.$refs.myForm.getComponentByName("priceCcc");
      const $priceNonCcc = this.$refs.myForm.getComponentByName("priceNonCcc");
      const $id = this.$refs.myForm.getComponentByName("id");

      // 重置部件设置
      this.machineInstance.clearSelection();
      this.pricePlanInstance.clearSelection();
      this.priceNonCccInstance.val(0);
      this.priceCccInstance.val(0);
      $id[0].children[0].value = "";
    },
    add() {
      const params = {
        jsonParams: JSON.stringify(this.formValue),
      };
      addMachinePrice(params).then((res) => {
        this.$refs.myWindow.close();
        // 提醒父组件刷新网格
        this.$parent.refresh();
        this.clearForm();
      });
    },
    update() {
      const params = {
        jsonParams: JSON.stringify(this.formValue),
      };
      updateMachinePrice(params).then((res) => {
        this.$refs.myWindow.close();
        this.$message.success(Message.UPDATE_SUCCESS);
        // 提醒父组件刷新网格
        this.$parent.refresh();
        this.clearForm();
      });
    },
  },
};
</script>

<style>
</style>