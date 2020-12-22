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
      :pagesize="25"
      :pagesizeoptions="[5, 10, 15, 20, 25, 30]"
      :sortable="true"
      :filterable="true"
      :altrows="true"
      :enabletooltip="true"
      :editmode="'dblclick'"
      :selectionmode="'multiplerowsextended'"
      :virtualmode="true"
      :rendergridrows="rendergridrows"
    >
    </JqxGrid>
    <ventilator-window ref="ventilatorWindow"></ventilator-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import VentilatorWindow from "./VentilatorWindow.vue";

import { formatFilter } from "@/common/util.js";
import { contentHeight } from '@/common/mixin.js'
import { getLocalization } from "@/common/localization.js";
import {
  Message,
  ADD_PRODUCT,
  EDIT_PRODUCT
} from "@/common/const.js";
import { showVentilatorList, deleteVentilator } from "@/network/product.js";

export default {
  components: {
    JqxGrid,
    VentilatorWindow
  },
  mixins:[contentHeight],
  beforeCreate() {
    this.source = {
      datafields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
        { name: "pc_name", type: "string" },
        { name: "pc_id", type: "number" },
        { name: "specification", type: "string" },
        { name: "hole_size", type: "string" },
        { name: "air_volume", type: "number" },
        { name: "panel_material", type: "string" },
        { name: "remark", type: "string" },
        { name: "status", type: "string" }
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/productManage/showVentilatorList.do`
    };
  },
  data() {
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function(data) {
          return data;
        },
        loadServerData: function(serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          showVentilatorList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total
            });
          });
        },
        beforeLoadComplete(records) {},
        beforeSend: function(xhr) {}
      }),
      rendergridrows: function(obj) {
        return obj.data;
      },
      columns: [
        {
          text: "名称",
          datafield: "name",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "分类",
          datafield: "pc_name",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "规格",
          datafield: "specification",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "开孔尺寸",
          datafield: "hole_size",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "风量",
          datafield: "air_volume",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "面板材质",
          datafield: "panel_material",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "备注",
          datafield: "remark",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "启用状态",
          datafield: "status",
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
            if (value == "已停用") {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #ff0000;">' +
                value +
                "</span>"
              );
            }
            return (
              '<span style="width:100%;display:block; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px; color: #008000;">' +
              value +
              "</span>"
            );
          }
        }
      ]
    };
  },
  methods: {
    createButtonsContainers: function(statusbar) {
      const that = this;
      const buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
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
        "float: left; margin-left: 5px; cursor: pointer;";
      deleteButtonContainer.style.cssText =
        "float: left; margin-left: 5px; cursor: pointer;";
      editButtonContainer.style.cssText =
        "float: left; margin-left: 5px; cursor: pointer;";
      reloadButtonContainer.style.cssText =
        "float: right; margin-left: 5px; cursor: pointer;";

      buttonsContainer.appendChild(addButtonContainer);
      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(editButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      statusbar[0].appendChild(buttonsContainer);

      // 创建按钮
      const addButton = jqwidgets.createInstance(`#${addButtonID}`, "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`)
      });
      jqwidgets.createInstance(`#${addButtonID}`, "jqxTooltip", {
        content: "添加",
        position: "bottom"
      });

      addButton.addEventHandler("click", (event) => {
        this.$refs.ventilatorWindow.open(ADD_PRODUCT);
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
            const ids = selectedIndexes.map((rowIndex) => {
              const id = that.$refs.myGrid.getrowid(rowIndex);
              const map = {
                id
              };
              return map;
            });
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
        this.$refs.ventilatorWindow.open(EDIT_PRODUCT, rowData);
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
      deleteVentilator(params).then((res) => {
        this.refresh();
      });
    },
    refresh() {
      this.$refs.myGrid.updatebounddata();
    }
  }
};
</script>

<style>
</style>
