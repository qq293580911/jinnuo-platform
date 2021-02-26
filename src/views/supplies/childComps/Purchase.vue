<template>
  <div :style="contentStyle">
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
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";

import { formatFilter } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showPurchaseList } from "@/network/supplies.js";

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
        { name: "purchase_date", type: "string" },
        { name: "supplies_id", type: "number" },
        { name: "supplies_name", type: "string" },
        { name: "supplies_unit", type: "string" },
        { name: "purchase_quantity", type: "string" },
        { name: "purchase_unit_price", type: "string" },
        { name: "operator", type: "string" },
        { name: "address", type: "string" },
        { name: "purchaser", type: "number" },
        { name: "purchaser_name", type: "string" },
        { name: "remark", type: "string" }
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/supplies/showOfficeSuppliesPurchaseList.do`
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
          showPurchaseList(source, serverdata).then((res) => {
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
          text: "采购日期",
          cellsAlign: "center",
          align: "center",
          datafield: "purchase_date",
          cellsformat: "yyyy-MM-dd"
        },
        {
          text: "用品名称",
          cellsAlign: "center",
          align: "center",
          datafield: "supplies_name"
        },
        {
          text: "用品单位",
          cellsAlign: "center",
          align: "center",
          datafield: "supplies_unit"
        },
        {
          text: "采购数量",
          cellsAlign: "center",
          align: "center",
          datafield: "purchase_quantity"
        },
        {
          text: "采购单价",
          cellsAlign: "center",
          align: "center",
          datafield: "purchase_unit_price"
        },
        {
          text: "运营商",
          cellsAlign: "center",
          align: "center",
          datafield: "operator"
        },
        {
          text: "地址/网址",
          cellsAlign: "center",
          align: "center",
          datafield: "address"
        },
        {
          text: "采购人",
          cellsAlign: "center",
          align: "center",
          datafield: "purchaser_name"
        },
        {
          text: "备注",
          cellsAlign: "center",
          align: "center",
          datafield: "remark"
        }
      ]
    };
  },
  mounted() {},
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
    }
  }
};
</script>

<style>
</style>
