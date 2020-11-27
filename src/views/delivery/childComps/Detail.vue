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
      :showstatusbar="true"
      :showaggregates="true"
      :statusbarheight="30"
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
import { showDeliveryDetailList } from "@/network/delivery.js";
export default {
  name: "Detail",
  components: {
    JqxGrid,
    JqxTooltip,
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      dataFields: [
        { name: "id", type: "number" },
        { name: "delivery_date", type: "string" },
        { name: "salesman_company", type: "string" },
        { name: "salesman_agency", type: "string" },
        { name: "salesman_name", type: "string" },
        { name: "salesman", type: "number" },
        { name: "province", type: "string" },
        { name: "city", type: "string" },
        { name: "county", type: "string" },
        { name: "contract_number", type: "string" },
        { name: "contract_amount", type: "number" },
        { name: "order_number", type: "string" },
        { name: "project_name", type: "string" },
        { name: "order_amount", type: "number" },
        { name: "delivery_amount", type: "string" },
        { name: "consideration_commission_order_amount", type: "number" },
        { name: "not_consideration_commission_order_amount", type: "number" },
        { name: "logistics_management_fee", type: "string" },
        { name: "freight", type: "string" },
        { name: "tax", type: "string" },
        { name: "warranty", type: "string" },
        { name: "over_budget_bear", type: "string" },
        { name: "actual_freight", type: "number" },
        { name: "consideration_commission_status", type: "string" },
        { name: "remark", type: "string" },
        { name: "order_area", type: "float" },
        { name: "delivery_area", type: "float" },
      ],
      type: "get",
      datatype: "json",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      id: "id",
      url: `/dlvDtl/showDeliveryDetailList.do`,
    };
  },
  data() {
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data;
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          showDeliveryDetailList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            });
          });
        },
        beforeLoadComplete(records) {
          records.forEach(function (value, index, array) {
            const ordAmt = value["order_amount"];
            const dlvAmt = value["delivery_amount"];
            const logManageFee = value["logistics_management_fee"];
            const freight = value["freight"];
            const tax = value["tax"];
            const warranty = value["warranty"];

            if (logManageFee.indexOf("%") > -1) {
              logManageFee = parseFloat(logManageFee) / 100;
            }

            if (freight.indexOf("%") > -1) {
              freight = parseFloat(freight) / 100;
            }

            if (tax.indexOf("%") > -1) {
              tax = parseFloat(tax) / 100;
            }

            if (warranty.indexOf("%") > -1) {
              warranty = parseFloat(warranty) / 100;
            }

            //计算送货物流管理费
            if (ordAmt == 0) {
              value["delivery_logistics_management_fee"] = 0;
            } else if (logManageFee % 1 === 0) {
              var dlvLogManageFee = (dlvAmt / ordAmt) * logManageFee;
              dlvLogManageFee = Math.round(dlvLogManageFee);
              isNaN(dlvLogManageFee)
                ? (value["delivery_logistics_management_fee"] = 0)
                : (value[
                    "delivery_logistics_management_fee"
                  ] = dlvLogManageFee);
            } else {
              var dlvLogManageFee = dlvAmt * logManageFee;
              dlvLogManageFee = Math.round(dlvLogManageFee);
              isNaN(dlvLogManageFee)
                ? (value["delivery_logistics_management_fee"] = 0)
                : (value[
                    "delivery_logistics_management_fee"
                  ] = dlvLogManageFee);
            }

            //计算送货运费
            if (ordAmt == 0) {
              value["delivery_freight"] = 0;
            } else if (freight % 1 === 0) {
              var dlvFreight = (dlvAmt / ordAmt) * freight;
              dlvFreight = Math.round(dlvFreight);
              isNaN(dlvFreight)
                ? (value["delivery_freight"] = 0)
                : (value["delivery_freight"] = dlvFreight);
            } else {
              var dlvFreight = dlvAmt * freight;
              isNaN(dlvFreight)
                ? (value["delivery_freight"] = 0)
                : (value["delivery_freight"] = Math.round(dlvFreight));
            }
            //计算送货税金
            if (ordAmt == 0) {
              value["delivery_tax"] = 0;
            } else if (tax % 1 === 0) {
              var dlvTax = (dlvAmt / ordAmt) * tax;
              dlvTax = Math.round(dlvTax);
              isNaN(dlvTax)
                ? (value["delivery_tax"] = 0)
                : (value["delivery_tax"] = dlvTax);
            } else {
              var dlvTax = dlvAmt * tax;
              isNaN(dlvTax)
                ? (value["delivery_tax"] = 0)
                : (value["delivery_tax"] = Math.round(dlvTax));
            }
            //计算送货质保金
            if (ordAmt == 0) {
              value["delivery_warranty"] = 0;
            } else if (warranty % 1 === 0) {
              var dlvWrt = (dlvAmt / ordAmt) * warranty;
              dlvWrt = Math.round(dlvWrt);
              isNaN(dlvWrt)
                ? (value["delivery_warranty"] = 0)
                : (value["delivery_warranty"] = dlvWrt);
            } else {
              var dlvWrt = dlvAmt * warranty;
              isNaN(dlvWrt)
                ? (value["delivery_warranty"] = 0)
                : (value["delivery_warranty"] = Math.round(dlvWrt));
            }

            //计算送货底价
            var dlvLogManageFee = value["delivery_logistics_management_fee"];
            var dlvFreight = value["delivery_freight"];
            var dlvTax = value["delivery_tax"];
            var dlvWrt = value["delivery_warranty"];
            var dlvRsvP =
              dlvAmt - dlvLogManageFee - dlvFreight - dlvTax - dlvWrt;
            dlvRsvP = Math.round(dlvRsvP);
            isNaN(dlvRsvP)
              ? (value["delivery_reserve_price"] = 0)
              : (value["delivery_reserve_price"] = dlvRsvP);
            var unDlvAmt = ordAmt - dlvAmt;
            isNaN(unDlvAmt)
              ? (value["undelivered_amount"] = ordAmt)
              : (value["undelivered_amount"] = unDlvAmt);
          });
        },
      }),
      rendergridrows: function (obj) {
        return obj.data;
      },
      columns: [
        {
          text: "送货日期",
          datafield: "delivery_date",
          cellsAlign: "center",
          align: "center",
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
          text: "合同编号",
          datafield: "contract_number",
          align: "center",
          cellsalign: "center",
          width: 150,
        },
        {
          text: "合同金额",
          datafield: "contract_amount",
          align: "center",
          cellsalign: "center",
          width: 100,
        },
        {
          text: "下单编号",
          datafield: "order_number",
          align: "center",
          cellsalign: "center",
          width: 150,
        },
        {
          text: "项目名称",
          datafield: "project_name",
          align: "center",
          cellsalign: "center",
          width: 180,
        },
        {
          text: "下单金额",
          datafield: "order_amount",
          align: "center",
          cellsalign: "center",
          width: 100,
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "送货金额",
          datafield: "delivery_amount",
          cellsAlign: "center",
          align: "center",
          width: 125,
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "物流管理费",
          datafield: "logistics_management_fee",
          cellsAlign: "center",
          align: "center",
          width: 80,
        },
        {
          text: "运费",
          datafield: "freight",
          cellsAlign: "center",
          align: "center",
          width: 80,
        },
        {
          text: "税金",
          datafield: "tax",
          cellsAlign: "center",
          align: "center",
          width: 80,
        },
        {
          text: "质保金",
          datafield: "warranty",
          cellsAlign: "center",
          align: "center",
          width: 80,
          editable: false,
        },
        {
          text: "送货物流管理费",
          datafield: "delivery_logistics_management_fee",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "送货运费",
          datafield: "delivery_freight",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "送货税金",
          datafield: "delivery_tax",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "送货质保金",
          datafield: "delivery_warranty",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "送货底价",
          datafield: "delivery_reserve_price",
          cellsAlign: "center",
          align: "center",
          width: 125,
          aggregates: ["sum"],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: "超点承担",
          datafield: "over_budget_bear",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "实际运费",
          datafield: "actual_freight",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "未送货金额",
          datafield: "undelivered_amount",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "计提成状态",
          datafield: "consideration_commission_status",
          cellsAlign: "center",
          align: "center",
          width: 125,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == "已终止") {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                "</span>"
              );
            }
            if (value == "进行中") {
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
        },
        {
          text: "备注",
          datafield: "remark",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "下单面积",
          datafield: "order_area",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
        {
          text: "送货面积",
          datafield: "delivery_area",
          cellsAlign: "center",
          align: "center",
          width: 125,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    createButtonsContainers: function (toolbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      let asyncButtonContainer = document.createElement("div");
      let exportButtonContainer = document.createElement("div");
      let reloadButtonContainer = document.createElement("div");
      asyncButtonContainer.id = "asyncButton";
      exportButtonContainer.id = "exportButton";
      reloadButtonContainer.id = "reloadButton";
      asyncButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      exportButtonContainer.style.cssText =
        "float: left;margin-left: 5px;  cursor: pointer;";
      reloadButtonContainer.style.cssText =
        "float:right;margin-left: 5px;  cursor: pointer;";
      buttonsContainer.appendChild(asyncButtonContainer);
      buttonsContainer.appendChild(exportButtonContainer);
      buttonsContainer.appendChild(reloadButtonContainer);
      toolbar[0].appendChild(buttonsContainer);
      //创建按钮
      let asyncButton = jqwidgets.createInstance("#asyncButton", "jqxButton", {
        imgSrc: require(`@/assets/iconfont/custom/async.svg`),
      });
      jqwidgets.createInstance("#asyncButton", "jqxTooltip", {
        content: "同步数据到服务器",
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