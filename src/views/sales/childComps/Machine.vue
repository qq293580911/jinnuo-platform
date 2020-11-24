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
      :columnsresize="true"
      :columnsautoresize="true"
      :showgroupaggregates="true"
      :showstatusbar="true"
      :statusBarHeight="30"
      :showaggregates="true"
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";

import { formatFilter, dataExport } from "@/common/util.js";
import { Message } from "@/common/const.js";
import { getLocalization } from "@/common/localization.js";
import { showMachineList } from "@/network/sales.js";
export default {
  name: "SalesMachine",
  components: {
    JqxGrid,
    JqxTooltip,
  },
  beforeCreate() {
    this.params = {
      startDate: (function () {
        return "2020-10-01";
      })(),
      endDate: (function () {
        return "2020-10-31";
      })(),
    };

    this.source = {
      datafields: [
        { name: "salesman_company", type: "string" },
        { name: "salesman_agency", type: "string" },
        { name: "salesman", type: "string" },
        { name: "is_resign", type: "string" },
        { name: "quotation_count", type: "number" },
        { name: "quotation_amount", type: "number" },
        { name: "contract_count", type: "number" },
        { name: "contract_amount", type: "number" },
        { name: "order_amount", type: "number" },
        { name: "order_reserve_price", type: "number" },
        { name: "delivery_amount", type: "number" },
        { name: "delivery_reserve_price", type: "number" },
      ],
      url: "/sales/showSalesMachine.do",
      type: "get",
      datatype: "json",
    };
  },
  data() {
    const that = this;
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data;
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          serverdata.jsonParams = JSON.stringify(that.params);
          showMachineList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            });
          });
        },
        beforeLoadComplete(records) {},
      }),
      columns: [
        {
          text: "大区",
          datafield: "salesman_company",
          cellsAlign: "center",
          align: "center",
          width: 100,
        },
        {
          text: "办事处",
          datafield: "salesman_agency",
          cellsAlign: "center",
          align: "center",
          width: 100,
        },
        {
          text: "业务员",
          datafield: "salesman",
          cellsAlign: "center",
          align: "center",
          aggregates: ["count"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "在职状态",
          datafield: "is_resign",
          cellsAlign: "center",
          align: "center",
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == "在职") {
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
        },
        {
          text: "报价份数",
          datafield: "quotation_count",
          cellsAlign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "报价金额",
          datafield: "quotation_amount",
          cellsAlign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "合同份数",
          datafield: "contract_count",
          cellsAlign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "合同金额",
          datafield: "contract_amount",
          cellsAlign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "下单金额",
          datafield: "order_amount",
          cellsAlign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "下单底价",
          datafield: "order_reserve_price",
          cellsAlign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "送货金额",
          datafield: "delivery_amount",
          cellsAlign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "送货底价",
          datafield: "delivery_reserve_price",
          cellsAlign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    createButtonsContainers: function (statusbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      let startDateContainer = document.createElement("div");
      let endDateContainer = document.createElement("div");
      let exportButtonContainer = document.createElement("div");
      let reloadButtonContainer = document.createElement("div");
      startDateContainer.id = "startDate";
      endDateContainer.id = "endDate";
      exportButtonContainer.id = "exportButton";
      reloadButtonContainer.id = "reloadButton";
      startDateContainer.style.cssText =
        "float: left; margin-left: 5px;cursor: pointer;";
      endDateContainer.style.cssText =
        "float: left; margin-left: 5px;cursor: pointer;";
      exportButtonContainer.style.cssText =
        "float: left; margin-left: 5px;cursor: pointer;";
      reloadButtonContainer.style.cssText =
        "float:right;margin-left: 5px;  cursor: pointer;";

      buttonsContainer.appendChild(startDateContainer);
      // buttonsContainer.appendChild(<span>-</span>);
      buttonsContainer.appendChild(endDateContainer);
      buttonsContainer.appendChild(exportButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      statusbar[0].appendChild(buttonsContainer);
      //创建部件
      const startDate = jqwidgets.createInstance(
        "#startDate",
        "jqxDateTimeInput",
        {
          width: 150,
          formatString: "yyyy-MM-dd",
          value: new Date(this.params.startDate),
        }
      );

      const endDate = jqwidgets.createInstance("#endDate", "jqxDateTimeInput", {
        width: 150,
        formatString: "yyyy-MM-dd",
        value: new Date(this.params.endDate),
      });

      let exportButton = jqwidgets.createInstance(
        "#exportButton",
        "jqxButton",
        {
          imgSrc: require(`@/assets/iconfont/custom/export.svg`),
        }
      );

      startDate.addEventHandler("change", (event) => {
        this.params.startDate = event.target.value;
        this.$refs.myGrid.updatebounddata();
      });

      endDate.addEventHandler("change", (event) => {
        this.params.endDate = event.target.value;
        this.$refs.myGrid.updatebounddata();
      });

      exportButton.addEventHandler("click", (event) => {
        let rowsData = this.$refs.myGrid.getrows();
        let columns = this.$refs.myGrid.columns;
        dataExport("销售统计-设备.xlsx", columns, rowsData);
      });

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
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

      reloadButton.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    aggregatesRenderer(aggregates, column, element) {
      var renderString = "";
      $.each(aggregates, function (key, value) {
        switch (key) {
          case "sum":
            renderString +=
              '<div style="position: relative; line-height: 30px; text-align: center; overflow: hidden;">' +
              "合计" +
              ": " +
              value +
              "</div>";
            break;
        }
      });
      return renderString;
    },
  },
};
</script>

<style scoped>
</style>