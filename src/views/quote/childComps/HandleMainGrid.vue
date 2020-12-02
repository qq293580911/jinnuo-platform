<template>
  <div class="mainGrid">
    <JqxGrid
      ref="myGrid"
      :width="'100%'"
      :height="'100%'"
      :localization="localization"
      :source="dataAdapter"
      :columns="columns"
      :editable="true"
      :editmode="'dblclick'"
      :columnsresize="true"
      :columnsautoresize="true"
      :selectionmode="'multiplerowsextended'"
      :showtoolbar="true"
      :rendertoolbar="rendertoolbar"
      :showstatusbar="true"
      :statusbarheight="35"
      :showaggregates="true"
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import { getLocalization } from "@/common/localization.js";
import { dataExport } from "@/common/util.js";
import { filterData } from "@/network/quote.js";
export default {
  components: {
    JqxGrid,
  },
  beforeCreate: function () {
    this.source = {
      datafields: [
        { name: "serialNumber", type: "number" },
        { name: "productName", type: "string" },
        { name: "specModel", type: "string" },
        { name: "unit", type: "string" },
        { name: "quantity", type: "number" },
        { name: "unitPrice", type: "number" },
        { name: "totalPrice", type: "number" },
        { name: "remark", type: "string" },
        { name: "selection", type: "string" },
        { name: "transfer", type: "string" },
        { name: "formula", type: "string" },
        { name: "designateType", type: "string" },
        { name: "isCcc", type: "boolean" },
        { name: "processStatus", type: "string" },
        { name: "actuatorCount", map: "filter>actuatorCount", type: "number" },
        { name: "specErrorDesc", type: "array" },
      ],
      localdata: [],
    };
  },
  data() {
    const that = this;
    return {
      firstHandle: true,
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        beforeLoadComplete: function (records) {
          records.forEach((item, index) => {
            const processStatus = item["processStatus"];
            const unitPrice = item["unitPrice"];
            // 处理状态
            if (processStatus === "NON_FORMULA") {
              if (item["specModel"] == "") {
                item["unitPrice"] = "";
              } else {
                item["unitPrice"] = "无公式产品";
              }
            }
            if (processStatus === "SELECTION_PRODUCT") {
              item["unitPrice"] = "需选型产品";
            }
            if (processStatus === "SPEC_NOT_STANDARD") {
              item["unitPrice"] = "规格参数不规范";
            }
            // 单价
            if (/^\d+$/.test(unitPrice)) {
              item["unitPrice"] = unitPrice;
            }
            // 执行器个数
            const actuatorCount = item["actuatorCount"];
            if (actuatorCount) {
              item["selection"] = actuatorCount;
            }
            // 合计
            const total = item["quantity"] * item["unitPrice"];
            if (isNaN(total) || total === 0) {
              item["totalPrice"] = "";
            } else {
              item["totalPrice"] = total;
            }
          });
        },
      }),
      columns: [
        {
          text: "序号",
          datafield: "serialNumber",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          width: 45,
        },
        {
          text: "名称",
          datafield: "productName",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          width: 200,
        },
        {
          text: "规格及型号",
          datafield: "specModel",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          width: 450,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            let cellElement = `<div style='margin: 8px;' class='jqx-center-align'>${rowdata["specModel"]}</div>`;
            if (rowdata["specErrorDesc"]) {
              cellElement += `<div style='display: none'>${rowdata["specErrorDesc"]} </div>`;
            }
            return cellElement;
          },
          cellclassname: function (row, columnfield, value) {
            const rowdata = that.$refs.myGrid.getrowdata(row);
            if (rowdata["specErrorDesc"]) {
              return "yellow";
            }
          },
        },
        {
          text: "单位",
          datafield: "unit",
          columntype: "dropdownlist",
          align: "center",
          cellsalign: "center",
          width: 45,
          cellclassname: function (row, columnfield, value) {
            const rowdata = that.$refs.myGrid.getrowdata(row);
            const specModel = rowdata["specModel"];
            if (specModel != null && specModel != "") {
              if (
                /^[台,个]$/.test(value) == false &&
                value != null &&
                value != ""
              ) {
                return "yellow";
              }
            }
          },
          createeditor: function (row, cellvalue, editor) {
            editor.jqxDropDownList({ source: ["台", "个"] });
          },
        },
        {
          text: "数量",
          datafield: "quantity",
          columntype: "numberinput",
          align: "center",
          cellsalign: "center",
          width: 45,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            if (rowdata.quantity == "error") {
              return `<div style='margin: 6px;color: #ff0000;' class='jqx-center-align'>
                ${rowdata["quantity"]}
                </div>`;
            }
          },
          validation: function (cell, value) {
            if (value < 0 || value > 1500) {
              return { result: false, message: "数量只能在0-1500之间" };
            }
            return true;
          },
          createeditor: function (row, cellvalue, editor) {
            editor.jqxNumberInput({ decimalDigits: 0, digits: 3 });
          },
          cellclassname: function (row, columnfield, value) {
            if (/^[1-9]+\d*$/.test(value) == false) {
              return "yellow";
            }
          },
        },
        {
          text: "单价",
          datafield: "unitPrice",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          width: 100,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            const unitPrice = rowdata["unitPrice"];
            if (unitPrice == "" || unitPrice == null) {
              return `<div style='margin: 6px;' class='jqx-center-align'></div>`;
            }
            if (unitPrice == "需选型产品") {
              return `<div style='margin: 6px;color: #008800;cursor: pointer;' class='jqx-center-align'>
                ${unitPrice}
                </div>`;
            }
            if (unitPrice == "无公式产品") {
              return `<div style='margin: 6px;color: #F37223;' class='jqx-center-align'>
                ${unitPrice}
                </div>`;
            }
            if (rowdata.unitPrice == "规格参数不规范") {
              return `<div style='margin: 6px;color: #f30507;' class='jqx-center-align'>
               ${unitPrice}
                </div>`;
            }
            return `<div style='margin: 6px;' class='jqx-center-align'>
              ${this.dataAdapter.formatNumber(rowdata.unitPrice, "d0")}
              </div>`;
          },
        },
        {
          text: "总价",
          datafield: "totalPrice",
          cellbeginedit: true,
          align: "center",
          aggregates: ["sum"],
          cellsalign: "center",
          width: 100,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            const unitPrice = rowdata["unitPrice"];
            const quantity = rowdata["quantity"];
            if (unitPrice == "" || isNaN(unitPrice)) {
              return defaultvalue;
            } else {
              let total = unitPrice * quantity;
              return `<div style='margin: 6px;' class='jqx-center-align'>
                ${dataAdapter.formatNumber(total, "d0")}</div>`;
            }
          },
          aggregatesrenderer: that.aggregatesrenderer,
        },
        {
          text: "备注",
          datafield: "remark",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          width: 185,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            if (rowdata["processStatus"] == "SELECTION_PRODUCT") {
              return `<div style='margin: 6px;' class='jqx-center-align'>${value} </div>`;
            }
            return `<div style='margin: 6px;' class='jqx-center-align'> ${value} </div>`;
          },
        },
        {
          text: "选型/执行器",
          datafield: "selection",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "加点",
          datafield: "transfer",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          hidden: true,
          width: 100,
        },
        {
          text: "公式",
          datafield: "formula",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          hidden: true,
          width: 300,
        },
        {
          text: "指派类型",
          datafield: "designateType",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          hidden: true,
          width: 200,
        },
      ],
    };
  },
  mounted() {
    const that = this;
    // 接收到导入的请求，获取文本内容并筛选渲染
    this.$bus.$on("import", () => {
      let content = this.$store.state.currentQuote.content;
      this.$store.dispatch("filterQuoteContent", content).then((response) => {
        const params = {
          jsonParams: JSON.stringify({
            content: response,
          }),
        };
        filterData(params).then((res) => {
          this.$store.dispatch("saveCurrentQuoteContent", res["content"]);
          this.source.localdata = res["content"];
          this.$refs.myGrid.updatebounddata();
        });
      });
    });
    // 接收到处理的请求，对阀门风口进行匹配价格
    this.$bus.$on("handler", () => {
      const gridContent = this.$refs.myGrid.getrows();
      if (gridContent.length < 1) {
        this.$message.warning("未发现待操作的数据");
        return false;
      }
      let content = this.$store.state.currentQuote.content;
    });
    // 接收到导出的请求，导出到excel
    this.$bus.$on("export", () => {
      const name = `done_${this.$store.state.currentQuote.name}`;
      const columns = this.$refs.myGrid.columns;
      const content = this.$store.state.currentQuote.content;
      // dataExport(quoteName, columns, content);
      this.$confirm({
        title: `要记录到今日报价吗？`,
        okText: "确认",
        cancelText: "取消",
        centered: true,
        content: (h) => <div style="color:red;"></div>,
        onOk() {
          const payload = {
            name,
            content,
          };
          that.$store.dispatch("saveTodayQuote", payload);
          that.$bus.$emit('refreshTodayQuote')
        },
        onCancel() {},
        class: "test",
      });
    });
  },
  methods: {
    rendertoolbar(toolbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      toolbar[0].appendChild(buttonsContainer);
      // 显示更多
      let showMoreContainer = document.createElement("div");
      showMoreContainer.id = "showMore";
      showMoreContainer.style.cssText = "float: right;cursor: pointer;";
      buttonsContainer.appendChild(showMoreContainer);
      //创建按钮
      let showMoreButton = jqwidgets.createInstance("#showMore", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/show-more.svg`),
      });
      jqwidgets.createInstance("#showMore", "jqxTooltip", {
        content: "显示更多",
        position: "mouse",
      });
    },
    aggregatesrenderer(aggregates, column, element) {
      var renderString = "";
      $.each(aggregates, function (key, value) {
        renderString += `<div style="position: relative; margin-top:8px; text-align: center; overflow: hidden;">合计: 
          ${value}</div>`;
      });
      return renderString;
    },
  },
};
</script>

<style scoped>
.mainGrid {
  height: calc(100vh - 200px);
  /* overflow: hidden; */
}
</style>