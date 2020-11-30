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
      :pagesize="25"
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
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";

import { getLocalization } from "@/common/localization.js";
import { formatFilter, dataExport } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { showDetailList } from "@/network/quote.js";
export default {
  name: "QuoteDetail",
  components: {
    JqxGrid,
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      dataFields: [
        { name: "qtn_dtl_id", type: "number" },
        { name: "quoter", type: "number" },
        { name: "quoter_name", type: "string" },
        { name: "quote_date", type: "string" },
        { name: "salesman", type: "number" },
        { name: "salesman_name", type: "string" },
        { name: "salesman_company", type: "string" },
        { name: "salesman_organization", type: "string" },
        { name: "salesman_agency", type: "string" },
        { name: "project_name", type: "string" },
        { name: "province", type: "string" },
        { name: "city", type: "string" },
        { name: "county", type: "string" },
        { name: "client_company", type: "string" },
        { name: "client_name", type: "string" },
        { name: "client_phone", type: "string" },
        { name: "reserve_price", type: "number" },
        { name: "quote_price", type: "number" },
        { name: "brokerage", type: "string" },
        { name: "freight", type: "string" },
        { name: "tax", type: "string" },
        { name: "region_tax", type: "string" },
        { name: "controlbox_reserve_price", type: "number" },
        { name: "controlbox_quote_price", type: "number" },
        { name: "formula", type: "string" },
        { name: "repeat", type: "string" },
        { name: "remark", type: "string" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "qtn_dtl_id",
      sortdirection: "desc",
      id: "qtn_dtl_id",
      url: `/qtnDtl/showQuotationDetails.do`,
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
          showDetailList(source, serverdata).then((res) => {
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
          text: "报价日期",
          datafield: "quote_date",
          cellsformat: "yyyy-MM-dd",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "报价人",
          datafield: "quoter_name",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "大区",
          datafield: "salesman_company",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "办事处",
          datafield: "salesman_agency",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "业务员",
          datafield: "salesman_name",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "项目名称",
          datafield: "project_name",
          align: "center",
          cellsalign: "center",
          width: 180,
        },
        {
          text: "省",
          datafield: "province",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "市",
          datafield: "city",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "县",
          datafield: "county",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "客户公司",
          datafield: "client_company",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "客户姓名",
          datafield: "client_name",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "客户电话",
          datafield: "client_phone",
          align: "center",
          cellsalign: "center",
          width: 120,
        },
        {
          text: "底价",
          datafield: "reserve_price",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "报价",
          datafield: "quote_price",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "控制箱底价",
          datafield: "controlbox_reserve_price",
          align: "center",
          cellsalign: "center",
          width: 110,
        },
        {
          text: "控制箱报价",
          datafield: "controlbox_quote_price",
          align: "center",
          cellsalign: "center",
          width: 110,
        },
        {
          text: "佣金",
          datafield: "brokerage",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "运费",
          datafield: "freight",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "税金",
          datafield: "tax",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "地区点",
          datafield: "region_tax",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "价格方案",
          datafield: "formula",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "重复",
          datafield: "repeat",
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
            if (value == "常规") {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                "常规" +
                "</span>"
              );
            } else {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #ff0000;">' +
                "重复" +
                "</span>"
              );
            }
          },
        },
        {
          text: "备注",
          datafield: "remark",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
      ],
    };
  },
  methods: {
    createButtonsContainers: function (toolbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      toolbar[0].appendChild(buttonsContainer);
      // 创建删除按钮
      if (this.hasAuthority(this, "qtnDtl:delete")) {
        let deleteButtonContainer = document.createElement("div");
        deleteButtonContainer.id = "deleteButton";
        deleteButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(deleteButtonContainer);
        let deleteButton = jqwidgets.createInstance(
          "#deleteButton",
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
          }
        );
        jqwidgets.createInstance("#deleteButton", "jqxTooltip", {
          content: "删除",
          position: "bottom",
        });
        //绑定事件
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
      // 创建导出按钮
      if (this.hasAuthority(this, "qtnDtl:export")) {
        let exportButtonContainer = document.createElement("div");
        exportButtonContainer.id = "exportButton";
        exportButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(exportButtonContainer);
        let exportButton = jqwidgets.createInstance(
          "#exportButton",
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/export.svg`),
          }
        );
        jqwidgets.createInstance("#exportButton", "jqxTooltip", {
          content: "导出",
          position: "bottom",
        });
        exportButton.addEventHandler("click", () => {
          const columns = this.$refs.myGrid.columns;
          const rowsData = this.$refs.myGrid.getrows();
          dataExport("报价数据汇总.xlsx", columns, rowsData);
        });
      }

      // 创建刷新按钮
      let reloadButtonContainer = document.createElement("div");
      reloadButtonContainer.id = "reloadButton";
      reloadButtonContainer.style.cssText =
        "float:right;margin-left: 5px;  cursor: pointer;";
      buttonsContainer.appendChild(reloadButtonContainer);
      let reloadButton = jqwidgets.createInstance(
        "#reloadButton",
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      jqwidgets.createInstance("#reloadButton", "jqxTooltip", {
        content: "刷新",
        position: "bottom",
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