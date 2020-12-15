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
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";

import { formatFilter } from "@/common/util.js";
import { Message, ADD_USER, EDIT_USER } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showUserList } from "@/network/user.js";
export default {
  components: {
    JqxGrid
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "user_id", type: "number" },
        { name: "account", type: "string" },
        { name: "user_name", type: "string" },
        { name: "role_name", type: "string" },
        { name: "gender", type: "string" },
        { name: "locked", type: "string" }
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "user_id",
      sortdirection: "asc",
      id: "user_id",
      url: `/user/showUserList.do`
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
          showUserList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total
            });
          });
        },
        beforeLoadComplete(records) {}
      }),
      rendergridrows: function(obj) {
        return obj.data;
      },
      columns: [
        {
          text: "账号",
          datafield: "account",
          align: "center",
          cellsalign: "center",
          editable: false
        },
        {
          text: "姓名",
          datafield: "user_name",
          align: "center",
          cellsalign: "center",
          editable: false
        },
        {
          text: "性别",
          datafield: "gender",
          align: "center",
          cellsalign: "center",
          editable: false
        },
        {
          text: "启用状态",
          datafield: "locked",
          columntype: "dropdownlist",
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

      addButtonContainer.style.cssText = "float: left; margin-left: 5px;cursor: pointer;";
      deleteButtonContainer.style.cssText = "float: left; margin-left: 5px;cursor: pointer;";
      editButtonContainer.style.cssText = "float: left; margin-left: 5px;cursor: pointer;";
      reloadButtonContainer.style.cssText = "float: right; margin-left: 5px;cursor: pointer;";

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
        this.$refs.myWindow.open(ADD_USER);
      });

      deleteButton.addEventHandler("click", (event) => {
        const selectedrowindex = this.$refs.myGrid.getselectedrowindex();
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const id = this.$refs.myGrid.getrowid(selectedrowindex);
        this.$refs.myGrid.deleterow(id);
      });

      editButton.addEventHandler("click", (event) => {
        const index = this.$refs.myGrid.getselectedrowindex();
        if (index < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const rowData = this.$refs.myGrid.getrowdata(index);
        this.$refs.myWindow.open(EDIT_USER, rowData);
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    }
  }
};
</script>

<style scoped>
.base-tab-content-element {
  height: calc(100vh - 105px);
}
</style>
