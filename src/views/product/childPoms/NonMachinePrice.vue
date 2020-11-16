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
    <non-machine-price-window ref="nonMachinePriceWindow"></non-machine-price-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";

import NonMachinePriceWindow from "./NonMachinePriceWindow";


import { formatFilter } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showNonMachinePrice } from "@/network/product.js";
export default {
  name: "NonMachinePrice",
  components: {
    JqxGrid,
    NonMachinePriceWindow
  },
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "price_id", type: "string" },
        { name: "ps_id", type: "number" },
        { name: "ps_rule", type: "string" },
        { name: "pnm_id", type: "number" },
        { name: "pnm_name", type: "string" },
        { name: "panel_price", type: "number" },
        { name: "panel_extra_price", type: "number" },
        { name: "valve_price", type: "number" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "price_id",
      sortdirection: "asc",
      id: "price_id",
      url: `/productPrice/showNonMachinePriceList.do`,
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
          showNonMachinePrice(source, serverdata).then((res) => {
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
          text: "产品名称",
          datafield: "pnm_name",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "面板价格",
          datafield: "panel_price",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "面板额外价格",
          datafield: "panel_extra_price",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "阀体价格",
          datafield: "valve_price",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "价格方案",
          datafield: "ps_rule",
          columntype: "textbox",
          align: "center",
          cellsalign: "center",
        },
      ],
    };
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
        this.$refs.nonMachinePriceWindow.open("添加非设备价格");
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
        this.$refs.nonMachinePriceWindow.open("修改非设备价格", rowData);
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