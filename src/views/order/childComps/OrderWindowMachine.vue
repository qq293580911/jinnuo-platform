<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'750px'"
      :height="'550px'"
      :autoOpen="false"
      :position="{ x: '30%', y: '20%' }"
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

import { EDIT_ORDER } from "@/common/const";
import {
  calc_misc_log_manage_fee,
  calc_misc_freight,
  calc_misc_tax,
  calc_misc_warranty,
  calc_rsv_p,
} from "@/common/util";
import { addOrder, updateOrder } from "@/network/order";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
  },
  created() {
    this.salesmans = this.$store.state.salesmans;
  },
  data() {
    const that = this;
    return {
      template: [
        {
          columns: [
            {
              name: "orderDate",
              type: "date",
              label: "下单日期",
              labelWidth: "150px",
              width: "250px",
              required: true,
              rowHeight: "40px",
              columnWidth: "50%",
              formatString: "yyyy-MM-dd",
            },
            {
              name: "salesman",
              type: "custom",
              label: "业务员",
              labelWidth: "150px",
              required: true,
              rowHeight: "40px",
              columnWidth: "50%",
              init: (component) => {
                jqwidgets.createInstance(component, "jqxComboBox", {
                  source: this.salesmans,
                  width: 250,
                  height: 30,
                  animationType: "slide",
                  displayMember: "emp_name",
                  valueMember: "emp_id",
                });
              },
            },
          ],
        },
        {
          columns: [
            {
              name: "contractNumber",
              type: "text",
              label: "合同编号",
              labelWidth: "150px",
              width: "250px",
              required: true,
              rowHeight: "40px",
              columnWidth: "50%",
            },
            {
              name: "orderNumber",
              type: "text",
              label: "下单编号",
              labelWidth: "150px",
              width: "250px",
              required: true,
              rowHeight: "40px",
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "projectName",
              type: "text",
              label: "项目名称",
              labelWidth: "150px",
              width: "250px",
              required: true,
              rowHeight: "40px",
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "orderAmount",
              type: "custom",
              label: "下单金额",
              labelWidth: "150px",
              required: true,
              rowHeight: "40px",
              columnWidth: "50%",
              init: function (component) {
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
              name: "reservePrice",
              type: "custom",
              label: "底价",
              labelWidth: "150px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
              init: function (component) {
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
          ],
        },
        {
          columns: [
            {
              name: "logisticsManagementFee",
              type: "text",
              label: "物流管理费",
              labelWidth: "150px",
              width: "250px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
            },
            {
              name: "freight",
              type: "text",
              label: "运费",
              labelWidth: "150px",
              width: "250px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "tax",
              type: "text",
              label: "税金",
              labelWidth: "150px",
              width: "250px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
            },
            {
              name: "warranty",
              type: "text",
              label: "质保金",
              labelWidth: "150px",
              width: "250px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "installFee",
              type: "custom",
              label: "安装费",
              labelWidth: "150px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component, "jqxNumberInput", {
                  width: 250,
                  height: 30,
                  inputMode: "simple",
                  digits: 11,
                  spinButtons: true,
                  decimalDigits: 0,
                  disabled: false,
                });
              },
            },
          ],
        },
        {
          columns: [
            {
              name: "orderReservePrice",
              type: "custom",
              label: "下单底价",
              labelWidth: "150px",
              required: true,
              rowHeight: "40px",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component, "jqxNumberInput", {
                  width: 250,
                  height: 30,
                  inputMode: "simple",
                  digits: 11,
                  spinButtons: true,
                  decimalDigits: 0,
                  disabled: true,
                });
              },
            },
            {
              name: "actualFreight",
              type: "custom",
              label: "实际运费",
              labelWidth: "150px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component, "jqxNumberInput", {
                  width: 250,
                  height: 30,
                  inputMode: "simple",
                  digits: 11,
                  spinButtons: true,
                  decimalDigits: 0,
                  disabled: true,
                });
              },
            },
          ],
        },
        {
          columns: [
            {
              name: "considerationCommissionOrderAmount",
              type: "custom",
              label: "计提成金额",
              labelWidth: "150px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
              init: function (component) {
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
              name: "considerationCommissionStatus",
              type: "dropdownlist",
              label: "计提成状态",
              labelWidth: "150px",
              width: "250px",
              rowHeight: "40px",
              columnWidth: "50%",
              options: [{ label: "进行中" }, { label: "已终止" }],
            },
          ],
        },
        {
          columns: [
            {
              name: "notConsiderationCommissionOrderAmount",
              type: "custom",
              label: "非3C风阀",
              labelWidth: "150px",
              required: false,
              rowHeight: "40px",
              columnWidth: "50%",
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
          ],
        },
        {
          columns: [
            {
              name: "remark",
              type: "text",
              label: "备注",
              labelWidth: "150px",
              width: "250px",
              height: "30px",
              required: false,
              columnWidth: "50%",
              rowHeight: "40px",
            },
          ],
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
        }
      ],
      id:null
    };
  },
  mounted() {
    let $orderDate = this.$refs.myForm.getComponentByName("orderDate");
    let $salesman = this.$refs.myForm.getComponentByName("salesman");
    let $contractNumber = this.$refs.myForm.getComponentByName(
      "contractNumber"
    );
    let $orderNumber = this.$refs.myForm.getComponentByName("orderNumber");
    let $projectName = this.$refs.myForm.getComponentByName("projectName");
    let $reservePrice = this.$refs.myForm.getComponentByName("reservePrice");
    let $logManageFee = this.$refs.myForm.getComponentByName(
      "logisticsManagementFee"
    );
    let $freight = this.$refs.myForm.getComponentByName("freight");
    let $tax = this.$refs.myForm.getComponentByName("tax");
    let $warranty = this.$refs.myForm.getComponentByName("warranty");
    let $installFee = this.$refs.myForm.getComponentByName("installFee");
    let $orderAmount = this.$refs.myForm.getComponentByName("orderAmount");
    let $orderReservePrice = this.$refs.myForm.getComponentByName(
      "orderReservePrice"
    );
    let $considerationCommissionOrderAmount = this.$refs.myForm.getComponentByName(
      "considerationCommissionOrderAmount"
    );
    let $considerationCommissionStatus = this.$refs.myForm.getComponentByName(
      "considerationCommissionStatus"
    );
    let $notConsiderationCommissionOrderAmount = this.$refs.myForm.getComponentByName(
      "notConsiderationCommissionOrderAmount"
    );
    let $actualFreight = this.$refs.myForm.getComponentByName(
      "notConsiderationCommissionOrderAmount"
    );
    let $remark = this.$refs.myForm.getComponentByName("remark");

    this.orderDateInstance = $orderDate;
    this.salesmanInstance = $salesman;
    this.contractNumberInstance = $contractNumber;
    this.orderNumberInstance = $orderNumber;
    this.projectNameInstance = $projectName;
    this.reservePriceInstance = $reservePrice;
    this.logManageFeeInstance = $logManageFee;
    this.freightInstance = $freight;
    this.taxInstance = $tax;
    this.warrantyInstance = $warranty;
    this.installFeeInstance = $installFee;
    this.orderAmountInstance = $orderAmount;
    this.orderReservePriceInstance = $orderReservePrice;
    this.considerationCommissionOrderAmountInstance = $considerationCommissionOrderAmount;
    this.considerationCommissionStatusInstance = $considerationCommissionStatus;
    this.notConsiderationCommissionOrderAmountInstance = $notConsiderationCommissionOrderAmount;
    this.actualFreightInstance = $actualFreight;
    this.remarkInstance = $remark;
    // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: $projectName,
        message: "不能为空!",
        action: "keyup, blur",
        rule: "required",
      },
      {
        input: $contractNumber,
        message: "不能为空!",
        action: "keyup, blur",
        rule: "required",
      },
      {
        input: $orderNumber,
        message: "不能为空!",
        action: "keyup, blur",
        rule: "required",
      },
      {
        input: $logManageFee,
        message: "不正确的格式",
        action: "keyup, blur",
        rule: function (input) {
          let value = $(input).val();
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
          let value = $(input).val();
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
          let value = $(input).val();
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
      {
        input: $salesman,
        action: "change",
        message: "该项必选!",
        rule: function () {
          const index = $salesman.jqxComboBox("getSelectedIndex");
          return index > -1;
        },
      },
    ];
    $orderAmount
      .add($logManageFee)
      .add($freight)
      .add($tax)
      .add($warranty)
      .add($installFee)
      .on("change", function () {
        const orderAmount = $orderAmount.val();
        const logManageFee = $logManageFee.val();
        const freight = $freight.val();
        const tax = $tax.val();
        const warranty = $warranty.val();
        const installFee = $installFee.val();

        let ordManageFee = calc_misc_log_manage_fee(
          orderAmount,
          installFee,
          logManageFee
        );

        let ordTax = calc_misc_tax(orderAmount, installFee, tax);
        let ordWarranty = calc_misc_warranty(orderAmount, installFee, warranty);
        let ordFreight = calc_misc_freight(
          orderAmount,
          installFee,
          ordManageFee,
          ordTax,
          ordWarranty,
          freight
        );
        let ordRsvP = calc_rsv_p(
          orderAmount,
          ordManageFee,
          ordFreight,
          ordTax,
          ordWarranty,
          installFee
        );
        $orderReservePrice.val(ordRsvP);
      });
    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName("submitButton");
    confirmBtn[0].addEventListener("click", (event) => {
      this.$refs.myValidator.validate(document.getElementById("myForm"));
    });
  },
  methods: {
    onValidationSuccess(event) {
      const formData = {};
      formData["orderDate"] = this.orderDateInstance.val();
      formData["salesman"] = this.salesmanInstance.val();
      formData["contractNumber"] = this.contractNumberInstance.val();
      formData["orderNumber"] = this.orderNumberInstance.val();
      formData["projectName"] = this.projectNameInstance.val();
      formData["reservePrice"] = this.reservePriceInstance.val();
      formData["logisticsManagementFee"] = this.logManageFeeInstance.val();
      formData["freight"] = this.freightInstance.val();
      formData["tax"] = this.taxInstance.val();
      formData["warranty"] = this.warrantyInstance.val();
      formData["orderAmount"] = this.orderAmountInstance.val();
      formData["orderReservePrice"] = this.orderReservePriceInstance.val();
      formData[
        "considerationCommissionOrderAmount"
      ] = this.considerationCommissionOrderAmountInstance.val();
      formData[
        "considerationCommissionStatus"
      ] = this.considerationCommissionStatusInstance.val();
      formData[
        "notConsiderationCommissionOrderAmount"
      ] = this.notConsiderationCommissionOrderAmountInstance.val();
      formData["actualFreight"] = this.actualFreightInstance.val();
      formData["remark"] = this.remarkInstance.val();
      formData["id"] = this.id;
      const title = this.$refs.myWindow.title;
      if (title == EDIT_ORDER) {
        this.update(formData);
      } else {
        this.add(formData);
      }
    },
    clearForm() {
      // 重置部件设置
      this.orderDateInstance.val(new Date());
      this.salesmanInstance.jqxComboBox("clearSelection");
      this.contractNumberInstance.val("");
      this.orderNumberInstance.val("");
      this.projectNameInstance.val("");
      this.reservePriceInstance.jqxNumberInput("setDecimal", 0);
      this.orderAmountInstance.jqxNumberInput("setDecimal", 0);
      this.logManageFeeInstance.val("");
      this.freightInstance.val();
      this.taxInstance.val("");
      this.warrantyInstance.val("");
      this.installFeeInstance.jqxNumberInput("setDecimal", 0);
      this.orderReservePriceInstance.jqxNumberInput("setDecimal", 0);
      this.actualFreightInstance.jqxNumberInput("setDecimal", 0);
      this.considerationCommissionOrderAmount.jqxNumberInput("setDecimal", 0);
      this.considerationCommissionStatus.jqxComboBox("clearSelection");
      this.notConsiderationCommissionOrderAmount.jqxNumberInput(
        "setDecimal",
        0
      );
      this.remarkInstance.val("");
    },
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      if (params[0] == EDIT_ORDER) {
        let rowData = params[1];
        this.$nextTick(() => {
          // 下单日期
          this.orderDateInstance.val(rowData["order_date"]);
          // 业务员
          this.salesmanInstance.jqxComboBox("selectItem", rowData["salesman"]);
          // 合同编号
          this.contractNumberInstance.val(rowData["contract_number"]);
          // 下单编号
          this.orderNumberInstance.val(rowData["order_number"]);
          // 项目名称
          this.projectNameInstance.val(rowData["project_name"]);
          // 底价
          this.reservePriceInstance.jqxNumberInput(
            "setDecimal",
            rowData["reserve_price"] == null ? 0 : rowData["reserve_price"]
          );
          // 下单金额
          this.orderAmountInstance.jqxNumberInput(
            "setDecimal",
            rowData["order_amount"]
          );
          // 非3C风阀下单金额
          this.notConsiderationCommissionOrderAmountInstance.jqxNumberInput(
            "setDecimal",
            rowData["not_consideration_commission_order_amount"] == null
              ? 0
              : rowData["not_consideration_commission_order_amount"]
          );
          // 下单底价
          this.orderReservePriceInstance.jqxNumberInput(
            "setDecimal",
            rowData["order_reserve_price"]
          );
          // 物管费
          this.logManageFeeInstance.val(rowData["logistics_management_fee"]);
          // 运费
          this.freightInstance.val(rowData["freight"]);
          // 税金
          this.taxInstance.val(rowData["tax"]);
          // 质保金
          this.warrantyInstance.val(rowData["warranty"]);
          // 安装费
          this.installFeeInstance.val(rowData["install_fee"]);
          // 计提成下单金额
          this.considerationCommissionOrderAmountInstance.jqxNumberInput(
            "setDecimal",
            rowData["consideration_commission_order_amount"]
          );
          // 计提成状态
          this.considerationCommissionStatusInstance.jqxDropDownList(
            "selectItem",
            rowData["consideration_commission_status"]
          );
          // 实际运费
          this.actualFreightInstance.jqxNumberInput(
            "setDecimal",
            rowData["actual_freight"]
          );
          // 备注
          this.remarkInstance.val(rowData["remark"]);
          this.id = rowData["id"]
        });
      }
      this.$refs.myWindow.open();
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      };
      addOrder(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
        this.clearForm();
      });
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      };
      updateOrder(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
        this.clearForm();
      });
    },
  },
};
</script>

<style scoped>
</style>