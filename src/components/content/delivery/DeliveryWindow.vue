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
import {
  calc_misc_log_manage_fee,
  calc_misc_freight,
  calc_misc_tax,
  calc_misc_warranty,
  calc_rsv_p
} from "@/common/util";
import { addDelivery, updateDelivery } from "@/network/delivery";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm
  },
  props: {
    installFeeDisabled: {
      type: Boolean,
      default: false
    }
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
          rowHeight: "40px"
        },
        {
          name: "projectName",
          type: "text",
          label: "项目名称",
          labelWidth: "100px",
          width: "250px",
          required: true,
          rowHeight: "40px"
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
              decimalDigits: 2
            });
          }
        },
        {
          name: "deliveryDate",
          type: "date",
          label: "送货日期",
          labelWidth: "100px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          formatString: "yyyy-MM-dd"
        },
        {
          name: "logisticsManagementFee",
          type: "text",
          label: "物流管理费",
          labelWidth: "100px",
          width: "250px",
          required: false,
          rowHeight: "40px"
        },
        {
          name: "freight",
          type: "text",
          label: "运费",
          labelWidth: "100px",
          width: "250px",
          required: false,
          rowHeight: "40px",
          columnWidth: "50%"
        },
        {
          name: "tax",
          type: "text",
          label: "税金",
          labelWidth: "100px",
          width: "250px",
          required: false,
          rowHeight: "40px"
        },
        {
          name: "warranty",
          type: "text",
          label: "质保金",
          labelWidth: "100px",
          width: "250px",
          required: false,
          rowHeight: "40px"
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
              disabled: that.installFeeDisabled,
              allowNull: true
            });
          }
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
              decimalDigits: 2
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
              columnWidth: "50%",
              align: "right"
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
        },
        {
          name: "id",
          type: "custom",
          init: (component) => {
            component.append('<input type="hidden" id="dlvDtlId"/>');
          }
        }
      ]
    };
  },
  mounted() {
    // 下单编号
    this.orderNumberInstance = this.$refs.myForm.getComponentByName(
      "orderNumber"
    );
    this.orderNumberInstance.jqxInput("disabled", true);
    // 项目名称
    this.projectNameInstance = this.$refs.myForm.getComponentByName(
      "projectName"
    );
    this.projectNameInstance.jqxInput("disabled", true);
    // 送货日期
    this.deliveryDateInstance = this.$refs.myForm.getComponentByName(
      "deliveryDate"
    );
    // 送货金额
    const $deliveryAmount = this.$refs.myForm.getComponentByName(
      "deliveryAmount"
    );
    this.deliveryAmountInstance = $deliveryAmount;
    // 安装费
    const $installFee = this.$refs.myForm.getComponentByName("installFee");
    // 物管费
    const $logManageFee = this.$refs.myForm.getComponentByName(
      "logisticsManagementFee"
    );
    this.logisticsManagementFeeInstance = $logManageFee;
    // 运费
    const $freight = this.$refs.myForm.getComponentByName("freight");
    this.freightInstance = $freight;
    // 税金
    const $tax = this.$refs.myForm.getComponentByName("tax");
    this.taxInstance = $tax;
    // 质保金
    const $warranty = this.$refs.myForm.getComponentByName("warranty");
    this.warrantyInstance = $warranty;
    // 安装费
    this.installFeeInstance = $installFee;
    // 送货底价
    const $deliveryReservePrice = this.$refs.myForm.getComponentByName(
      "deliveryReservePrice"
    );
    this.deliveryReservePriceInstance = $deliveryReservePrice;
    // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: $logManageFee,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function(input) {
          const value = $(input).val();
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value);
            return r;
          }
          return true;
        }
      },
      {
        input: $freight,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function(input) {
          const value = $(input).val();
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value);
            return r;
          }
          return true;
        }
      },
      {
        input: $tax,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function(input) {
          const value = $(input).val();
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value);
            return r;
          }
          return true;
        }
      },
      {
        input: $warranty,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function(input) {
          const value = $(input).val();
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value);
            return r;
          }
          return true;
        }
      }
    ];
    $deliveryAmount
      .add($logManageFee)
      .add($freight)
      .add($tax)
      .add($warranty)
      .add($installFee)
      .on("change", function() {
        const deliveryAmount = $deliveryAmount.val();
        const logManageFee = $logManageFee.val();
        const freight = $freight.val();
        const tax = $tax.val();
        const warranty = $warranty.val();
        const installFee = $installFee.val();

        const dlvManageFee = calc_misc_log_manage_fee(
          deliveryAmount,
          installFee,
          logManageFee
        );
        const dlvTax = calc_misc_tax(deliveryAmount, installFee, tax);
        const dlvWarranty = calc_misc_warranty(deliveryAmount, installFee, warranty);
        const dlvFreight = calc_misc_freight(
          deliveryAmount,
          installFee,
          dlvManageFee,
          dlvTax,
          dlvWarranty,
          freight
        );

        const dlvRsvP = calc_rsv_p(
          deliveryAmount,
          dlvManageFee,
          dlvFreight,
          dlvTax,
          dlvWarranty,
          installFee
        );
        $deliveryReservePrice.jqxNumberInput("setDecimal", dlvRsvP);
      });
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
      // 添加送货
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
      // 修改送货
      if (params[0] == EDIT_DELIVERY) {
        const data = params[1];
        this.orderNumberInstance.val(data["order_number"]);
        this.projectNameInstance.val(data["project_name"]);
        this.deliveryAmountInstance.jqxNumberInput(
          "setDecimal",
          data["delivery_amount"]
        );
        this.deliveryDateInstance.jqxDateTimeInput(
          "setDate",
          new Date(data["delivery_date"])
        );
        this.logisticsManagementFeeInstance.val(
          data["logistics_management_fee"]
        );
        this.freightInstance.val(data["freight"]);
        this.taxInstance.val(data["tax"]);
        this.warrantyInstance.val(data["warranty"]);
        this.installFeeInstance.jqxNumberInput(
          "setDecimal",
          data["install_fee"]
        );
        this.deliveryReservePriceInstance.jqxNumberInput(
          "setDecimal",
          data["delivery_reserve_price"]
        );
        $("#dlvDtlId").val(data["id"]);
      }
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const formData = {};
      formData["orderNumber"] = this.orderNumberInstance.val();
      formData["deliveryAmount"] = this.deliveryAmountInstance.val();
      formData[
        "deliveryReservePrice"
      ] = this.deliveryReservePriceInstance.val();
      formData["deliveryDate"] = this.deliveryDateInstance.val();
      formData["id"] = $("#dlvDtlId").val();
      const title = this.$refs.myWindow.title;
      if (title == EDIT_DELIVERY) {
        this.update(formData);
      } else {
        this.add(formData);
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      addDelivery(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refreshChild();
      });
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      updateDelivery(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refreshChild();
      });
    },
    clearForm() {
      this.orderNumberInstance.val("");
      this.projectNameInstance.val("");
      this.deliveryAmountInstance.jqxNumberInput("setDecimal", 0);
      this.deliveryDateInstance.val(new Date());
      this.logisticsManagementFeeInstance.val("");
      this.freightInstance.val("");
      this.taxInstance.val("");
      this.warrantyInstance.val("");
      this.installFeeInstance.jqxNumberInput("setDecimal", 0);
      this.deliveryReservePriceInstance.jqxNumberInput("setDecimal", 0);
      $("#dlvDtlId").val("");
    }
  }
};
</script>

<style>
</style>
