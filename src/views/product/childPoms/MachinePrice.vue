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
    <machine-price-window ref="machinePriceWindow"></machine-price-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import MachinePriceWindow from "./MachinePriceWindow";

import { formatFilter } from "@/common/util.js";
import {
  Message,
  ADD_PRODUCT_PRICE,
  EDIT_PRODUCT_PRICE
} from "common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showMachinePrice, deleteMachinePrice } from "@/network/product.js";
export default {
  name: "MachinePrice",
  components: {
    JqxGrid,
    MachinePriceWindow
  },
  beforeCreate: function() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "price_id", type: "string" },
        { name: "ps_rule", type: "string" },
        { name: "ps_id", type: "number" },
        { name: "power", type: "string" },
        { name: "price_non_ccc", type: "number" },
        { name: "price_ccc", type: "number" },
        { name: "pm_name", type: "string" },
        { name: "pm_id", type: "number" }
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "price_id",
      sortdirection: "asc",
      id: "price_id",
      url: `/productPrice/showMachinePriceList.do`
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
          showMachinePrice(source, serverdata).then((res) => {
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
          text: "产品名称",
          datafield: "pm_name",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "产品功率",
          datafield: "power",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "非3C价格",
          datafield: "price_non_ccc",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "3C价格",
          datafield: "price_ccc",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "价格方案",
          datafield: "ps_rule",
          align: "center",
          cellsalign: "center"
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

      // 创建按钮
      const addButton = jqwidgets.createInstance(`#${addButtonID}`, "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`)
      });
      jqwidgets.createInstance(`#${addButtonID}`, "jqxTooltip", {
        content: "添加",
        position: "bottom"
      });

      addButton.addEventHandler("click", (event) => {
        this.$refs.machinePriceWindow.open(ADD_PRODUCT_PRICE);
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
        const selectedrowindexes = this.$refs.myGrid.getselectedrowindexes();
        if (selectedrowindexes.length < 1) {
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
            const ids = selectedrowindexes.map((rowIndex) => {
              return that.$refs.myGrid.getrowid(rowIndex);
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
        this.$refs.machinePriceWindow.open(EDIT_PRODUCT_PRICE, rowData);
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
      deleteMachinePrice(params).then((res) => {
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
