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
import { showDeliveryList } from "@/network/delivery.js";
export default {
  name: "Delivery",
  components: {
    JqxGrid,
    JqxTooltip,
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      dataFields: [
        { name: "id", type: "number" },
        { name: "order_number", type: "string" },
        { name: "delivery_date", type: "string" },
        { name: "delivery_amount", type: "number" },
        { name: "delivery_reserve_price", type: "number" },
        { name: "delivery_area", type: "float" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/dlvDtl/showDeliveryInfoList.do`,
    };
  },
  data() {
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data;
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          showDeliveryList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            });
          });
        },
        beforeLoadComplete(records) {},
        beforeSend: function (xhr) {},
      }),
      rendergridrows: function (obj) {
        return obj.data;
      },
      columns: [
        {
          text: "下单编号",
          datafield: "order_number",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "送货日期",
          datafield: "delivery_date",
          cellsformat: "yyyy-MM-dd",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "送货金额",
          datafield: "delivery_amount",
          align: "center",
          cellsalign: "center",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer,
          cellsformat: "n",
        },
        {
          text: "送货底价",
          datafield: "delivery_reserve_price",
          align: "center",
          cellsalign: "center",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer,
          cellsformat: "n",
        },
        {
          text: "送货面积",
          datafield: "delivery_area",
          align: "center",
          cellsalign: "center",
          aggregates: ["sum"],
          aggregatesRenderer: this.aggregatesRenderer,
          cellsformat: "n",
        },
      ],
    };
  },
  mounted() {},
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
      let addButtonID = JQXLite.generateID();
      let deleteButtonID = JQXLite.generateID();
      let editButtonID = JQXLite.generateID();
      let importButtonID = JQXLite.generateID();
      let exportButtonID = JQXLite.generateID();
      let reloadButtonID = JQXLite.generateID();
      addButtonContainer.id = addButtonID;
      deleteButtonContainer.id = deleteButtonID;
      editButtonContainer.id = editButtonID;
      importButtonContainer.id = importButtonID;
      exportButtonContainer.id = exportButtonID;
      reloadButtonContainer.id = reloadButtonID;
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
      let addButton = jqwidgets.createInstance(`#${addButtonID}`, "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
      });
      jqwidgets.createInstance(`#${addButtonID}`, "jqxTooltip", {
        content: "添加",
        position: "bottom",
      });

      let deleteButton = jqwidgets.createInstance(
        `#${deleteButtonID}`,
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
        }
      );
      jqwidgets.createInstance(`#${deleteButtonID}`, "jqxTooltip", {
        content: "删除",
        position: "bottom",
      });

      let editButton = jqwidgets.createInstance(
        `#${editButtonID}`,
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
        }
      );
      jqwidgets.createInstance("#editButton", "jqxTooltip", {
        content: "编辑",
        position: "bottom",
      });

      let importButton = jqwidgets.createInstance(
        `#${importButtonID}`,
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/import.svg`),
        }
      );
      jqwidgets.createInstance(`#${importButtonID}`, "jqxTooltip", {
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
      jqwidgets.createInstance(`#${exportButtonID}`, "jqxTooltip", {
        content: "导出",
        position: "bottom",
      });

      let reloadButton = jqwidgets.createInstance(
        `#${reloadButtonID}`,
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      jqwidgets.createInstance(`#${reloadButtonID}`, "jqxTooltip", {
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

<style>
</style>