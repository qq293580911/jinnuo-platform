<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'750px'"
      :height="'610px'"
      :autoOpen="false"
      :position="{ x: '30%', y: '20%' }"
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

import { getQuoter, getSalesman } from "@/network/employee.js";
import { getPricePlan } from "@/network/product.js";
const {
  data,
  province,
  city,
  area,
  town,
} = require("province-city-china/data");

export default {
  name: "QuotationDetailWindow",
  components: {
    JqxWindow,
    JqxForm,
  },
  data() {
    const that = this;
    return {
      formValues: {},
      template: [
        {
          type: "label",
          label: "基本信息",
        },
        {
          columns: [
            {
              name: "projectName",
              type: "text",
              label: "项目名称",
              labelWidth: "110px",
              width: "250px",
              required: true,
              columnWidth: "50%",
            },
            {
              name: "projectAddress",
              type: "text",
              label: "项目地址",
              labelWidth: "110px",
              width: "250px",
              required: true,
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "quoter",
              type: "custom",
              label: "报价人",
              labelWidth: "110px",
              required: true,
              columnWidth: "50%",
              init: function (component) {
                getQuoter().then((res) => {
                  jqwidgets.createInstance(component, "jqxComboBox", {
                    displayMember: "emp_name",
                    valueMember: "emp_id",
                    source: res,
                    width: 250,
                    height: 30,
                  });
                });
              },
            },
            {
              name: "salesman",
              type: "custom",
              label: "业务员",
              labelWidth: "110px",
              required: true,
              columnWidth: "50%",
              init: function (component) {
                getSalesman().then((res) => {
                  jqwidgets.createInstance(component, "jqxComboBox", {
                    displayMember: "emp_name",
                    valueMember: "emp_id",
                    source: res,
                    width: 250,
                    height: 30,
                  });
                });
              },
            },
          ],
        },
        {
          columns: [
            {
              name: "province",
              type: "custom",
              label: "省",
              labelWidth: "110px",
              required: true,
              columnWidth: "50%",
              init: function (component) {
                let provinceSelector = jqwidgets.createInstance(
                  component,
                  "jqxComboBox",
                  {
                    source: province,
                    width: 250,
                    height: 30,
                    displayMember: "name",
                    valueMember: "province",
                  }
                );
                // 省份绑定选择事件
                provinceSelector.addEventHandler("select", (event) => {
                  const provinceValue = event.args.item.value;
                  that.formValues.province = provinceValue;
                  const citys = city.filter((item) => {
                    return item.province == provinceValue;
                  });
                  // 当选择省份的时候，更新城市的数据
                  const $city = that.$refs.myForm.getComponentByName("city");
                  jqwidgets.createInstance($city, "jqxComboBox", {
                    source: citys,
                  });
                  // 重置县镇为空
                  const $county = that.$refs.myForm.getComponentByName(
                    "county"
                  );
                  jqwidgets.createInstance($county, "jqxComboBox", {
                    source: [],
                  });
                });
              },
            },
            {
              name: "customerName",
              type: "text",
              label: "客户名称",
              labelWidth: "110px",
              width: "250px",
              required: false,
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "city",
              type: "custom",
              label: "市",
              labelWidth: "110px",
              required: true,
              columnWidth: "50%",
              init: function (component) {
                let citySelector = jqwidgets.createInstance(
                  component,
                  "jqxComboBox",
                  {
                    source: [],
                    width: 250,
                    height: 30,
                    displayMember: "name",
                    valueMember: "city",
                  }
                );

                citySelector.addEventHandler("select", (event) => {
                  const provinceValue = that.formValues.province;
                  const cityValue = event.args.item.value;
                  that.formValues.city = cityValue;

                  // 更新县镇的数据
                  const counties = area.filter((item) => {
                    return (
                      item.province == provinceValue && item.city == cityValue
                    );
                  });
                  const $county = that.$refs.myForm.getComponentByName(
                    "county"
                  );
                  jqwidgets.createInstance($county, "jqxComBoBox", {
                    source: counties,
                  });
                });
              },
            },
            {
              name: "customerPhone",
              type: "text",
              label: "客户电话",
              labelWidth: "110px",
              width: "250px",
              required: false,
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "county",
              type: "custom",
              label: "县",
              labelWidth: "110px",
              required: false,
              columnWidth: "50%",
              init: function (component) {
                const countySelector = jqwidgets.createInstance(
                  component,
                  "jqxComboBox",
                  {
                    width: 250,
                    height: 30,
                    source: [],
                  }
                );
                countySelector.addEventHandler("select", (event) => {
                  const county = event.args.item.value;
                  that.formValues.county = county;
                });
              },
            },
            {
              name: "customerCompany",
              type: "text",
              label: "客户公司",
              labelWidth: "110px",
              width: "250px",
              required: false,
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "priceModel",
              type: "custom",
              label: "价格体系",
              labelWidth: "110px",
              required: true,
              columnWidth: "50%",
              init: function (component) {
                let priceModelSelector = null;
                getPricePlan().then((res) => {
                  priceModelSelector = jqwidgets.createInstance(
                    component,
                    "jqxComboBox",
                    {
                      source: res,
                      displayMember: "rule",
                      valueMember: "id",
                      width: 250,
                      height: 30,
                    }
                  );
                  priceModelSelector.addEventHandler("select", (event) => {

                  });
                });
              },
            },
            {
              name: "isRepeat",
              type: "custom",
              label: "是否重复",
              labelWidth: "110px",
              required: true,
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component, "jqxDropDownList", {
                  width: 250,
                  height: 30,
                  source: ["常规", "重复"],
                });
              },
            },
          ],
        },
        {
          columns: [
            {
              name: "regionTax",
              type: "text",
              label: "地区点",
              labelWidth: "110px",
              width: "250px",
              required: false,
              columnWidth: "50%",
            },
            {
              name: "brokerage",
              type: "text",
              label: "佣金",
              labelWidth: "110px",
              width: "250px",
              required: false,
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "freight",
              type: "text",
              label: "运费",
              labelWidth: "110px",
              width: "250px",
              required: false,
              columnWidth: "50%",
            },
            {
              name: "tax",
              type: "text",
              label: "税金",
              labelWidth: "110px",
              width: "250px",
              required: false,
              columnWidth: "50%",
            },
          ],
        },
        {
          columns: [
            {
              name: "reservePrice",
              type: "custom",
              label: "底价",
              labelWidth: "110px",
              required: false,
              columnWidth: "50%",
              init: function (component) {
                let numberInput = jqwidgets.createInstance(
                  component,
                  "jqxNumberInput",
                  {
                    width: 250,
                    height: 30,
                    inputMode: "simple",
                    digits: 11,
                    spinButtons: true,
                    decimalDigits: 0,
                  }
                );
              },
            },
            {
              name: "quotePrice",
              type: "custom",
              label: "报价",
              labelWidth: "110px",
              required: false,
              columnWidth: "50%",
              init: function (component) {
                let numberInput = jqwidgets.createInstance(
                  component,
                  "jqxNumberInput",
                  {
                    width: 250,
                    height: 30,
                    inputMode: "simple",
                    digits: 11,
                    spinButtons: true,
                    decimalDigits: 0,
                  }
                );
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
              labelWidth: "110px",
              width: "250px",
              required: false,
              columnWidth: "50%",
            },
            {
              name: "quoteDate",
              type: "custom",
              label: "报价日期",
              labelWidth: "110px",
              required: false,
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component, "jqxDateTimeInput", {
                  width: 250,
                  height: 30,
                  formatString: "yyyy-MM-dd",
                });
              },
            },
          ],
        },
        {
          type: "blank",
          height: "20px",
        },
        {
          type: "label",
          label: "控制箱信息",
        },
        {
          columns: [
            {
              name: "controlBoxReservePrice",
              type: "custom",
              label: "控制箱底价",
              labelWidth: "110px",
              required: false,
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
              name: "controlBoxQuotePrice",
              type: "custom",
              label: "控制箱报价",
              labelWidth: "110px",
              required: false,
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
              name: "submitButton",
              type: "custom",
              rowHeight: "50px",
              align: "right",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component[0], "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "提交",
                });
              },
            },
            {
              name: "cancelButton",
              type: "custom",
              rowHeight: "50px",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component[0], "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "取消",
                });
              },
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.$bus.$on("openDetailWindow", (val) => {
      this.$refs.myWindow.setTitle("添加报价详细");
      this.$refs.myWindow.open();
    });
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