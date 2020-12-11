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
      :rowdetails="true"
      :initrowdetails="initrowdetails"
      :rowdetailstemplate="rowdetailstemplate"
    >
      >
    </JqxGrid>
    <employee-window ref="myWindow"></employee-window>
    <assign-window ref="assignWindow"></assign-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";
import EmployeeWindow from "./childComps/EmployeeWindow";
import AssignWindow from "./childComps/AssignPositionWindow";

import { formatFilter } from "@/common/util.js";
import { getLocalization } from "@/common/localization.js";

import {
  Message,
  ADD_EMPLOYEE,
  EDIT_EMPLOYEE,
  ASSIGN_POSITION,
} from "@/common/const.js";

import {
  showEmployeeList,
  deleteEmployee,
  showEmployeePosition,
} from "@/network/employee.js";

export default {
  name: "Employee",
  components: {
    JqxGrid,
    JqxTooltip,
    EmployeeWindow,
    AssignWindow,
  },
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "emp_id", type: "string" },
        { name: "emp_name", type: "string" },
        { name: "dept_id", type: "number" },
        { name: "dept_name", type: "string" },
        { name: "gender", type: "string" },
        { name: "phone", type: "string" },
        { name: "id_card", type: "string" },
        { name: "entry_date", type: "string" },
        { name: "company", type: "string" },
        { name: "organization", type: "string" },
        { name: "agency", type: "string" },
        { name: "is_resign", type: "string" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "emp_id",
      sortdirection: "desc",
      id: "emp_id",
      url: `/emp/showEmployeeList.do`,
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
          showEmployeeList(source.url, source, serverdata).then((res) => {
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
          text: "员工名称",
          datafield: "emp_name",
          editable: false,
          align: "center",
          cellsalign: "center",
        },
        {
          text: "所属部门",
          datafield: "dept_name",
          editable: false,
          align: "center",
          cellsalign: "center",
        },
        {
          text: "大区",
          datafield: "company",
          editable: false,
          align: "center",
          cellsalign: "center",
        },
        {
          text: "分部",
          datafield: "agency",
          editable: false,
          align: "center",
          cellsalign: "center",
        },
        {
          text: "性别",
          datafield: "gender",
          editable: false,
          align: "center",
          cellsalign: "center",
        },
        {
          text: "电话",
          datafield: "phone",
          editable: false,
          align: "center",
          cellsalign: "center",
        },
        {
          text: "入职时间",
          datafield: "entry_date",
          cellsformat: "yyyy-MM-dd",
          editable: false,
          align: "center",
          cellsalign: "center",
        },
        {
          text: "在职状态",
          datafield: "is_resign",
          columntype: "dropdownlist",
          align: "center",
          cellsalign: "center",
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == "离职") {
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
          },
        },
      ],
      rowdetailstemplate: {
        rowdetails:
          "<div style='margin: 10px;'>" +
          "<ul style='margin-left: 30px;'>" +
          "<li class='title'></li>" +
          "<li>职位</li>" +
          "</ul>" +
          "<div class='information'>" +
          "</div>" +
          "<div class='position'></div>" +
          "</div>",
        rowdetailsheight: 200,
      },
    };
  },
  methods: {
    createButtonsContainers: function (statusbar) {
      const that = this;

      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";

      let addButtonContainer = document.createElement("div");
      let deleteButtonContainer = document.createElement("div");
      let editButtonContainer = document.createElement("div");
      let reloadButtonContainer = document.createElement("div");
      let assignButtonContainer = document.createElement("div");

      const addButtonID = JQXLite.generateID();
      const deleteButtonID = JQXLite.generateID();
      const editButtonID = JQXLite.generateID();
      const reloadButtonID = JQXLite.generateID();
      const assignButtonID = JQXLite.generateID();

      addButtonContainer.id = addButtonID;
      deleteButtonContainer.id = deleteButtonID;
      editButtonContainer.id = editButtonID;
      assignButtonContainer.id = reloadButtonID;
      reloadButtonContainer.id = assignButtonID;

      addButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      deleteButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      editButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      assignButtonContainer.style.cssText = "float: left; margin-left: 5px;";
      reloadButtonContainer.style.cssText = "float: right; margin-left: 5px;";

      buttonsContainer.appendChild(addButtonContainer);
      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(editButtonContainer);
      buttonsContainer.appendChild(assignButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      statusbar[0].appendChild(buttonsContainer);
      //创建按钮
      let addButton = jqwidgets.createInstance(`#${addButtonID}`, "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
      });
      jqwidgets.createInstance(`#${addButtonID}`, "jqxTooltip", {
        content: "添加",
        position: "bottom",
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

      let editButton = jqwidgets.createInstance(
        `#${editButtonID}`,
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
        }
      );
      let editButtonTooltip = jqwidgets.createInstance(
        `#${editButtonID}`,
        "jqxTooltip",
        { content: "编辑", position: "bottom" }
      );

      let assignButton = jqwidgets.createInstance(
        `#${assignButtonID}`,
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/assign.svg`),
        }
      );
      jqwidgets.createInstance(`#${assignButtonID}`, "jqxTooltip", {
        content: "职位分配",
        position: "bottom",
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

      //绑定事件
      addButton.addEventHandler("click", (event) => {
        this.$refs.myWindow.open(ADD_EMPLOYEE);
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
            const ids = [];
            selectedIndexes.forEach(function (value) {
              const id = that.$refs.myGrid.getrowid(value);
              ids.push(id);
            });
            that.delete(ids);
          },
          onCancel() {},
          class: "test",
        });
      });

      editButton.addEventHandler("click", (event) => {
        const index = this.$refs.myGrid.getselectedrowindex();
        if (index < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED });
          return false;
        }
        const rowData = this.$refs.myGrid.getrowdata(index);
        this.$refs.myWindow.open(EDIT_EMPLOYEE, rowData);
      });

      // 分配职位
      assignButton.addEventHandler("click", (event) => {
        const selectedIndexes = this.$refs.myGrid.getselectedrowindexes();
        if (selectedIndexes.length < 1) {
          this.$message.warning(Message.NO_ROWS_SELECTED);
          return false;
        }
        if (selectedIndexes.length > 1) {
          this.$message.warning(Message.LIMIT_ONE_ROW);
          return false;
        }
        const empId = this.$refs.myGrid.getrowid(selectedIndexes[0]);
        this.$refs.assignWindow.open(ASSIGN_POSITION, empId);
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    initrowdetails(index, parentElement, gridElement, datarecord) {
      let tabsdiv,
        information,
        position = null;
      tabsdiv = $($(parentElement).children()[0]);
      if (tabsdiv != null) {
        information = tabsdiv.find(".information");
        position = tabsdiv.find(".position");
        const title = tabsdiv.find(".title");
        title.text(datarecord.emp_name);
        const container = $('<div style="margin: 5px;"></div>');
        container.appendTo($(information));
        const photoColumn = $('<div style="float: left; width: 15%;"></div>');
        const leftColumn = $('<div style="float: left; width: 45%;"></div>');
        const rightColumn = $('<div style="float: left; width: 40%;"></div>');
        container.append(photoColumn);
        container.append(leftColumn);
        container.append(rightColumn);
        const photo = $(
          "<div class='jqx-rc-all' style='margin: 10px;'><b>照片：</b></div>"
        );
        const image = $("<div style='margin-top: 10px;'></div>");
        let imgUrl = "../../script/images/";
        imgUrl += datarecord.gender == "男" ? "male.png" : "female.png";
        const img = $('<img height="60" src="' + imgUrl + '"/>');
        image.append(img);
        image.appendTo(photo);
        photoColumn.append(photo);
        const empName =
          "<div style='margin: 10px;'><b>姓名：</b> " +
          datarecord.emp_name +
          "</div>";
        const phone =
          "<div style='margin: 10px;'><b>电话：</b> " +
          datarecord.phone +
          "</div>";
        const idCard =
          "<div style='margin: 10px;'><b>身份证：</b> " +
          datarecord.id_card +
          "</div>";
        const entryDate =
          "<div style='margin: 10px;'><b>入职日期：</b> " +
          datarecord.entry_date +
          "</div>";
        $(leftColumn).append(empName);
        $(leftColumn).append(phone);
        $(leftColumn).append(idCard);
        $(leftColumn).append(entryDate);

        const department =
          "<div style='margin: 10px;'><b>部门：</b> " +
          datarecord.dept_name +
          "</div>";
        const company =
          "<div style='margin: 10px;'><b>公司：</b> " +
          datarecord.company +
          "</div>";
        const agency =
          "<div style='margin: 10px;'><b>办事处：</b> " +
          datarecord.agency +
          "</div>";
        $(rightColumn).append(department);
        $(rightColumn).append(company);
        $(rightColumn).append(agency);

        const positionGrid = $("<div></div>");
        $(position).append(positionGrid);
        $(tabsdiv).jqxTabs({
          width: "95%",
          height: 170,
          initTabContent: function (tab) {
            if (tab == 1) {
              const empId = datarecord.uid.toString();
              const jsonParams = {};
              jsonParams.empId = empId;
              const source = {
                dataFields: [
                  { name: "pos_name", type: "string" },
                  { name: "pos_id", type: "number" },
                ],
                url: "/emp/getPositionListByEmployee.do",
                type: "get",
                data: { jsonParams: JSON.stringify(jsonParams) },
                dataType: "json",
                id: "id",
                async: false,
              };
              const nestedGridAdapter = new $.jqx.dataAdapter(source, {
                formatData: function (data) {
                  return data;
                },
                loadServerData: function (serverdata, source, callback) {
                  serverdata = formatFilter(serverdata);
                  showEmployeePosition(source.url, source, serverdata).then(
                    (res) => {
                      callback({
                        records: res.rows,
                        totalrecords: res.total,
                      });
                    }
                  );
                },
              });

              jqwidgets.createInstance(positionGrid, "jqxGrid", {
                source: nestedGridAdapter,
                width: "100%",
                height: "100%",
                localization: getLocalization("zh-CN"),
                columns: [
                  {
                    text: "职位名称",
                    datafield: "pos_name",
                    cellsAlign: "center",
                    align: "center",
                  },
                ],
              });
            }
          },
        });
      }
    },
    delete(ids) {
      const params = {
        jsonParams: JSON.stringify({
          items: ids,
        }),
      };
      deleteEmployee(params).then((res) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    refresh() {
      this.$refs.myGrid.updatebounddata();
    },
  },
};
</script>

<style scoped>
.base-tab-content-element {
  height: calc(100vh - 103px);
}
</style>