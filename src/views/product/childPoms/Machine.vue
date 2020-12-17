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
import MachineWindow from "./MachineWindow";

import { formatFilter } from "@/common/util.js";
import { getLocalization } from "@/common/localization.js";
import {
  Message,
  ADD_PRODUCT,
  EDIT_PRODUCT
} from "@/common/const.js";

import { showMachineList, deleteMachineProduct } from "@/network/product.js";
export default {
  name: "Machine",
  components: {
    JqxGrid,
    MachineWindow
  },
  beforeCreate: function() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "pm_id", type: "number" },
        { name: "pm_name", type: "string" },
        { name: "model", type: "string" },
        { name: "min_air_volume", type: "number" },
        { name: "max_air_volume", type: "number" },
        { name: "power", type: "string" },
        { name: "unit", type: "string" },
        { name: "remark", type: "string" },
        { name: "pc_name", type: "string" },
        { name: "pc_id", type: "string" },
        { name: "open_status", type: "string" }
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "pm_id",
      sortdirection: "asc",
      id: "pm_id",
      url: `/productManage/showMachineProductList.do`
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
          showMachineList(source, serverdata).then((res) => {
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
          datafield: "pm_name",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "型号",
          datafield: "model",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "分类",
          datafield: "pc_name",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "最低风量",
          datafield: "min_air_volume",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "最高风量",
          datafield: "max_air_volume",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "功率",
          datafield: "power",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "单位",
          datafield: "unit",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "备注",
          datafield: "remark",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        }
      ]
    };
  },
  mounted() {},
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
      addButtonContainer.style.cssText = "float: left; margin-left: 5px; cursor: pointer;";
      deleteButtonContainer.style.cssText = "float: left; margin-left: 5px; cursor: pointer;";
      editButtonContainer.style.cssText = "float: left; margin-left: 5px; cursor: pointer;";
      reloadButtonContainer.style.cssText = "float: right; margin-left: 5px; cursor: pointer;";

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
        this.$refs.myWindow.open(ADD_PRODUCT);
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
                pm_id: id
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
        this.$refs.myWindow.open(EDIT_PRODUCT, rowData);
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
      deleteMachineProduct(params).then((res) => {
        this.refresh()
      });
    },
    refresh() {
      this.$refs.myGrid.updatebounddata();
    }
  }
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
