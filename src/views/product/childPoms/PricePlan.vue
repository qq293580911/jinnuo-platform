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
    <price-plan-window ref="pricePlanWindow"></price-plan-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import PricePlanWindow from "./PricePlanWindow";

import { getLocalization } from "@/common/localization.js";
import { formatFilter } from "@/common/util.js";
import { Message, ADD_PRICE_PLAN, UPDATE_PRICE_PLAN } from "@/common/const.js";
import { contentHeight } from '@/common/mixin.js'
import {
  showPricePlan,
  deletePricePlan
} from "@/network/product.js";
export default {
  name: "PricePlan",
  components: {
    JqxGrid,
    PricePlanWindow
  },
  mixins:[contentHeight],
  beforeCreate: function() {
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
        { name: "enable", type: "string" }
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/productPrice/showPriceSchemeList.do`
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
          showPricePlan(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total
            });
          });
        }
      }),
      rendergridrows: function(obj) {
        return obj.data;
      },
      columns: [
        {
          text: "方案规则",
          datafield: "rule",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "陈旧状态",
          datafield: "obsolete",
          columntype: "combobox",
          align: "center",
          cellsalign: "center",
          cellsrenderer: function(
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
          }
        },
        {
          text: "创建日期",
          datafield: "create_date",
          columntype: "datetimeinput",
          align: "center",
          cellsalign: "center",
          editable: false
        },
        {
          text: "更新日期",
          datafield: "update_date",
          columntype: "datetimeinput",
          align: "center",
          cellsalign: "center",
          editable: false
        },
        {
          text: "方案备注",
          datafield: "remark",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "开放状态",
          datafield: "enable",
          columntype: "combobox",
          align: "center",
          cellsalign: "center",
          cellsrenderer: function(
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
          }
        }
      ]
    };
  },
  mounted() {},
  methods: {
    createButtonsContainers: function(toolbar) {
      const that = this;
      const buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      toolbar[0].appendChild(buttonsContainer);

      const addButtonContainer = document.createElement("div");
      const deleteButtonContainer = document.createElement("div");
      const editButtonContainer = document.createElement("div");
      const reloadButtonContainer = document.createElement("div");

      const addButtonID = JQXLite.generateID();
      const deleteButtonID = JQXLite.generateID();
      const editButtonID = JQXLite.generateID();
      const reloadButtonID = JQXLite.generateID();

      addButtonContainer.id = addButtonID;
      deleteButtonContainer.id = deleteButtonID;
      editButtonContainer.id = editButtonID;
      reloadButtonContainer.id = reloadButtonID;

      addButtonContainer.style.cssText =
        "float: left; margin-left: 5px;cursor: pointer;";
      deleteButtonContainer.style.cssText =
        "float: left; margin-left: 5px;cursor: pointer;";
      editButtonContainer.style.cssText =
        "float: left; margin-left: 5px;cursor: pointer;";
      reloadButtonContainer.style.cssText =
        "float: right; margin-left: 5px;cursor: pointer;";

      buttonsContainer.appendChild(addButtonContainer);
      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(editButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      // 创建按钮
      const addButton = jqwidgets.createInstance(`#${addButtonID}`, "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`)
      });
      jqwidgets.createInstance(`#${addButtonID}`, "jqxTooltip", {
        content: "添加",
        position: "bottom"
      });

      addButton.addEventHandler("click", (event) => {
        this.$refs.pricePlanWindow.open(ADD_PRICE_PLAN);
      });

      const deleteButton = jqwidgets.createInstance(
        `#${deleteButtonID}`,
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`)
        }
      );
      jqwidgets.createInstance(`#${deleteButtonID}`, "jqxTooltip", {
        content: "删除",
        position: "bottom"
      });

      deleteButton.addEventHandler("click", (event) => {
        const selectedrowindex = this.$refs.myGrid.getselectedrowindex();
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        this.$confirm({
          title: `${Message.CONFIRM_DELETE}`,
          okText: "确认",
          cancelText: "取消",
          centered: true,
          okType: "danger",
          content: (h) => <div style='color:red;'></div>,
          onOk() {
            const selectedIndexes = that.$refs.myGrid.getselectedrowindexes();
            const ids = selectedIndexes.map(rowIndex => {
              const id = that.$refs.myGrid.getrowid(rowIndex)
              return id
            })
            that.delete(ids);
          },
          onCancel() {},
          class: "test"
        });
      });

      const editButton = jqwidgets.createInstance(
        `#${editButtonID}`,
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/edit.svg`)
        }
      );
      jqwidgets.createInstance(`#${editButtonID}`, "jqxTooltip", {
        content: "编辑",
        position: "bottom"
      });

      editButton.addEventHandler("click", (event) => {
        const index = this.$refs.myGrid.getselectedrowindex();
        if (index < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const rowData = this.$refs.myGrid.getrowdata(index);
        this.$refs.pricePlanWindow.open(UPDATE_PRICE_PLAN, rowData);
      });

      const reloadButton = jqwidgets.createInstance(
        `#${reloadButtonID}`,
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      jqwidgets.createInstance(`#${reloadButtonID}`, "jqxTooltip", {
        content: "刷新",
        position: "bottom"
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    delete(ids) {
      const params = {
        jsonParams: JSON.stringify({
          ids
        })
      };
      deletePricePlan(params).then((res) => {
        this.refresh();
      });
    },
    refresh() {
      this.$refs.myGrid.updatebounddata();
    }
  }
};
</script>

<style scoped>
</style>
