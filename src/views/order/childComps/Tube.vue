<template>
  <div class="base-tab-content-element">
    <JqxGrid
      ref="myGrid"
      :width="'100%'"
      :height="'100%'"
      :localization="localization"
      :source="dataAdapter"
      :columns="columns"
      :showtoolbar="true"
      :rendertoolbar="createButtonsContainers"
      :pageable="true"
      :pagesize="20"
      :pagesizeoptions="[5, 10, 15, 20, 25, 30]"
      :sortable="true"
      :filterable="true"
      :altrows="true"
      :enabletooltip="true"
      :editable="false"
      :selectionmode="'multiplerowsextended'"
      :virtualmode="true"
      :rendergridrows="rendergridrows"
      :showstatusbar="true"
      :showaggregates="true"
      :statusbarheight="30"
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";

import { getLocalization } from "@/common/localization.js";
import { formatFilter } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { showTubeOrderList } from "@/network/order.js";
export default {
  name: "TubeOrder",
  components: {
    JqxGrid,
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      dataFields: [
        { name: "id", type: "number" },
        { name: "order_date", type: "string" },
        { name: "salesman_company", type: "string" },
        { name: "salesman_organization", type: "string" },
        { name: "salesman_agency", type: "string" },
        { name: "salesman_name", type: "string" },
        { name: "salesman", type: "number" },
        { name: "province", type: "string" },
        { name: "city", type: "string" },
        { name: "county", type: "string" },
        { name: "contract_number", type: "string" },
        { name: "contract_amount", type: "number" },
        { name: "order_number", type: "string" },
        { name: "project_name", type: "string" },
        { name: "province", type: "string" },
        { name: "city", type: "string" },
        { name: "county", type: "string" },
        { name: "final_price", type: "number" },
        { name: "order_amount", type: "number" },
        { name: "actual_freight", type: "number" },
        {
          name: "consideration_commission_status",
          type: "string",
        },
        { name: "delivery_date", type: "string" },
        { name: "delivery_amount", type: "number" },
        { name: "remark", type: "string" },
        { name: "order_area", type: "float" },
        { name: "delivery_area", type: "float" },
        { name: "creator", type: "number" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/ordDtl/showOrderDetailTubeList.do`,
    };
  },
  data() {
    return {
      //数据网格
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data;
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          showTubeOrderList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            });
          });
        },
        beforeLoadComplete(records) {
          records.forEach((item) => {
            const ordAmt = item["order_amount"];
            const dlvAmt = item["delivery_amount"];
            const unDlvAmt = ordAmt - dlvAmt;
            item["undelivered_amount"] = unDlvAmt;
          });
        },
      }),
      rendergridrows: function (obj) {
        return obj.data;
      },
      columns: [],
    };
  },
  mounted() {
    this.columns.push({
      text: "下单日期",
      datafield: "order_date",
      cellsformat: "yyyy-MM-dd",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "大区",
      datafield: "salesman_company",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "办事处",
      datafield: "salesman_agency",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "业务员",
      datafield: "salesman_name",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "省",
      datafield: "province",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "市",
      datafield: "city",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "县",
      datafield: "county",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "合同编号",
      datafield: "contract_number",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 150,
    });
    this.columns.push({
      text: "合同金额",
      datafield: "contract_amount",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "下单编号",
      datafield: "order_number",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 150,
    });
    this.columns.push({
      text: "项目名称",
      datafield: "project_name",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      width: 200,
    });
    this.columns.push({
      text: "下单金额",
      datafield: "order_amount",
      align: "center",
      cellsalign: "center",
      cellclassname: this.cellClass,
      aggregates: ["sum"],
      aggregatesrenderer: this.aggregatesRenderer,
      width: 100,
    });
    this.columns.push({
      text: "送货日期",
      datafield: "delivery_date",
      cellsAlign: "center",
      align: "center",
      cellclassname: this.cellClass,
      width: 100,
    });
    this.columns.push({
      text: "送货金额",
      datafield: "delivery_amount",
      cellsAlign: "center",
      align: "center",
      width: 100,
      cellclassname: this.cellClass,
      aggregates: ["sum"],
      aggregatesrenderer: this.aggregatesRenderer,
    });
    this.columns.push({
      text: "未送货金额",
      datafield: "undelivered_amount",
      cellsAlign: "center",
      align: "center",
      width: 100,
      cellclassname: this.cellClass,
    });
    this.columns.push({
      text: "下单面积",
      datafield: "order_area",
      cellsAlign: "center",
      align: "center",
      width: 100,
      cellclassname: this.cellClass,
      aggregates: ["sum"],
      aggregatesrenderer: this.aggregatesRenderer,
    });
    this.columns.push({
      text: "送货面积",
      datafield: "delivery_area",
      cellsAlign: "center",
      align: "center",
      width: 100,
      cellclassname: this.cellClass,
      aggregates: ["sum"],
      aggregatesrenderer: this.aggregatesRenderer,
    });
    this.columns.push({
      text: "实际运费",
      datafield: "actual_freight",
      cellsAlign: "center",
      align: "center",
      width: 100,
      cellclassname: this.cellClass,
    });
    this.columns.push({
      text: "计提成状态",
      datafield: "consideration_commission_status",
      cellsAlign: "center",
      align: "center",
      width: 100,
      cellclassname: this.cellClass,
    });
    this.columns.push({
      text: "备注",
      datafield: "remark",
      cellsAlign: "center",
      align: "center",
      width: 100,
      cellclassname: this.cellClass,
    });
  },
  methods: {
    createButtonsContainers: function (toolbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      let addButtonContainer = document.createElement("div");
      let deleteButtonContainer = document.createElement("div");
      let editButtonContainer = document.createElement("div");
      let importButtonContainer = document.createElement("div");
      let exportButtonContainer = document.createElement("div");
      let reloadButtonContainer = document.createElement("div");
      addButtonContainer.id = "addButton";
      deleteButtonContainer.id = "deleteButton";
      editButtonContainer.id = "editButton";
      importButtonContainer.id = "importButton";
      exportButtonContainer.id = "exportButton";
      reloadButtonContainer.id = "reloadButton";
      addButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      deleteButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      editButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      importButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      exportButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      reloadButtonContainer.style.cssText =
        "float:right;margin-left: 5px;  cursor: pointer;";
      buttonsContainer.appendChild(addButtonContainer);
      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(editButtonContainer);
      buttonsContainer.appendChild(importButtonContainer);
      buttonsContainer.appendChild(exportButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      toolbar[0].appendChild(buttonsContainer);
      //创建按钮
      let addButton = jqwidgets.createInstance("#addButton", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
      });
      jqwidgets.createInstance("#addButton", "jqxTooltip", {
        content: "添加",
        position: "bottom",
      });

      let deleteButton = jqwidgets.createInstance(
        "#deleteButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
        }
      );
      jqwidgets.createInstance("#deleteButton", "jqxTooltip", {
        content: "删除",
        position: "bottom",
      });

      let editButton = jqwidgets.createInstance("#editButton", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
      });
      jqwidgets.createInstance("#editButton", "jqxTooltip", {
        content: "编辑",
        position: "bottom",
      });

      let importButton = jqwidgets.createInstance(
        "#importButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/import.svg`),
        }
      );
      jqwidgets.createInstance("#importButton", "jqxTooltip", {
        content: "导入",
        position: "bottom",
      });

      let exportButton = jqwidgets.createInstance(
        "#exportButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/export.svg`),
        }
      );
      jqwidgets.createInstance("#exportButton", "jqxTooltip", {
        content: "导出",
        position: "bottom",
      });

      let reloadButton = jqwidgets.createInstance(
        "#reloadButton",
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      jqwidgets.createInstance("#reloadButton", "jqxTooltip", {
        content: "刷新",
        position: "bottom",
      });

      //绑定事件

      deleteButton.addEventHandler("click", (event) => {
        let selectedrowindex = this.$refs.myGrid.getselectedrowindex();
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        let id = this.$refs.myGrid.getrowid(selectedrowindex);
        this.$refs.myGrid.deleterow(id);
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    cellClass(row, columnfield, value) {
      let deliveryDate = this.$refs.myGrid.getcellvalue(row, "delivery_date");
      let orderAmount = this.$refs.myGrid.getcellvalue(row, "order_amount");
      let deliveryAmount = this.$refs.myGrid.getcellvalue(
        row,
        "delivery_amount"
      );

      if (orderAmount == deliveryAmount) {
        if (
          new Date(deliveryDate) < new Date("2018-10-01") ||
          deliveryDate == null ||
          deliveryDate == ""
        ) {
          return "dateDelivered";
        }
        if (deliveryDate != null && deliveryDate != "") {
          return "delivered";
        }
      }
    },
    aggregatesRenderer(aggregates, column, element) {
      var renderString = "";
      $.each(aggregates, function (key, value) {
        switch (key) {
          case "sum":
            renderString +=
              '<div style="position: relative; line-height: 30px; text-align: center; overflow: hidden;">' +
              "合计" +
              ": " +
              value +
              "</div>";
            break;
        }
      });
      return renderString;
    },
  },
};
</script>

<style scoped>
.yellow {
  color: black \9;
  background-color: yellow \9;
}

.yellow:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected),
.jqx-widget .yellow:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected) {
  color: black;
  background-color: yellow;
}

.delivered {
  color: black \9;
  background-color: #93d150 \9;
}

.delivered:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected),
.jqx-widget .green:not(.jqx-grid-cell-hover):not(.jqx-grid-cell-selected) {
  color: black;
  background-color: #93d150;
}
</style>