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
import { Message } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showNonMachineList } from "@/network/product.js";
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
        this.$refs.myWindow.open("添加产品信息");
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
        this.$refs.myWindow.open("修改产品信息", rowData);
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