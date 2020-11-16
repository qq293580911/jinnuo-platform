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
    >
    </JqxGrid>
    <price-plan-window ref="pricePlanWindow"></price-plan-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import PricePlanWindow from "./PricePlanWindow";

import { formatFilter } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showPricePlan, getPricePlan } from "@/network/product.js";
export default {
  name: "PricePlan",
  components: {
    JqxGrid,
    PricePlanWindow,
  },
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "id", type: "string" },
        { name: "rule", type: "string" },
        { name: "obsolete", type: "string" },
        { name: "create_date", type: "string" },
        { name: "update_date", type: "string" },
        { name: "remark", type: "string" },
        { name: "enable", type: "string" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/productPrice/showPriceSchemeList.do`,
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
          showPricePlan(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            });
          });
        },
      }),
      rendergridrows: function (obj) {
        return obj.data;
      },
      columns: [
        {
          text: "方案规则",
          datafield: "rule",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "陈旧状态",
          datafield: "obsolete",
          columntype: "combobox",
          align: "center",
          cellsalign: "center",
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == "旧") {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #ff0000;">' +
                value +
                "</span>"
              );
            } else {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                "</span>"
              );
            }
          },
        },
        {
          text: "创建日期",
          datafield: "create_date",
          columntype: "datetimeinput",
          align: "center",
          cellsalign: "center",
          editable: false,
        },
        {
          text: "更新日期",
          datafield: "update_date",
          columntype: "datetimeinput",
          align: "center",
          cellsalign: "center",
          editable: false,
        },
        {
          text: "方案备注",
          datafield: "remark",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "开放状态",
          datafield: "enable",
          columntype: "combobox",
          align: "center",
          cellsalign: "center",
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == 0) {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #ff0000;">' +
                "已停用" +
                "</span>"
              );
            } else {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                "已启用" +
                "</span>"
              );
            }
          },
        },
      ],
    };
  },
  mounted() {
    // 记录所有方案到store中
    getPricePlan().then((responese) => {
      this.$store.dispatch("savePricePlan", responese).then((res) => {});
    });
  },
  methods: {
    createButtonsContainers: function (statusbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      let addButtonContainer = document.createElement("div");
      let deleteButtonContainer = document.createElement("div");
      let editButtonContainer = document.createElement("div");
      let reloadButtonContainer = document.createElement("div");
      addButtonContainer.id = "addButton";
      deleteButtonContainer.id = "deleteButton";
      editButtonContainer.id = "editButton";
      reloadButtonContainer.id = "reloadButton";
      addButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      deleteButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      editButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      reloadButtonContainer.style.cssText = "float: right; margin-left: 5px;";

      buttonsContainer.appendChild(addButtonContainer);
      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(editButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      statusbar[0].appendChild(buttonsContainer);
      //创建按钮
      let addButton = jqwidgets.createInstance("#addButton", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
      });
      let addButtonTooltip = jqwidgets.createInstance(
        "#addButton",
        "jqxTooltip",
        { content: "添加", position: "bottom" }
      );

      let deleteButton = jqwidgets.createInstance(
        "#deleteButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
        }
      );
      let deleteButtonTooltip = jqwidgets.createInstance(
        "#deleteButton",
        "jqxTooltip",
        { content: "删除", position: "bottom" }
      );

      let editButton = jqwidgets.createInstance("#editButton", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
      });
      let editButtonTooltip = jqwidgets.createInstance(
        "#editButton",
        "jqxTooltip",
        { content: "编辑", position: "bottom" }
      );

      let reloadButton = jqwidgets.createInstance(
        "#reloadButton",
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      let reloadButtonTooltip = jqwidgets.createInstance(
        "#reloadButton",
        "jqxTooltip",
        { content: "刷新", position: "bottom" }
      );

      //绑定事件
      addButton.addEventHandler("click", (event) => {
        this.$refs.pricePlanWindow.open("添加价格方案");
      });

      deleteButton.addEventHandler("click", (event) => {
        let selectedrowindex = this.$refs.myGrid.getselectedrowindex();
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        let id = this.$refs.myGrid.getrowid(selectedrowindex);
        this.$refs.myGrid.deleterow(id);
      });

      editButton.addEventHandler("click", (event) => {
        const index = this.$refs.myGrid.getselectedrowindex();
        if (index < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const rowData = this.$refs.myGrid.getrowdata(index);
        console.log(rowData);
        this.$refs.pricePlanWindow.open("修改价格方案", rowData);
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
  },
};
</script>

<style scoped>
</style>