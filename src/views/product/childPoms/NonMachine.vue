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
    <non-machine-window ref="myWindow"></non-machine-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";
import NonMachineWindow from "./NonMachineWindow";

import { formatFilter } from "@/common/util.js";
import { Message, ADD_PRODUCT, EDIT_PRODUCT } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import {
  showNonMachineList,
  deleteNonMachineProduct,
} from "@/network/product.js";
export default {
  name: "Machine",
  components: {
    JqxGrid,
    NonMachineWindow,
  },
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "pnm_id", type: "number" },
        { name: "pnm_name", type: "string" },
        { name: "pc_name", type: "string" },
        { name: "pc_id", type: "number" },
        { name: "limit_size_long", type: "number" },
        { name: "limit_size_short", type: "number" },
        { name: "min_size", type: "number" },
        { name: "max_size", type: "number" },
        { name: "round_min_size", type: "number" },
        { name: "round_max_size", type: "number" },
        { name: "unit", type: "string" },
        { name: "formula", type: "string" },
        { name: "is_ccc", type: "string" },
        { name: "remark", type: "string" },
        { name: "open_status", type: "string" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "pnm_id",
      sortdirection: "asc",
      id: "pnm_id",
      url: `/productManage/showNonMachineProductList.do`,
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
          showNonMachineList(source, serverdata).then((res) => {
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
          text: "名称",
          datafield: "pnm_name",
          align: "center",
          cellsalign: "center",
          width: 150,
        },
        {
          text: "分类",
          datafield: "pc_name",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "界定尺寸（长）",
          datafield: "limit_size_long",
          align: "center",
          cellsalign: "center",
          width: 120,
        },
        {
          text: "界定尺寸（短）",
          datafield: "limit_size_short",
          align: "center",
          cellsalign: "center",
          width: 120,
        },
        {
          text: "最小尺寸",
          datafield: "min_size",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "最大尺寸",
          datafield: "max_size",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "圆形最小尺寸",
          datafield: "round_min_size",
          align: "center",
          cellsalign: "center",
          width: 120,
        },
        {
          text: "圆形最大尺寸",
          datafield: "round_max_size",
          align: "center",
          cellsalign: "center",
          width: 120,
        },
        {
          text: "单位",
          datafield: "unit",
          align: "center",
          cellsalign: "center",
          width: 50,
        },
        {
          text: "公式",
          datafield: "formula",
          align: "center",
          cellsalign: "center",
          width: 250,
        },
        {
          text: "备注",
          datafield: "remark",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "强制认证",
          datafield: "is_ccc",
          align: "center",
          cellsalign: "center",
          width: 100,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == "是") {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                "</span>"
              );
            }
            return (
              '<span style="width:100%;display:block; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px; color: #ff0000;">' +
              value +
              "</span>"
            );
          },
        },
        {
          text: "启用状态",
          datafield: "open_status",
          align: "center",
          cellsalign: "center",
          width: 100,
          cellsrenderer: function (
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
          },
        },
      ],
    };
  },
  mounted() {},
  methods: {
    createButtonsContainers: function (toolbar) {
      const that = this;
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      toolbar[0].appendChild(buttonsContainer);
      let addButtonContainer = document.createElement("div");
      let deleteButtonContainer = document.createElement("div");
      let editButtonContainer = document.createElement("div");
      let reloadButtonContainer = document.createElement("div");

      let addButtonID = JQXLite.generateID();
      let deleteButtonID = JQXLite.generateID();
      let editButtonID = JQXLite.generateID();
      let reloadButtonID = JQXLite.generateID();

      addButtonContainer.id = addButtonID;
      deleteButtonContainer.id = deleteButtonID;
      editButtonContainer.id = editButtonID;
      reloadButtonContainer.id = reloadButtonID;

      addButtonContainer.style.cssText =
        "float: left; margin-left: 5px;cursor:pointer;";
      deleteButtonContainer.style.cssText =
        "float: left; margin-left: 5px;cursor:pointer;";
      editButtonContainer.style.cssText =
        "float: left; margin-left: 5px;cursor:pointer;";
      reloadButtonContainer.style.cssText =
        "float: right; margin-left: 5px;cursor:pointer;";

      buttonsContainer.appendChild(addButtonContainer);
      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(editButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);

      //创建按钮
      let addButton = jqwidgets.createInstance(`#${addButtonID}`, "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
      });
      jqwidgets.createInstance(`#${addButtonID}`, "jqxTooltip", {
        content: "添加",
        position: "bottom",
      });

      addButton.addEventHandler("click", (event) => {
        this.$refs.myWindow.open(ADD_PRODUCT);
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

      deleteButton.addEventHandler("click", (event) => {
        let selectedrowindex = this.$refs.myGrid.getselectedrowindex();
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
          content: (h) => <div style="color:red;"></div>,
          onOk() {
            const selectedIndexes = that.$refs.myGrid.getselectedrowindexes();
            const ids = selectedIndexes.map((rowIndex) => {
              return {
                pnm_id: that.$refs.myGrid.getrowid(rowIndex),
              };
            });
            that.delete(ids);
          },
          onCancel() {},
          class: "test",
        });
      });

      let editButton = jqwidgets.createInstance(
        `#${editButtonID}`,
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
        }
      );
      jqwidgets.createInstance(`#${editButtonID}`, "jqxTooltip", {
        content: "编辑",
        position: "bottom",
      });

      editButton.addEventHandler("click", (event) => {
        const index = this.$refs.myGrid.getselectedrowindex();
        if (index < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const rowData = this.$refs.myGrid.getrowdata(index);
        this.$refs.myWindow.open(EDIT_PRODUCT, rowData);
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

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    delete(ids) {
      const params = {
        jsonParams: JSON.stringify({
          ids,
        }),
      };
      deleteNonMachineProduct(params).then((res) => {
        this.refresh();
      });
    },
    refresh() {
      this.$refs.myGrid.updatebounddata();
    },
  },
};
</script>

<style scoped>
</style>