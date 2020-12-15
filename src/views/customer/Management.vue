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
    <customer-window ref="customerWindow"></customer-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import CustomerWindow from "./childPoms/CustomerWindow";

import { formatFilter } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showCustomerList } from "@/network/customer.js";
export default {
  name: "CustomerManagement",
  components: {
    JqxGrid,
    CustomerWindow
  },
  beforeCreate: function() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
        { name: "type", type: "string" },
        { name: "gender", type: "string" },
        { name: "phone", type: "string" },
        { name: "company", type: "string" },
        { name: "position", type: "string" }
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/customer/showCustomerList.do`
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
          showCustomerList(source, serverdata).then((res) => {
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
          text: "客户姓名",
          datafield: "name",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "客户类型",
          datafield: "type",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "性别",
          datafield: "gender",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "电话",
          datafield: "phone",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        },
        {
          text: "公司",
          datafield: "company",
          columntype: "textbox",
          align: "center",
          cellsalign: "center"
        }
      ]
    };
  },
  methods: {
    createButtonsContainers: function(statusbar) {
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
      addButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      deleteButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      editButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      reloadButtonContainer.style.cssText = "float: right; margin-left: 5px;";

      buttonsContainer.appendChild(addButtonContainer);
      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(editButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      statusbar[0].appendChild(buttonsContainer);
      // 创建按钮
      const addButton = jqwidgets.createInstance(`#${addButtonID}`, "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`)
      });
      jqwidgets.createInstance(
        `#${addButtonID}`,
        "jqxTooltip",
        { content: "添加", position: "bottom" }
      );

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

      const reloadButton = jqwidgets.createInstance(
        `#${reloadButtonID}`,
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      jqwidgets.createInstance(`#${reloadButtonID}`, "jqxTooltip", {
        content: "刷新",
        position: "bottom"
      });

      // 绑定事件
      addButton.addEventHandler("click", (event) => {
        this.$refs.customerWindow.open("添加客户信息");
      });

      deleteButton.addEventHandler("click", (event) => {
        const selectedrowindex = this.$refs.myGrid.getselectedrowindex();
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const id = this.$refs.myGrid.getrowid(selectedrowindex);
        this.delete(id)
      });

      editButton.addEventHandler("click", (event) => {
        const index = this.$refs.myGrid.getselectedrowindex();
        if (index < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const rowData = this.$refs.myGrid.getrowdata(index);

        this.$refs.myWindow.open("修改客户信息", rowData);
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    }
  }
};
</script>

<style scoped>
</style>
