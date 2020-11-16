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
    <machine-window ref="myWindow"></machine-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";
import MachineWindow from "./MachineWindow";

import { formatFilter } from "@/common/util.js";
import { getLocalization } from "@/common/localization.js";
import {
  Message,
  ADD_MACHINE_PRODUCT,
  EDIT_MACHINE_PRODUCT,
} from "@/common/const.js";

import { showMachineList } from "@/network/product.js";
export default {
  name: "Machine",
  components: {
    JqxGrid,
    MachineWindow,
  },
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "pm_id", type: "number" },
        { name: "pm_name", type: "string" },
        { name: "min_air_volume", type: "number" },
        { name: "max_air_volume", type: "number" },
        { name: "power", type: "string" },
        { name: "unit", type: "string" },
        { name: "remark", type: "string" },
        { name: "pc_name", type: "string" },
        { name: "pc_id", type: "string" },
        { name: "open_status", type: "string" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "pm_id",
      sortdirection: "asc",
      id: "pm_id",
      url: `/productManage/showMachineProductList.do`,
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
          showMachineList(source, serverdata).then((res) => {
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
          text: "名称",
          datafield: "pm_name",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "分类",
          datafield: "pc_name",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "最低风量",
          datafield: "min_air_volume",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "最高风量",
          datafield: "max_air_volume",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "功率",
          datafield: "power",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "单位",
          datafield: "unit",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "备注",
          datafield: "remark",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
      ],
    };
  },
  mounted() {

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
        this.$refs.myWindow.open(ADD_MACHINE_PRODUCT);
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
        this.$refs.myWindow.open(EDIT_MACHINE_PRODUCT, rowData);
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    refresh() {
      console.log("刷新");
      this.$refs.myGrid.updatebounddata();
    },
  },
};
</script>

<style scoped>
.machine {
  height: calc(100vh - 135px);
}
.jqx-grid {
  border-style: none;
}
</style>