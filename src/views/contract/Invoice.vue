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
import { formatFilter } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { showInvoiceList } from "@/network/contract.js";
export default {
  name: "ContractInvoice",
  components: {
    JqxGrid,
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      dataFields: [
        { name: "id", type: "number" },
        { name: "apply_date", type: "string" },
        { name: "contract_number", type: "string" },
        { name: "project_name", type: "string" },
        { name: "salesman", type: "number" },
        { name: "salesman_name", type: "string" },
        { name: "contract_amount", type: "number" },
        { name: "sign_back_date", type: "string" },
        { name: "invoice_amount", type: "number" },
        { name: "send_date", type: "string" },
        { name: "track_number", type: "string" },
        { name: "send_address", type: "string" },
        { name: "remark", type: "string" },
        { name: "creator_name", type: "string" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/contrInv/showContractInvoiceList.do`,
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
          showInvoiceList(source, serverdata).then((res) => {
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
          text: "申请日期",
          datafield: "apply_date",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "合同编号",
          datafield: "contract_number",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "项目名称",
          datafield: "project_name",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "业务员",
          datafield: "salesman_name",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "合同金额",
          datafield: "contract_amount",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "签回日期",
          datafield: "sign_back_date",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "发票金额",
          datafield: "invoice_amount",
          align: "center",
          cellsalign: "center",
          aggregates: ["sum"],
          aggregatesrenderer: function (aggregates, column, element) {
            var renderString = "";
            $.each(aggregates, function (key, value) {
              value = dataAdapter.formatNumber(value, "d2");
              renderString +=
                '<div style="position: relative; line-height: 30px; text-align: center; overflow: hidden;">' +
                "合计" +
                ": " +
                value +
                "</div>";
            });
            return renderString;
          },
        },
        {
          text: "寄出日期",
          datafield: "send_date",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "快递单号",
          datafield: "track_number",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "寄出地址",
          datafield: "send_address",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "备注",
          datafield: "remark",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "登记人",
          datafield: "creator_name",
          align: "center",
          cellsalign: "center",
        },
      ],
    };
  },
  methods: {
    createButtonsContainers: function (toolbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      let deleteButtonContainer = document.createElement("div");
      let exportButtonContainer = document.createElement("div");
      let reloadButtonContainer = document.createElement("div");
      deleteButtonContainer.id = "deleteButton";
      exportButtonContainer.id = "exportButton";
      reloadButtonContainer.id = "reloadButton";
      deleteButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      exportButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      reloadButtonContainer.style.cssText =
        "float:right;margin-left: 5px;  cursor: pointer;";

      buttonsContainer.appendChild(deleteButtonContainer);
      buttonsContainer.appendChild(exportButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      toolbar[0].appendChild(buttonsContainer);
      //创建按钮

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

      let reloadButton = jqwidgets.createInstance(
        "#reloadButton",
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      jqwidgets.createInstance("#reloadButton", "jqxTooltip", {
        content: "刷新",
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

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
  },
};
</script>

<style scoped>
.base-tab-content-element {
  height: calc(100vh - 105px);
}
</style>