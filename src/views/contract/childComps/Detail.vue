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
import { Message } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showContractDetails } from "@/network/contract.js";
export default {
  name: "Detail",
  components: {
    JqxGrid,
  },
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      datafields: [
        { name: "id", type: "number" },
        { name: "create_date", type: "string" },
        { name: "salesman", type: "number" },
        { name: "salesman_name", type: "string" },
        { name: "salesman_company", type: "string" },
        { name: "salesman_agency", type: "string" },
        { name: "contract_number", type: "string" },
        { name: "project_name", type: "string" },
        { name: "customer_company", type: "string" },
        { name: "customer", type: "number" },
        { name: "customer_name", type: "string" },
        { name: "customer_phone", type: "string" },
        { name: "province", type: "string" },
        { name: "city", type: "string" },
        { name: "county", type: "string" },
        { name: "original_price", type: "number" },
        { name: "discount_price", type: "number" },
        { name: "final_price", type: "number" },
        { name: "reserve_price", type: "number" },
        { name: "logistics_management_fee", type: "string" },
        { name: "freight", type: "string" },
        { name: "tax", type: "string" },
        { name: "warranty", type: "string" },
        { name: "sign_status", type: "string" },
        { name: "sign_date", type: "string" },
        { name: "sign_back_date", type: "string" },
        { name: "formula_model", type: "string" },
        { name: "order_amount", type: "number" },
        { name: "delivery_amount", type: "number" },
        { name: "execute_status", type: "string" },
        { name: "rise_drop_point", type: "string" },
        { name: "deduction_bonus_amount", type: "string" },
        { name: "performance_bonus_reimbursement", type: "string" },
        { name: "is_repeat", type: "string" },
        { name: "over_budget_bear", type: "string" },
        { name: "creator", type: "string" },
        { name: "creator_name", type: "string" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/contrDtl/showContractDetails.do`,
    };
  },
  data() {
    const that = this;
    return {
      permissions: [],
      //数据网格
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data;
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          showContractDetails(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            });
          });
        },
        beforeLoadComplete(records) {
          records.map((element) => {
            const orderAmount =
              element["order_amount"] == null ? 0 : element["order_amount"];
            const contractAmount = element["final_price"];
            const deliveryAmount = element["delivery_amount"];
            if (
              orderAmount > 0 &&
              orderAmount == deliveryAmount &&
              orderAmount >= contractAmount
            ) {
              element["execution_state"] = "已完成";
            } else if (orderAmount > 0) {
              element["execution_state"] = "执行中";
            } else {
              element["execution_state"] = "未执行";
            }
            //获得加点情况
            const beforeDiscountPrice = element["original_price"];
            const reservePrice = element["reserve_price"];
            const afterDiscountPrice = element["discount_price"];
            let addPointDetails;
            if (beforeDiscountPrice == reservePrice) {
              addPointDetails = "底价就是报价;";
            } else if (beforeDiscountPrice > reservePrice) {
              let point = eval(
                "(1-" + reservePrice + "/" + beforeDiscountPrice + ")*100"
              );
              point = point.toFixed(2) + "%";
              addPointDetails = "底价+" + point + "报价;";
            } else {
              let point = eval(
                "(1-" + beforeDiscountPrice + "/" + reservePrice + ")*100"
              );
              point = point.toFixed(2) + "%";
              addPointDetails = "底价-" + point + "报价;";
            }

            if (beforeDiscountPrice > afterDiscountPrice) {
              let point = eval(
                "(1-" + afterDiscountPrice + "/" + beforeDiscountPrice + ")*100"
              );
              point = point.toFixed(2) + "%";
              addPointDetails += "合同单价总体优惠" + point + ";";
            }
            if (beforeDiscountPrice < afterDiscountPrice) {
              let point = eval(
                "(1-" + beforeDiscountPrice + "/" + afterDiscountPrice + ")*100"
              );
              point = point.toFixed(2) + "%";
              addPointDetails += "合同单价上调" + point + ";";
            }
            if (beforeDiscountPrice == afterDiscountPrice) {
              addPointDetails += "合同总体无优惠";
            }
            element["add_point_detail"] = addPointDetails;
          });
        },
      }),
      rendergridrows: function (obj) {
        return obj.data;
      },
      columns: (function () {
        const columns = [];
        columns.push({
          text: "创建日期",
          datafield: "create_date",
          cellsformat: "yyyy-MM-dd",
          align: "center",
          cellsalign: "center",
          pinned: true,
          width: 100,
        });
        columns.push({
          text: "是否重复",
          datafield: "is_repeat",
          align: "center",
          cellsalign: "center",
          width: 100,
          pinned: true,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == "常规") {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                "</span>"
              );
            } else {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #ff0000;">' +
                value +
                "</span>"
              );
            }
          },
        });
        columns.push({
          text: "大区",
          datafield: "salesman_company",
          align: "center",
          cellsalign: "center",
          width: 100,
          pinned: true,
          editable: false,
        });
        columns.push({
          text: "办事处",
          datafield: "salesman_agency",
          align: "center",
          cellsalign: "center",
          width: 100,
          pinned: true,
          editable: false,
        });
        columns.push({
          text: "业务员",
          datafield: "salesman_name",
          align: "center",
          cellsalign: "center",
          pinned: true,
          width: 100,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            return (
              '<span style="width:100%;display:block; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px; color: #FF0202;">' +
              value +
              "</span>"
            );
          },
        });
        columns.push({
          text: "合同编号",
          datafield: "contract_number",
          align: "center",
          cellsalign: "center",
          pinned: true,
          width: 130,
        });
        columns.push({
          text: "项目名称",
          datafield: "project_name",
          align: "center",
          cellsalign: "center",
          pinned: true,
          width: 150,
        });
        if (that.hasAuthority(that, "contrDtl:customer")) {
          columns.push({
            text: "采购人",
            datafield: "customer_name",
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
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #0303FF;">' +
                value +
                "</span>"
              );
            },
          });
        }
        if (that.hasAuthority(that, "contrDtl:contrDtl:customer_company")) {
          columns.push({
            text: "客户公司",
            datafield: "customer_company",
            align: "center",
            cellsalign: "center",
            width: 100,
          });
        }
        if (that.hasAuthority(that, "contrDtl:customer_phone")) {
          columns.push({
            text: "客户电话",
            datafield: "customer_phone",
            align: "center",
            cellsalign: "center",
            width: 120,
          });
        }
        columns.push({
          text: "省",
          datafield: "province",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "市",
          datafield: "city",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "县",
          datafield: "county",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "报价",
          datafield: "original_price",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "成交价格",
          datafield: "final_price",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "底价",
          datafield: "reserve_price",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "物流管理费",
          datafield: "logistics_management_fee",
          align: "center",
          cellsalign: "center",
          width: 110,
        });
        columns.push({
          text: "运费",
          datafield: "freight",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "税金",
          datafield: "tax",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "质保金",
          datafield: "warranty",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "签订状态",
          datafield: "sign_status",
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
            if (value == "已签") {
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
        });
        columns.push({
          text: "签订日期",
          datafield: "sign_date",
          cellsformat: "yyyy-MM-dd",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "签回日期",
          datafield: "sign_back_date",
          cellsformat: "yyyy-MM-dd",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "价格方案",
          datafield: "formula_model",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        if (that.hasAuthority(that, "contrDtl:order_amount")) {
          columns.push({
            text: "下单金额",
            datafield: "order_amount",
            align: "center",
            cellsalign: "center",
            width: 110,
          });
        }
        if (that.hasAuthority(that, "contrDtl:delivery_amount")) {
          columns.push({
            text: "送货金额",
            datafield: "delivery_amount",
            align: "center",
            cellsalign: "center",
            width: 100,
          });
        }
        columns.push({
          text: "执行状态",
          datafield: "execution_state",
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
            if (value == "已完成") {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                "</span>"
              );
            }
            if (value == "执行中") {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #9CD7FF;">' +
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
        });
        columns.push({
          text: "加点情况",
          datafield: "add_point_detail",
          align: "center",
          cellsalign: "center",
          width: 250,
        });
        columns.push({
          text: "非3C风阀",
          datafield: "deduction_bonus_amount",
          align: "center",
          cellsalign: "center",
          width: 150,
        });
        columns.push({
          text: "业绩奖金报销",
          datafield: "performance_bonus_reimbursement",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "降点情况",
          datafield: "rise_drop_point",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "超点承担",
          datafield: "over_budget_bear",
          align: "center",
          cellsalign: "center",
          width: 100,
        });
        columns.push({
          text: "创建者",
          datafield: "creator_name",
          align: "center",
          cellsalign: "center",
          pinned: false,
          width: 100,
        });

        return columns;
      })(),
    };
  },
  methods: {
    createButtonsContainers: function (statusbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      statusbar[0].appendChild(buttonsContainer);

      // 创建添加按钮
      if (this.hasAuthority(this, "contrDtl:add")) {
        let addButtonContainer = document.createElement("div");
        addButtonContainer.id = "addButton";
        addButtonContainer.style.cssText = "float: left; margin-left: 5px;";
        buttonsContainer.appendChild(addButtonContainer);
        let addButton = jqwidgets.createInstance("#addButton", "jqxButton", {
          imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
        });
        let addButtonTooltip = jqwidgets.createInstance(
          "#addButton",
          "jqxTooltip",
          { content: "添加", position: "bottom" }
        );
        addButton.addEventHandler("click", (event) => {
          this.$refs.customerWindow.open("添加客户信息");
        });
      }

      // 创建删除按钮
      if (this.hasAuthority(this, "contrDtl:delete")) {
        let deleteButtonContainer = document.createElement("div");
        deleteButtonContainer.id = "deleteButton";
        deleteButtonContainer.style.cssText = "float: left; margin-left: 5px;";
        buttonsContainer.appendChild(deleteButtonContainer);
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

        deleteButton.addEventHandler("click", (event) => {
          let selectedrowindex = this.$refs.myGrid.getselectedrowindex();
          if (selectedrowindex < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED });
            return false;
          }
          let id = this.$refs.myGrid.getrowid(selectedrowindex);
          this.$refs.myGrid.deleterow(id);
        });
      }

      // 创建修改按钮
      if (this.hasAuthority(this, "contrDtl:update")) {
        console.log(1);
        let editButtonContainer = document.createElement("div");
        editButtonContainer.id = "editButton";
        editButtonContainer.style.cssText = "float: left; margin-left: 5px;";
        buttonsContainer.appendChild(editButtonContainer);
        let editButton = jqwidgets.createInstance("#editButton", "jqxButton", {
          imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
        });
        let editButtonTooltip = jqwidgets.createInstance(
          "#editButton",
          "jqxTooltip",
          { content: "编辑", position: "bottom" }
        );
        editButton.addEventHandler("click", (event) => {
          const index = this.$refs.myGrid.getselectedrowindex();
          if (index < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED });
            return false;
          }
          const rowData = this.$refs.myGrid.getrowdata(index);
          console.log(rowData);
          this.$refs.myWindow.open("修改合同信息", rowData);
        });
      }

      // 创建导出按钮
      if (this.hasAuthority(this, "contrDtl:export")) {
        let exportButtonContainer = document.createElement("div");
        exportButtonContainer.id = "exportButton";
        exportButtonContainer.style.cssText = "float: left; margin-left: 5px;";
        buttonsContainer.appendChild(exportButtonContainer);
        let exportButton = jqwidgets.createInstance(
          "#exportButton",
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/export.svg`),
          }
        );
        let exportButtonTooltip = jqwidgets.createInstance(
          "#exportButton",
          "jqxTooltip",
          { content: "导出", position: "bottom" }
        );
      }
      // 创建上传按钮
      if (this.hasAuthority(this, "contrAnnex:upload")) {
        let uploadButtonContainer = document.createElement("div");
        uploadButtonContainer.id = "uploadButton";
        uploadButtonContainer.style.cssText = "float: left; margin-left: 5px;";
        buttonsContainer.appendChild(uploadButtonContainer);
        let uploadButton = jqwidgets.createInstance(
          "#uploadButton",
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/upload.svg`),
          }
        );
        let uploadButtonTooltip = jqwidgets.createInstance(
          "#uploadButton",
          "jqxTooltip",
          { content: "上传", position: "bottom" }
        );
      }

      // 创建刷新按钮
      let reloadButtonContainer = document.createElement("div");
      reloadButtonContainer.id = "reloadButton";
      reloadButtonContainer.style.cssText = "float: right; margin-left: 5px;";
      buttonsContainer.appendChild(reloadButtonContainer);
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

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
  },
};
</script>

<style scoped>
</style>