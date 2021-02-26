<template>
  <div :style="contentStyle">
    <JqxGrid
      ref="myGrid"
      :width="'100%'"
      :height="'100%'"
      :localization="localization"
      :source="dataAdapter"
      :columns="columns"
      :columngroups="columngroups"
      :showtoolbar="true"
      :rendertoolbar="createButtonsContainers"
      :showstatusbar="true"
      :statusbarheight="30"
      :showaggregates="true"
      :pageable="false"
      :sortable="true"
      :filterable="true"
      :altrows="true"
      :rowsheight="29"
      :enabletooltip="true"
      :rendergridrows="rendergridrows"
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";

import { formatFilter } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showStatisticsList } from "@/network/supplies.js";

import { contentHeight } from '@/common/mixin.js'
export default {
  components: {
    JqxGrid
  },
  mixins: [contentHeight],
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "id", type: "string" },
        { name: "supplies_name", type: "string" },
        { name: "specification_model", type: "string" },
        { name: "supplies_color", type: "string" },
        { name: "supplies_unit", type: "string" },
        { name: "purchase_unit_price", type: "number" },
        { name: "current_month_purchase_quantity", type: "number" },
        { name: "current_month_receive_quantity", type: "number" },
        { name: "total_purchase_quantity", type: "number" },
        { name: "total_receive_quantity", type: "number" }
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/supplies/showOfficeSuppliesStatistics.do`
    };
  },
  data() {
    return {
      // 数据网格
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function(data) {
          return data;
        },
        loadServerData: function(serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          showStatisticsList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total
            });
          });
        },
        beforeLoadComplete(records) {}
      }),
      rendergridrows: function(obj) {
        return obj.data;
      },
      columns: [
        {
          text: "",
          sortable: false,
          filterable: false,
          editable: false,
          groupable: false,
          draggable: false,
          resizable: false,
          datafield: "",
          columntype: "number",
          width: 50,
          cellsrenderer: function(row, column, value) {
            return (
              "<div class='jqx-grid-cell-middle-align' style='margin-top: 6px;'>" +
              (value + 1) +
              "</div>"
            );
          }
        },

        {
          text: "用品名称",
          cellsAlign: "center",
          align: "center",
          datafield: "supplies_name"
        },
        {
          text: "规格型号",
          cellsAlign: "center",
          align: "center",
          datafield: "specification_model"
        },
        {
          text: "颜色",
          cellsAlign: "center",
          align: "center",
          datafield: "supplies_color",
          cellsrenderer: function(
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties
          ) {
            return (
              '<span style="width:100%;display:block;background-color:' +
              value +
              "; text-align: " +
              columnproperties.cellsalign +
              ';line-height:29px;">' +
              value +
              "</span>"
            );
          }
        },
        {
          text: "单位",
          cellsAlign: "center",
          align: "center",
          datafield: "supplies_unit"
        },
        {
          text: "单价",
          cellsAlign: "center",
          align: "center",
          datafield: "purchase_unit_price",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer
        },
        {
          text: "数量",
          cellsAlign: "center",
          align: "center",
          datafield: "current_month_purchase_quantity",
          columngroup: "currentMonthPurchase",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer
        },
        {
          text: "金额",
          cellsAlign: "center",
          align: "center",
          datafield: "current_month_purchase_amount",
          columngroup: "currentMonthPurchase",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer
        },

        {
          text: "数量",
          cellsAlign: "center",
          align: "center",
          datafield: "current_month_receive_quantity",
          columngroup: "currentMonthReseive",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer
        },
        {
          text: "金额",
          cellsAlign: "center",
          align: "center",
          datafield: "current_month_receive_amount",
          columngroup: "currentMonthReseive",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer
        },
        {
          text: "数量",
          cellsAlign: "center",
          align: "center",
          datafield: "remainder_stock_quantity",
          columngroup: "currentMonthStock",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer
        },
        {
          text: "金额",
          cellsAlign: "center",
          align: "center",
          datafield: "remainder_stock_amount",
          columngroup: "currentMonthStock",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer
        }
      ],
      columngroups: [
        { text: "本月购入", align: "center", name: "currentMonthPurchase" },
        {
          text: "本月发出",
          parentgroup: "ProductDetails",
          align: "center",
          name: "currentMonthReseive"
        },
        { text: "剩余库存", align: "center", name: "currentMonthStock" }
      ]
    };
  },
  methods: {
    createButtonsContainers: function(toolbar) {
      const buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      const addButtonContainer = document.createElement("div");
      const deleteButtonContainer = document.createElement("div");
      const exportButtonContainer = document.createElement("div");
      const reloadButtonContainer = document.createElement("div");
      addButtonContainer.id = "addButton";
      deleteButtonContainer.id = "deleteButton";
      exportButtonContainer.id = "exportButton";
      reloadButtonContainer.id = "reloadButton";
      addButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      deleteButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      exportButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      reloadButtonContainer.style.cssText =
        "float:right;margin-left: 5px;  cursor: pointer;";
      buttonsContainer.appendChild(addButtonContainer);
      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(exportButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      toolbar[0].appendChild(buttonsContainer);
      // 创建按钮
      jqwidgets.createInstance("#addButton", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`)
      });
      jqwidgets.createInstance("#addButton", "jqxTooltip", {
        content: "添加",
        position: "bottom"
      });

      const deleteButton = jqwidgets.createInstance(
        "#deleteButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`)
        }
      );
      jqwidgets.createInstance("#deleteButton", "jqxTooltip", {
        content: "删除",
        position: "bottom"
      });

      jqwidgets.createInstance(
        "#exportButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/export.svg`)
        }
      );
      jqwidgets.createInstance("#exportButton", "jqxTooltip", {
        content: "导出",
        position: "bottom"
      });

      const reloadButton = jqwidgets.createInstance(
        "#reloadButton",
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      jqwidgets.createInstance("#reloadButton", "jqxTooltip", {
        content: "刷新",
        position: "bottom"
      });

      // 绑定事件

      deleteButton.addEventHandler("click", (event) => {
        const selectedrowindex = this.$refs.myGrid.getselectedrowindex();
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const id = this.$refs.myGrid.getrowid(selectedrowindex);
        this.$refs.myGrid.deleterow(id);
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    aggregatesRenderer(aggregates, column, element) {
      var renderString = "";
      $.each(aggregates, function(key, value) {
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
    }
  }
};
</script>

<style scoped>
</style>
