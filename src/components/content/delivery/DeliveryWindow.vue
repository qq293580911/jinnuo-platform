<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'440px'"
      :height="'510px'"
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

import { ADD_DELIVERY, EDIT_DELIVERY } from "@/common/const.js";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
  },
  data() {
    const that = this;
    return {
      template: [
        {
          name: "orderNumber",
          type: "text",
          label: "下单编号",
          labelWidth: "100px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          info: "输入下单编号",
          infoPosition: "right",
        },
        {
          name: "projectName",
          type: "text",
          label: "项目名称",
          labelWidth: "100px",
          width: "250px",
          required: true,
          rowHeight: "40px",
        },
        {
          name: "deliveryAmount",
          type: "custom",
          label: "送货金额",
          labelWidth: "100px",
          required: true,
          rowHeight: "40px",
          init: (component) => {
            jqwidgets.createInstance(component, "jqxNumberInput", {
              width: 250,
              height: 30,
              inputMode: "simple",
              digits: 11,
              spinButtons: true,
              decimalDigits: 2,
            });
          },
        },
        {
          name: "deliveryDate",
          type: "date",
          label: "送货日期",
          labelWidth: "100px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          formatString: "yyyy-MM-dd",
        },
        {
          name: "logisticsManagementFee",
          type: "text",
          label: "物流管理费",
          labelWidth: "100px",
          width: "250px",
          required: false,
          rowHeight: "40px",
        },
        {
          name: "freight",
          type: "text",
          label: "运费",
          labelWidth: "100px",
          width: "250px",
          required: false,
          rowHeight: "40px",
          columnWidth: "50%",
        },
        {
          name: "tax",
          type: "text",
          label: "税金",
          labelWidth: "100px",
          width: "250px",
          required: false,
          rowHeight: "40px",
        },
        {
          name: "warranty",
          type: "text",
          label: "质保金",
          labelWidth: "100px",
          width: "250px",
          required: false,
          rowHeight: "40px",
        },
        {
          name: "installFee",
          type: "custom",
          label: "安装费",
          labelWidth: "100px",
          required: false,
          rowHeight: "40px",
          init: (component) => {
            jqwidgets.createInstance(component, "jqxNumberInput", {
              width: 250,
              height: 30,
              inputMode: "simple",
              digits: 11,
              spinButtons: true,
              decimalDigits: 0,
            });
          },
        },
        {
          name: "deliveryReservePrice",
          type: "custom",
          label: "送货底价",
          labelWidth: "100px",
          required: true,
          rowHeight: "40px",
          init: (component) => {
            jqwidgets.createInstance(component, "jqxNumberInput", {
              width: 250,
              height: 30,
              inputMode: "simple",
              digits: 11,
              spinButtons: true,
              decimalDigits: 2,
            });
          },
        },
        {
          columns: [
            {
              name: "submitButton",
              type: "button",
              text: "提交",
              width: "60px",
              rowHeight: "50px",
              columnWidth: "50%",
              align: "right",
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
          init: (component) => {
            component.append('<input type="hidden" id="dlvDtlId"/>');
          },
        },
      ],
    };
  },
  mounted() {
    this.orderNumberInstance = this.$refs.myForm.getComponentByName(
      "orderNumber"
    );
    this.orderNumberInstance.jqxInput("disabled", true);
    this.projectNameInstance = this.$refs.myForm.getComponentByName(
      "projectName"
    );
    this.projectNameInstance.jqxInput("disabled", true);
    this.orderAmountInstance = this.$refs.myForm.getComponentByName(
      "orderAmount"
    );

    this.deliveryDateInstance = this.$refs.myForm.getComponentByName(
      "deliveryDate"
    );
    const $logManageFee = this.$refs.myForm.getComponentByName(
      "logisticsManagementFee"
    );
    this.logisticsManagementFeeInstance = $logManageFee;
    const $freight = this.$refs.myForm.getComponentByName("freight");
    this.freightInstance = $freight;
    const $tax = this.$refs.myForm.getComponentByName("tax");
    this.taxInstance = $tax;
    const $warranty = this.$refs.myForm.getComponentByName("warranty");
    this.warrantyInstance = $warranty;
    this.deliveryAmountInstance = this.$refs.myForm.getComponentByName(
      "deliveryAmount"
    );
    const $installFee = this.$refs.myForm.getComponentByName("installFee");
    this.installFeeInstance = $installFee;
    this.deliveryReservePriceInstance = this.$refs.myForm.getComponentByName(
      "deliveryReservePrice"
    );

    // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: $logManageFee,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function (input) {
          const value = $(input).val();
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value);
            return r;
          }
          return true;
        },
      },
      {
        input: $freight,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function (input) {
          const value = $(input).val();
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value);
            return r;
          }
          return true;
        },
      },
      {
        input: $tax,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function (input) {
          const value = $(input).val();
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value);
            return r;
          }
          return true;
        },
      },
      {
        input: $warranty,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function (input) {
          const value = $(input).val();
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value);
            return r;
          }
          return true;
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
    onValidationSuccess(event) {},
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      if (params[0] == ADD_DELIVERY) {
        const orderInfo = params[1];
        this.$nextTick(() => {
          this.orderNumberInstance.val(orderInfo["order_number"]);
          this.projectNameInstance.val(orderInfo["project_name"]);
          this.logisticsManagementFeeInstance.val(
            orderInfo["logistics_management_fee"]
          );
          this.freightInstance.val(orderInfo["freight"]);
          this.taxInstance.val(orderInfo["tax"]);
          this.warrantyInstance.val(orderInfo["warranty"]);
          this.installFeeInstance.jqxNumberInput(
            "setDecimal",
            orderInfo["install_fee"]
          );
        });
      }
      this.$refs.myWindow.open();
    },
  },
};
</script>

<style>
</style>