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

import { ADD_DELIVERY,EDIT_DELIVERY } from "@/common/const.js"
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
          name: "orderAmount",
          type: "custom",
          label: "下单金额",
          labelWidth: "100px",
          required: true,
          rowHeight: "40px",
          init: (component) => {
            that.orderAmountInstance = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                digits: 11,
                spinButtons: true,
                decimalDigits: 0,
                disabled: true,
              }
            );
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
          name: "deliveryAmount",
          type: "custom",
          label: "送货金额",
          labelWidth: "100px",
          required: true,
          rowHeight: "40px",
          init: (component) => {
            that.deliveryAmountInstance = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                digits: 11,
                spinButtons: true,
                decimalDigits: 2,
              }
            );
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
            that.deliveryReservePriceInstance = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                digits: 11,
                spinButtons: true,
                decimalDigits: 2,
              }
            );
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
  methods: {
    onValidationSuccess(event) {},
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      this.$refs.myWindow.open();
    },
  },
};
</script>

<style>
</style>