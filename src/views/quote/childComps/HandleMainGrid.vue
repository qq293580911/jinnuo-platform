<template>
  <div class="mainGrid">
    <JqxGrid
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
export default {
  name: "MainGrid",
  components: {
    JqxGrid,
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
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source),
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
          //cellclassname: cellclass,
          // cellsrenderer: function (
          //   index,
          //   datafield,
          //   value,
          //   defaultvalue,
          //   column,
          //   rowdata
          // ) {
          //   var cellElement =
          //     "<div style='margin: 6px;' class='jqx-center-align'>" +
          //     rowdata.specModel +
          //     "</div>";
          //   if (rowdata["specErrorDesc"]) {
          //     cellElement +=
          //       "<div style='display: none'>" +
          //       rowdata["specErrorDesc"] +
          //       "</div>";
          //   }
          //   return cellElement;
          // },
        },
        {
          text: "单位",
          datafield: "unit",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          width: 45,
          //cellclassname: cellclass,
        },
        {
          text: "数量",
          datafield: "quantity",
          columntype: "numberinput",
          align: "center",
          cellsalign: "center",
          width: 45,
          // cellsrenderer: function (
          //   index,
          //   datafield,
          //   value,
          //   defaultvalue,
          //   column,
          //   rowdata
          // ) {
          //   if (rowdata.quantity == "error") {
          //     return (
          //       "<div style='margin: 6px;color: #ff0000;' class='jqx-center-align'>" +
          //       rowdata.quantity +
          //       "</div>"
          //     );
          //   }
          // },
          // validation: function (cell, value) {
          //   if (value < 0 || value > 1500) {
          //     return { result: false, message: "数量只能在0-1500之间" };
          //   }
          //   return true;
          // },
          // createeditor: function (row, cellvalue, editor) {
          //   //editor.jqxNumberInput({ decimalDigits: 0, digits: 3 });
          // },
          //cellclassname: cellclass,
        },
        {
          text: "单价",
          datafield: "unitPrice",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          width: 100,
          // cellsrenderer: function (
          //   index,
          //   datafield,
          //   value,
          //   defaultvalue,
          //   column,
          //   rowdata
          // ) {
          //   if (rowdata.unitPrice == "" || rowdata.unitPrice == null) {
          //     return "<div style='margin: 6px;' class='jqx-center-align'></div>";
          //   }
          //   if (rowdata.unitPrice == "需选型产品") {
          //     return (
          //       "<div style='margin: 6px;color: #008800;cursor: pointer;' class='jqx-center-align'>" +
          //       rowdata.unitPrice +
          //       "</div>"
          //     );
          //   }
          //   if (rowdata.unitPrice == "无公式产品") {
          //     return (
          //       "<div style='margin: 6px;color: #F37223;' class='jqx-center-align'>" +
          //       rowdata.unitPrice +
          //       "</div>"
          //     );
          //   }
          //   if (rowdata.unitPrice == "规格参数不规范") {
          //     return (
          //       "<div style='margin: 6px;color: #f30507;' class='jqx-center-align'>" +
          //       rowdata.unitPrice +
          //       "</div>"
          //     );
          //   }
          //   return (
          //     "<div style='margin: 6px;' class='jqx-center-align'>" +
          //     this.dataAdapter.formatNumber(rowdata.unitPrice, "d0") +
          //     "</div>"
          //   );
          // },
        },
        {
          text: "总价",
          datafield: "totalPrice",
          cellbeginedit: true,
          align: "center",
          aggregates: ["sum"],
          cellsalign: "center",
          width: 100,
          // cellsrenderer: function (
          //   index,
          //   datafield,
          //   value,
          //   defaultvalue,
          //   column,
          //   rowdata
          // ) {
          //   if (rowdata.unitPrice == "" || isNaN(rowdata.unitPrice)) {
          //     return defaultvalue;
          //   } else {
          //     var total = rowdata.unitPrice * rowdata.quantity;
          //     return (
          //       "<div style='margin: 6px;' class='jqx-center-align'>" +
          //       dataAdapter.formatNumber(total, "d0") +
          //       "</div>"
          //     );
          //   }
          // },
          // aggregatesrenderer: function (aggregates, column, element) {
          //   var renderString = "";
          //   $.each(aggregates, function (key, value) {
          //     renderString +=
          //       '<div style="position: relative; margin-top:8px; text-align: center; overflow: hidden;">' +
          //       "合计" +
          //       ": " +
          //       value +
          //       "</div>";
          //   });
          //   return renderString;
          // },
        },
        {
          text: "备注",
          datafield: "remark",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
          width: 185,
          // cellsrenderer: function (
          //   index,
          //   datafield,
          //   value,
          //   defaultvalue,
          //   column,
          //   rowdata
          // ) {
          //   if (rowdata["processStatus"] == "SELECTION_PRODUCT") {
          //     return (
          //       "<div style='margin: 6px;' class='jqx-center-align'>" +
          //       value +
          //       "</div>"
          //     );
          //   }
          //   return (
          //     "<div style='margin: 6px;' class='jqx-center-align'>" +
          //     value +
          //     "</div>"
          //   );
          // },
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
};
</script>

<style scoped>
.jqx-grid {
  /* border-style: none; */
}
.mainGrid{
  height: calc(100vh - 200px);
  overflow: hidden;
}
</style>