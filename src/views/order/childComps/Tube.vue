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
    <order-window ref="orderWindow"></order-window>
    <order-import-window ref="orderImportWindow"></order-import-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";

import OrderImportWindow from "../childComps/OrderImportWindowTube";
import OrderWindow from "../childComps/OrderWindowTube";

import { getLocalization } from "@/common/localization.js";
import { formatFilter,dataExport } from "@/common/util.js";
import { Message, ADD_ORDER, EDIT_ORDER } from "@/common/const";
import { showTubeOrderList, deleteOrder } from "@/network/order.js";
export default {
  name: "TubeOrder",
  components: {
    JqxGrid,
    OrderImportWindow,
    OrderWindow,
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      dataFields: [
        { name: "id", type: "number" },
        { name: "product_type", type: "string" },
        { name: "order_date", type: "string" },
        { name: "salesman_company", type: "string" },
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
    const that = this;
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
      columns: (function () {
        let columns = [];
        columns.push({
          text: "下单日期",
          datafield: "order_date",
          cellsformat: "yyyy-MM-dd",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "大区",
          datafield: "salesman_company",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "办事处",
          datafield: "salesman_agency",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "业务员",
          datafield: "salesman_name",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "省",
          datafield: "province",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "市",
          datafield: "city",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "县",
          datafield: "county",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "合同编号",
          datafield: "contract_number",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 150,
        });
        columns.push({
          text: "合同金额",
          datafield: "contract_amount",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "下单编号",
          datafield: "order_number",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 150,
        });
        columns.push({
          text: "项目名称",
          datafield: "project_name",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 200,
        });
        columns.push({
          text: "下单金额",
          datafield: "order_amount",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer,
          width: 100,
        });
        columns.push({
          text: "送货日期",
          datafield: "delivery_date",
          cellsAlign: "center",
          align: "center",
          cellclassname: that.cellClass,
          width: 100,
        });
        columns.push({
          text: "送货金额",
          datafield: "delivery_amount",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass,
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer,
        });
        columns.push({
          text: "未送货金额",
          datafield: "undelivered_amount",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass,
        });
        columns.push({
          text: "下单面积",
          datafield: "order_area",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass,
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer,
        });
        columns.push({
          text: "送货面积",
          datafield: "delivery_area",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass,
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer,
        });
        columns.push({
          text: "实际运费",
          datafield: "actual_freight",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass,
        });
        columns.push({
          text: "计提成状态",
          datafield: "consideration_commission_status",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass,
        });
        columns.push({
          text: "备注",
          datafield: "remark",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass,
        });
        return columns;
      })(),
    };
  },
  mounted() {},
  methods: {
    createButtonsContainers: function (toolbar) {
      const that = this;
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
      //添加
      let addButton = jqwidgets.createInstance("#addButton", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
      });
      this.addInstance = jqwidgets.createInstance("#addButton", "jqxTooltip", {
        content: "添加",
        position: "bottom",
      });

      this.addInstance.addEventHandler("click", () => {
        this.$refs.orderWindow.open(ADD_ORDER);
      });

      // 删除
      let deleteButton = jqwidgets.createInstance(
        "#deleteButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
        }
      );
      this.deleteInsatnce = jqwidgets.createInstance(
        "#deleteButton",
        "jqxTooltip",
        {
          content: "删除",
          position: "bottom",
        }
      );
      this.deleteInsatnce.addEventHandler("click", () => {
        let selectedrowindexes = this.$refs.myGrid.getselectedrowindexes();
        if (selectedrowindexes.length < 1) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        this.$confirm({
          title: `${Message.CONFIRM_DELETE}`,
          okText: "确认",
          cancelText: "取消",
          centered: true,
          content: (h) => <div style="color:red;"></div>,
          onOk() {
            let ids = selectedrowindexes.map((item) => {
              const map = {};
              map["id"] = that.$refs.myGrid.getrowid(item);
              return map;
            });
            const params = {
              jsonParams: JSON.stringify({
                ids,
              }),
            };
            deleteOrder(params).then((res) => {
              that.refresh();
            });
          },
          onCancel() {},
          class: "test",
        });
      });
      // 修改
      let editButton = jqwidgets.createInstance("#editButton", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
      });
      this.editInstance = jqwidgets.createInstance(
        "#editButton",
        "jqxTooltip",
        {
          content: "编辑",
          position: "bottom",
        }
      );
      this.editInstance.addEventHandler("click", () => {
        let selectedrowindex = this.$refs.myGrid.getselectedrowindex();
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const rowData = this.$refs.myGrid.getrowdata(selectedrowindex);
        this.$refs.orderWindow.open(EDIT_ORDER, rowData);
      });

      // 导入
      let importButton = jqwidgets.createInstance(
        "#importButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/import.svg`),
        }
      );
      this.importInstance = jqwidgets.createInstance(
        "#importButton",
        "jqxTooltip",
        {
          content: "导入",
          position: "bottom",
        }
      );
      this.importInstance.addEventHandler("click", () => {
        this.$refs.orderImportWindow.open();
      });

      // 导出
      let exportButton = jqwidgets.createInstance(
        "#exportButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/export.svg`),
        }
      );
      this.exportInstance = jqwidgets.createInstance(
        "#exportButton",
        "jqxTooltip",
        {
          content: "导出",
          position: "bottom",
        }
      );

      this.exportInstance.addEventHandler("click", () => {
        this.exportToExcel();
      });

      // 刷新
      let reloadButton = jqwidgets.createInstance(
        "#reloadButton",
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      this.refreshInstance = jqwidgets.createInstance(
        "#reloadButton",
        "jqxTooltip",
        {
          content: "刷新",
          position: "bottom",
        }
      );
      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
        exportToExcel() {
      const columns = this.$refs.myGrid.columns;
      const rowsData = this.$refs.myGrid.getrows();
      dataExport('下单详细数据汇总—风管.xlsx',columns,rowsData)
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
    refresh() {
      this.$refs.myGrid.updatebounddata();
    },
  },
};
</script>

<style scoped>
</style>