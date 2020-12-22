<template>
  <div :style="contentStyle">
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
      :statusbarheight="30"
      :showaggregates="true"
      :rowdetails="true"
      :initrowdetails="initrowdetails"
      :rowdetailstemplate="rowdetailstemplate"
      @cellclick="onCellclick($event)"
    >
    </JqxGrid>
    <JqxMenu
      ref="jqxMenu"
      :mode="'popup'"
      :autoOpenPopup="false"
      :width="120"
      :height="140"
      @itemclick="onItemclick($event)"
    >
      <div>
        <ul>
          <li>添加送货信息</li>
        </ul>
      </div>
    </JqxMenu>
    <order-window ref="orderWindow"></order-window>
    <order-import-window ref="orderImportWindow"></order-import-window>
    <delivery-window
      ref="deliveryWindow"
      :install-fee-disabled="false"
    ></delivery-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue";

import OrderImportWindow from "../childComps/OrderImportWindowMachine";
import OrderWindow from "../childComps/OrderWindowMachine";
import DeliveryWindow from "@/components/content/delivery/DeliveryWindow";

import { getLocalization } from "@/common/localization.js";
import { contentHeight } from '@/common/mixin.js'
import {
  formatFilter,
  calc_misc_log_manage_fee,
  calc_misc_freight,
  calc_misc_tax,
  calc_misc_warranty,
  calc_rsv_p,
  dataExport
} from "@/common/util.js";
import {
  Message,
  ADD_ORDER,
  EDIT_ORDER,
  ADD_DELIVERY,
  EDIT_DELIVERY,
  IMPORT_ORDER
} from "@/common/const.js";
import {
  showMachineOrderList,
  getDeliveryByOrderNumber,
  deleteOrder,
  batahUpdateOrder
} from "@/network/order.js";
import { deleteDelivery } from "@/network/delivery.js";
export default {
  name: "MachineOrder",
  components: {
    JqxGrid,
    JqxMenu,
    OrderWindow,
    OrderImportWindow,
    DeliveryWindow
  },
  mixins:[contentHeight],
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata("filter");
      },
      dataFields: [
        { name: "id", type: "number" },
        { name: "order_date", type: "string" },
        { name: "salesman_company", type: "string" },
        { name: "salesman_organization", type: "string" },
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
        { name: "province", type: "string" },
        { name: "city", type: "string" },
        { name: "county", type: "string" },
        { name: "original_price", type: "number" },
        { name: "final_price", type: "number" },
        { name: "reserve_price", type: "number" },
        { name: "order_amount", type: "number" },
        { name: "order_reserve_price", type: "number" },
        {
          name: "consideration_commission_order_amount",
          type: "number"
        },
        {
          name: "not_consideration_commission_order_amount",
          type: "number"
        },
        { name: "logistics_management_fee", type: "string" },
        { name: "freight", type: "string" },
        { name: "tax", type: "string" },
        { name: "warranty", type: "string" },
        { name: "install_fee", type: "number" },
        { name: "delivery_date", type: "string" },
        { name: "delivery_amount", type: "number" },
        { name: "actual_freight", type: "number" },
        { name: "over_budget_bear", type: "string" },
        {
          name: "consideration_commission_status",
          type: "string"
        },
        { name: "remark", type: "string" },
        { name: "creator", type: "number" }
      ],
      type: "get",
      url: "/ordDtl/showOrderDetailList.do",
      id: "id",
      root: "rows",
      sortcolumn: "id",
      sortdirection: "desc",
      dataType: "json"
    };
  },
  data() {
    const that = this;
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function(data) {
          return data;
        },
        loadServerData: function(serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          showMachineOrderList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total
            });
          });
        },
        beforeLoadComplete(records) {
          records.map((value) => {
            const logMngFee = value["logistics_management_fee"];
            const freight = value["freight"];
            const tax = value["tax"];
            const warranty = value["warranty"];
            const ordAmt = value["order_amount"];
            const dlvAmt = value["delivery_amount"];
            const installFee = value["install_fee"];

            // 计算下单物流管理费
            const ordLogManageFee = calc_misc_log_manage_fee(
              ordAmt,
              installFee,
              logMngFee
            );
            value["order_logistics_management_fee"] = ordLogManageFee;
            // 计算下单税金
            const orderTax = calc_misc_tax(ordAmt, installFee, tax);
            value["order_tax"] = orderTax;
            // 计算下单质保金
            const ordWarranty = calc_misc_warranty(ordAmt, installFee, warranty);
            value["order_warranty"] = ordWarranty;
            // 计算下单运费
            const ordFreight = calc_misc_freight(
              ordAmt,
              installFee,
              ordLogManageFee,
              orderTax,
              ordWarranty,
              freight
            );
            value["order_freight"] = ordFreight;

            // 计算下单底价
            const ordRsvP = calc_rsv_p(
              ordAmt,
              ordLogManageFee,
              ordFreight,
              orderTax,
              ordWarranty,
              installFee
            );
            value["order_reserve_price"] = ordRsvP;

            // 非3C风阀下单金额
            const nCsdCmsOrdAmt =
              value["not_consideration_commission_order_amount"];
            // 计算非3C风阀下单物流管理费
            const nCsdCmsOrdLogMngFee = calc_misc_log_manage_fee(
              nCsdCmsOrdAmt,
              installFee,
              logMngFee
            );
            value[
              "not_consideration_commission_order_logistics_management_fee"
            ] = nCsdCmsOrdLogMngFee;

            // 计算非3C风阀下单税金
            const nCsdCmsOrdTax = calc_misc_tax(nCsdCmsOrdAmt, installFee, tax);
            value["not_consideration_commission_order_tax"] = nCsdCmsOrdTax;

            // 计算非3C风阀下单质保金
            const nCndCmsOrdWrt = calc_misc_warranty(
              nCsdCmsOrdAmt,
              installFee,
              warranty
            );
            value[
              "not_consideration_commission_order_warranty"
            ] = nCndCmsOrdWrt;

            // 计算非3C风阀下单运费
            const nCndCmsOrdFreight = calc_misc_freight(
              nCsdCmsOrdAmt,
              installFee,
              nCsdCmsOrdLogMngFee,
              nCsdCmsOrdTax,
              nCndCmsOrdWrt,
              freight
            );
            value[
              "not_consideration_commission_order_freight"
            ] = nCndCmsOrdFreight;

            // 计算非3C风阀下单底价
            const nCndCmsOrdRsvP = calc_rsv_p(
              nCsdCmsOrdAmt,
              nCsdCmsOrdLogMngFee,
              nCndCmsOrdFreight,
              nCsdCmsOrdTax,
              nCndCmsOrdWrt,
              installFee
            );
            value[
              "not_consideration_commission_order_reserve_price"
            ] = nCndCmsOrdRsvP;

            // 计算送货物流管理费
            const dlvLogManageFee = calc_misc_log_manage_fee(
              dlvAmt,
              installFee,
              logMngFee
            );
            value["delivery_logistics_management_fee"] = dlvLogManageFee;

            // 计算送货税金
            const dlvTax = calc_misc_tax(dlvAmt, installFee, tax);
            value["delivery_tax"] = dlvTax;

            // 计算送货质保金
            const dlvWrt = calc_misc_warranty(dlvAmt, installFee, warranty);
            value["delivery_warranty"] = dlvWrt;

            // 计算送货运费
            const dlvFreight = calc_misc_freight(
              dlvAmt,
              installFee,
              dlvLogManageFee,
              dlvTax,
              dlvWrt,
              freight
            );
            value["delivery_freight"] = dlvFreight;

            // 计算送货底价
            const dlvRsvP = calc_rsv_p(
              dlvAmt,
              dlvLogManageFee,
              dlvFreight,
              dlvTax,
              dlvWrt
            );
            value["delivery_reserve_price"] = dlvRsvP;

            // 非3C风阀送货金额
            let nCsdCmsDlvAmt = 0;
            if (ordAmt == dlvAmt) {
              nCsdCmsDlvAmt = nCsdCmsOrdAmt;
            }
            value[
              "not_consideration_commission_delivery_amount"
            ] = nCsdCmsDlvAmt;

            // 非3C风阀送货物流管理费
            const nCsdCmsDlvLogMngFee = calc_misc_log_manage_fee(
              nCsdCmsDlvAmt,
              installFee,
              logMngFee
            );
            value[
              "not_consideration_commission_delivery_logistics_management_fee"
            ] = nCsdCmsDlvLogMngFee;

            // 非3C风阀送货税金
            const nCsdCmsDlvTax = calc_misc_tax(nCsdCmsDlvAmt, installFee, tax);
            value["not_consideration_commission_delivery_tax"] = nCsdCmsDlvTax;
            // 非3C风阀送货质保金
            const nCsdCmsDlvWrt = calc_misc_warranty(
              nCsdCmsDlvAmt,
              installFee,
              warranty
            );
            value[
              "not_consideration_commission_delivery_warranty"
            ] = nCsdCmsDlvWrt;
            // 非3C风阀送货运费
            const nCsdCmsDlvFreight = calc_misc_freight(
              nCsdCmsDlvAmt,
              installFee,
              nCsdCmsDlvLogMngFee,
              nCsdCmsDlvTax,
              nCsdCmsDlvWrt,
              freight
            );
            value[
              "not_consideration_commission_delivery_freight"
            ] = nCsdCmsDlvFreight;
            // 非3C风阀送货底价
            const nCsdCmsDlvRsvP = calc_rsv_p(
              nCsdCmsDlvAmt,
              nCsdCmsDlvLogMngFee,
              nCsdCmsDlvFreight,
              nCsdCmsDlvTax,
              nCsdCmsDlvWrt
            );
            value[
              "not_consideration_commission_delivery_reserve_price"
            ] = nCsdCmsDlvRsvP;

            // 未送货金额
            const unDlvAmt = ordAmt - dlvAmt;
            isNaN(unDlvAmt)
              ? (value["undelivered_amount"] = ordAmt)
              : (value["undelivered_amount"] = unDlvAmt);
          });
        }
      }),
      rendergridrows: function(obj) {
        return obj.data;
      },
      columns: (function(param) {
        const columns = [];
        columns.push({
          text: "序号",
          sortable: false,
          filterable: false,
          editable: false,
          pinned: true,
          groupable: false,
          draggable: false,
          resizable: false,
          cellsAlign: "center",
          align: "center",
          datafield: "",
          columntype: "number",
          width: 50,
          cellsrenderer: function(row, column, value) {
            return (
              "<div style='margin:4px;text-align:center;'>" +
              (value + 1) +
              "</div>"
            );
          }
        });
        columns.push({
          text: "下单日期",
          datafield: "order_date",
          cellsformat: "yyyy-MM-dd",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "大区",
          datafield: "salesman_company",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "办事处",
          datafield: "salesman_agency",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "业务员",
          datafield: "salesman_name",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "省",
          datafield: "province",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "市",
          datafield: "city",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "县",
          datafield: "county",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "合同编号",
          datafield: "contract_number",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 150
        });
        columns.push({
          text: "合同金额",
          datafield: "contract_amount",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "下单编号",
          datafield: "order_number",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 150
        });
        columns.push({
          text: "项目名称",
          datafield: "project_name",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          width: 200
        });
        columns.push({
          text: "下单金额",
          datafield: "order_amount",
          align: "center",
          cellsalign: "center",
          cellclassname: that.cellClass,
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer,
          width: 100
        });
        if (
          that.hasAuthority(
            that,
            "ordDtl:consideration_commission_order_amount"
          )
        ) {
          columns.push({
            text: "3C风阀下单金额",
            datafield: "consideration_commission_order_amount",
            cellsAlign: "center",
            align: "center",
            cellclassname: that.cellClass,
            width: 125,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (
          that.hasAuthority(
            that,
            "ordDtl:not_consideration_commission_order_amount"
          )
        ) {
          columns.push({
            text: "非3C风阀下单金额",
            datafield: "not_consideration_commission_order_amount",
            cellsAlign: "center",
            align: "center",
            cellclassname: that.cellClass,
            width: 125,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }

        if (that.hasAuthority(that, "ordDtl:tax")) {
          columns.push({
            text: "税金",
            datafield: "tax",
            cellsAlign: "center",
            align: "center",
            width: 80,
            cellclassname: that.cellClass,
            cellsrenderer: function(
              index,
              datafield,
              value,
              defaultvalue,
              column,
              rowdata
            ) {
              let tax = rowdata["tax"];
              if (!isNaN(tax) && parseFloat(tax) > 0 && parseFloat(tax) < 1) {
                tax = Math.round(tax * 100) + "%";
              }
              return (
                "<div style='margin: 6px;' class='jqx-center-align'>" +
                tax +
                "</div>"
              );
            }
          });
        }

        if (that.hasAuthority(that, "ordDtl:logistics_management_fee")) {
          columns.push({
            text: "物流管理费",
            datafield: "logistics_management_fee",
            cellsAlign: "center",
            align: "center",
            width: 100,
            cellclassname: that.cellClass,
            cellsrenderer: function(
              index,
              datafield,
              value,
              defaultvalue,
              column,
              rowdata
            ) {
              let logManageFee = rowdata["logistics_management_fee"];
              if (
                !isNaN(logManageFee) &&
                parseFloat(logManageFee) > 0 &&
                parseFloat(logManageFee) < 1
              ) {
                logManageFee = Math.round(logManageFee * 100) + "%";
              }
              return (
                "<div style='margin: 6px;' class='jqx-center-align'>" +
                logManageFee +
                "</div>"
              );
            }
          });
        }

        if (that.hasAuthority(that, "ordDtl:warranty")) {
          columns.push({
            text: "质保金",
            datafield: "warranty",
            cellsAlign: "center",
            align: "center",
            width: 80,
            cellclassname: that.cellClass,
            cellsrenderer: function(
              index,
              datafield,
              value,
              defaultvalue,
              column,
              rowdata
            ) {
              let warranty = rowdata["warranty"];
              if (
                !isNaN(warranty) &&
                parseFloat(warranty) > 0 &&
                parseFloat(warranty) < 1
              ) {
                warranty = Math.round(warranty * 100) + "%";
              }
              return (
                "<div style='margin: 6px;' class='jqx-center-align'>" +
                warranty +
                "</div>"
              );
            }
          });
        }

        if (that.hasAuthority(that, "ordDtl:freight")) {
          columns.push({
            text: "运费",
            datafield: "freight",
            cellsAlign: "center",
            align: "center",
            width: 80,
            cellclassname: that.cellClass,
            cellsrenderer: function(
              index,
              datafield,
              value,
              defaultvalue,
              column,
              rowdata
            ) {
              let freight = rowdata["freight"];
              if (
                !isNaN(freight) &&
                parseFloat(freight) > 0 &&
                parseFloat(freight) < 1
              ) {
                freight = Math.round(freight * 100) + "%";
              }
              return (
                "<div style='margin: 6px;' class='jqx-center-align'>" +
                freight +
                "</div>"
              );
            }
          });
        }

        columns.push({
          text: "安装费",
          datafield: "install_fee",
          cellsAlign: "center",
          align: "center",
          cellclassname: that.cellClass,
          width: 125,
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer
        });

        if (that.hasAuthority(that, "ordDtl:order_tax")) {
          columns.push({
            text: "下单税金",
            datafield: "order_tax",
            cellsAlign: "center",
            align: "center",
            cellclassname: that.cellClass,
            width: 100,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }

        if (that.hasAuthority(that, "ordDtl:order_logistics_management_fee")) {
          columns.push({
            text: "下单物流管理费",
            datafield: "order_logistics_management_fee",
            cellsAlign: "center",
            align: "center",
            cellclassname: that.cellClass,
            width: 125,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }

        if (that.hasAuthority(that, "ordDtl:order_warranty")) {
          columns.push({
            text: "下单质保金",
            datafield: "order_warranty",
            cellsAlign: "center",
            align: "center",
            cellclassname: that.cellClass,
            width: 125,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }

        if (that.hasAuthority(that, "ordDtl:order_freight")) {
          columns.push({
            text: "下单运费",
            datafield: "order_freight",
            cellsAlign: "center",
            align: "center",
            cellclassname: that.cellClass,
            width: 100,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }

        if (that.hasAuthority(that, "ordDtl:order_reserve_price")) {
          columns.push({
            text: "下单底价",
            datafield: "order_reserve_price",
            cellsAlign: "center",
            align: "center",
            cellclassname: that.cellClass,
            width: 100,
            editable: false,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }

        if (
          that.hasAuthority(
            that,
            "ordDtl:not_consideration_commission_order_reserve_price"
          )
        ) {
          columns.push({
            text: "非3C风阀下单底价",
            datafield: "not_consideration_commission_order_reserve_price",
            cellsAlign: "center",
            align: "center",
            cellclassname: that.cellClass,
            width: 125,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }

        columns.push({
          text: "送货日期",
          datafield: "delivery_date",
          cellsAlign: "center",
          align: "center",
          cellclassname: that.cellClass,
          width: 100
        });
        columns.push({
          text: "送货金额",
          datafield: "delivery_amount",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass,
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer
        });

        if (that.hasAuthority(that, "ordDtl:delivery_tax")) {
          columns.push({
            text: "送货税金",
            datafield: "delivery_tax",
            cellsAlign: "center",
            align: "center",
            width: 100,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (
          that.hasAuthority(that, "ordDtl:delivery_logistics_management_fee")
        ) {
          columns.push({
            text: "送货物流管理费",
            datafield: "delivery_logistics_management_fee",
            cellsAlign: "center",
            align: "center",
            width: 125,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (that.hasAuthority(that, "ordDtl:delivery_warranty")) {
          columns.push({
            text: "送货质保金",
            datafield: "delivery_warranty",
            cellsAlign: "center",
            align: "center",
            width: 125,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (that.hasAuthority(that, "ordDtl:delivery_freight")) {
          columns.push({
            text: "送货运费",
            datafield: "delivery_freight",
            cellsAlign: "center",
            align: "center",
            width: 100,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (that.hasAuthority(that, "ordDtl:delivery_reserve_price")) {
          columns.push({
            text: "送货底价",
            datafield: "delivery_reserve_price",
            cellsAlign: "center",
            align: "center",
            width: 100,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (
          that.hasAuthority(
            that,
            "ordDtl:not_consideration_commission_delivery_amount"
          )
        ) {
          columns.push({
            text: "非3C风阀送货金额",
            datafield: "not_consideration_commission_delivery_amount",
            cellsAlign: "center",
            align: "center",
            width: 150,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }

        if (
          that.hasAuthority(
            that,
            "ordDtl:not_consideration_commission_delivery_tax"
          )
        ) {
          columns.push({
            text: "非3C风阀送货税金",
            datafield: "not_consideration_commission_delivery_tax",
            cellsAlign: "center",
            align: "center",
            width: 125,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (
          that.hasAuthority(
            that,
            "ordDtl:not_consideration_commission_delivery_logistics_management_fee"
          )
        ) {
          columns.push({
            text: "非3C风阀送货物流管理费",
            datafield:
              "not_consideration_commission_delivery_logistics_management_fee",
            cellsAlign: "center",
            align: "center",
            width: 170,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (
          that.hasAuthority(
            that,
            "ordDtl:not_consideration_commission_delivery_warranty"
          )
        ) {
          columns.push({
            text: "非3C风阀送货质保金",
            datafield: "not_consideration_commission_delivery_warranty",
            cellsAlign: "center",
            align: "center",
            width: 130,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (
          that.hasAuthority(
            that,
            "ordDtl:not_consideration_commission_delivery_freight"
          )
        ) {
          columns.push({
            text: "非3C风阀送货运费",
            datafield: "not_consideration_commission_delivery_freight",
            cellsAlign: "center",
            align: "center",
            width: 125,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (
          that.hasAuthority(
            that,
            "ordDtl:not_consideration_commission_delivery_reserve_price"
          )
        ) {
          columns.push({
            text: "非3C风阀送货底价",
            datafield: "not_consideration_commission_delivery_reserve_price",
            cellsAlign: "center",
            align: "center",
            width: 140,
            cellclassname: that.cellClass,
            aggregates: ["sum"],
            aggregatesrenderer: that.aggregatesRenderer
          });
        }
        if (that.hasAuthority(that, "ordDtl:over_budget_bear")) {
          columns.push({
            text: "超点承担",
            datafield: "over_budget_bear",
            cellsAlign: "center",
            align: "center",
            width: 100,
            cellclassname: that.cellClass
          });
        }
        if (that.hasAuthority(that, "ordDtl:actual_freight")) {
          columns.push({
            text: "实际运费",
            datafield: "actual_freight",
            cellsAlign: "center",
            align: "center",
            width: 100,
            cellclassname: that.cellClass
          });
        }
        if (that.hasAuthority(that, "ordDtl:undelivered_amount")) {
          columns.push({
            text: "未送货金额",
            datafield: "undelivered_amount",
            cellsAlign: "center",
            align: "center",
            width: 100,
            cellclassname: that.cellClass
          });
        }
        if (that.hasAuthority(that, "ordDtl:consideration_commission_status")) {
          columns.push({
            text: "计提成状态",
            datafield: "consideration_commission_status",
            cellsAlign: "center",
            align: "center",
            width: 100,
            cellclassname: that.cellClass
          });
        }

        columns.push({
          text: "备注",
          datafield: "remark",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: that.cellClass
        });
        return columns;
      })(),
      rowdetailstemplate: {
        rowdetails:
          "<div style='margin: 10px;'>" +
          "<ul style='margin-left: 30px;'>" +
          "<li class='title'>送货</li>" +
          "</ul>" +
          "<div class='deliveryGrid' style='border-style: none;'></div>" +
          "</div>",
        rowdetailsheight: 220,
        rowdetailshidden: true
      }
    };
  },
  mounted() {
    const gridId = this.$refs.myGrid.componentSelector;
    $(gridId).on("contextmenu", () => {
      return false;
    });
  },
  methods: {
    createButtonsContainers: function(toolbar) {
      const that = this;
      const buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      toolbar[0].appendChild(buttonsContainer);

      // 添加
      if (this.hasAuthority(this, "ordDtl:add")) {
        const addButtonContainer = document.createElement("div");
        const addButtonID = JQXLite.generateID();
        addButtonContainer.id = addButtonID;
        addButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(addButtonContainer);
        const addButtonInstance = jqwidgets.createInstance(
          `#${addButtonID}`,
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`)
          }
        );
        jqwidgets.createInstance(`#${addButtonID}`, "jqxTooltip", {
          content: "添加",
          position: "bottom"
        });

        addButtonInstance.addEventHandler("click", (event) => {
          this.$refs.orderWindow.open(ADD_ORDER);
        });
      }
      // 删除
      if (this.hasAuthority(this, "ordDtl:delete")) {
        const deleteButtonContainer = document.createElement("div");
        const deleteButtonID = JQXLite.generateID();
        deleteButtonContainer.id = deleteButtonID;
        deleteButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(deleteButtonContainer);
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
          const selectedrowindex = this.$refs.myGrid.getselectedrowindex();
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
            content: (h) => <div style='color:red;'></div>,
            onOk() {
              const id = this.$refs.myGrid.getrowid(selectedrowindex);
              const params = {
                jsonParams: JSON.stringify({
                  id
                })
              };
              deleteOrder(params).then((res) => {});
            },
            onCancel() {},
            class: "test"
          });
        });
      }

      if (this.hasAuthority(this, "ordDtl:update")) {
        // 修改
        const editButtonContainer = document.createElement("div");
        const editButtonID = JQXLite.generateID();
        editButtonContainer.id = editButtonID;
        editButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(editButtonContainer);
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
        editButton.addEventHandler("click", () => {
          const selectedrowindex = this.$refs.myGrid.getselectedrowindex();
          if (selectedrowindex < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED });
            return false;
          }
          const rowData = this.$refs.myGrid.getrowdata(selectedrowindex);
          this.$refs.orderWindow.open(EDIT_ORDER, rowData);
        });
        // 同步数据
        const syncButtonContainer = document.createElement("div");
        const syncButtonID = JQXLite.generateID();
        syncButtonContainer.id = syncButtonID;
        syncButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(syncButtonContainer);
        const syncButton = jqwidgets.createInstance(
          `#${syncButtonID}`,
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/async.svg`)
          }
        );
        jqwidgets.createInstance(`#${syncButtonID}`, "jqxTooltip", {
          content: "页面数据同步到服务器",
          position: "bottom"
        });
        syncButton.addEventHandler("click", () => {
          this.$confirm({
            title: `确认同步吗？`,
            okText: "确认",
            cancelText: "取消",
            centered: true,
            content: (h) => <div style='color:red;'></div>,
            onOk() {
              that.syncToServer();
            },
            onCancel() {},
            class: "test"
          });
        });
      }
      // 导入
      if (this.hasAuthority(this, "ordDtl:import")) {
        const importButtonContainer = document.createElement("div");
        const importButtonID = JQXLite.generateID();
        importButtonContainer.id = importButtonID;
        importButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(importButtonContainer);
        const importButton = jqwidgets.createInstance(
          `#${importButtonID}`,
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/import.svg`)
          }
        );
        jqwidgets.createInstance(`#${importButtonID}`, "jqxTooltip", {
          content: "导入",
          position: "bottom"
        });

        importButton.addEventHandler("click", () => {
          this.$refs.orderImportWindow.open(IMPORT_ORDER);
        });
      }
      // 导出
      if (this.hasAuthority(this, "ordDtl:export")) {
        const exportButtonContainer = document.createElement("div");
        const exportButtonID = JQXLite.generateID();
        exportButtonContainer.id = exportButtonID;
        exportButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(exportButtonContainer);

        const exportButton = jqwidgets.createInstance(
          `#${exportButtonID}`,
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/export.svg`)
          }
        );
        jqwidgets.createInstance(`#${exportButtonID}`, "jqxTooltip", {
          content: "导出",
          position: "bottom"
        });
        exportButton.addEventHandler("click", () => {
          this.exportToExcel();
        });
      }
      // 刷新
      const reloadButtonContainer = document.createElement("div");
      const reloadButtonID = JQXLite.generateID();
      reloadButtonContainer.id = reloadButtonID;
      reloadButtonContainer.style.cssText =
        "float:right;margin-left: 5px;  cursor: pointer;";
      buttonsContainer.appendChild(reloadButtonContainer);
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
    exportToExcel() {
      const columns = this.$refs.myGrid.columns;
      const rowsData = this.$refs.myGrid.getrows();
      dataExport("下单详细数据汇总—设备.xlsx", columns, rowsData);
    },
    cellClass(row, columnfield, value) {
      const deliveryDate = this.$refs.myGrid.getcellvalue(row, "delivery_date");
      const orderAmount = this.$refs.myGrid.getcellvalue(row, "order_amount");

      const deliveryAmount = this.$refs.myGrid.getcellvalue(
        row,
        "delivery_amount"
      );
      if (orderAmount == deliveryAmount) {
        if (
          new Date(deliveryDate) < new Date("2018-10-01") ||
          deliveryDate == null ||
          deliveryDate == ""
        ) {
          return "green";
        }
        if (deliveryDate != null && deliveryDate != "") {
          return "green";
        }
      }
    },
    aggregatesRenderer(aggregates, column, element) {
      var renderString = "";
      $.each(aggregates, function(key, value) {
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
    initrowdetails(index, parentElement, gridElement, record) {
      parentElement.style["z-index"] = 1000;
      const tabsDiv = $($(parentElement).children()[0]);
      let childGrid = null;
      if (tabsDiv != null) {
        childGrid = tabsDiv.find(".deliveryGrid");
        const container = $('<div style="margin: 5px;"></div>');
        container.appendTo($(childGrid));
        jqwidgets.createInstance(tabsDiv, "jqxTabs", {
          width: "96%",
          height: 170
        });
      }
      const orderNumber = record.order_number.toString();
      const jsonParams = {
        orderNumber
      };
      const source = {
        datafields: [
          { name: "id", type: "number" },
          { name: "order_number", type: "string" },
          { name: "order_amount", type: "number" },
          { name: "project_name", type: "string" },
          { name: "delivery_date", type: "string" },
          { name: "delivery_amount", type: "number" },
          { name: "delivery_reserve_price", type: "number" },
          { name: "logistics_management_fee", type: "string" },
          { name: "freight", type: "string" },
          { name: "tax", type: "string" },
          { name: "warranty", type: "string" }
        ],
        id: "id",
        url: "/dlvDtl/showDeliveryDetailByOrderNumber.do",
        type: "get",
        data: { jsonParams: JSON.stringify(jsonParams) },
        dataType: "json"
      };

      const nestedGridAdapter = new $.jqx.dataAdapter(source, {
        formatData: function(data) {
          return data;
        },
        loadServerData: function(serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          getDeliveryByOrderNumber(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total
            });
          });
        }
      });

      const childGridInstance = jqwidgets.createInstance(childGrid, "jqxGrid", {
        localization: getLocalization("zh-CN"),
        source: nestedGridAdapter,
        width: "100%",
        height: "100%",
        editable: true,
        editmode: "dblclick",
        columns: [
          {
            text: "送货日期",
            datafield: "delivery_date",
            cellsAlign: "center",
            align: "center"
          },
          {
            text: "送货金额",
            datafield: "delivery_amount",
            cellsAlign: "center",
            align: "center"
          },
          {
            text: "送货底价",
            datafield: "delivery_reserve_price",
            cellsAlign: "center",
            align: "center"
          },
          {
            text: "",
            datafield: "Delete",
            columntype: "button",
            width: 50,
            cellsrenderer: () => {
              return "删除";
            },
            buttonclick: (rowindex) => {
              this.$confirm({
                title: `${Message.CONFIRM_DELETE}`,
                okText: "确认",
                cancelText: "取消",
                centered: true,
                okType: "danger",
                content: (h) => <div style='color:red;'></div>,
                onOk() {
                  const id = childGridInstance.getrowid(rowindex);
                  const params = {
                    jsonParams: JSON.stringify({
                      id
                    })
                  };
                  deleteDelivery(params).then((res) => {});
                },
                onCancel() {},
                class: "test"
              });
            }
          },
          {
            text: "",
            datafield: "Edit",
            columntype: "button",
            width: 50,
            cellsrenderer: () => {
              return "编辑";
            },
            buttonclick: (rowindex) => {
              this.childGridInstance = childGridInstance;
              const installFee = this.$refs.myGrid.getcellvalue(
                rowindex,
                "install_fee"
              );
              const rowData = childGridInstance.getrowdata(rowindex);
              rowData["install_fee"] = installFee;
              this.$refs.deliveryWindow.open(EDIT_DELIVERY, rowData);
            }
          }
        ]
      });
    },
    syncToServer() {
      const rowsData = this.$refs.myGrid.getrows();
      const items = rowsData.map((item) => {
        const map = {};
        map.order_date = item["order_date"];
        map.salesman = item["salesman"];
        map.contract_number = item["contract_number"];
        map.project_name = item["project_name"];
        map.order_amount = item["order_amount"];
        map.order_reserve_price = item["order_reserve_price"];
        map.consideration_commission_order_amount =
          item["consideration_commission_order_amount"];
        map.not_consideration_commission_order_amount =
          item["not_consideration_commission_order_amount"];
        map.logistics_management_fee = item["logistics_management_fee"];
        map.freight = item["freight"];
        map.tax = item["tax"];
        map.warranty = item["warranty"];
        map.consideration_commission_date =
          item["consideration_commission_date"];
        map.consideration_commission_status =
          item["consideration_commission_status"];
        map.remark = item["remark"];
        map.id = item["id"];
        return map;
      });
      const params = {
        jsonParams: JSON.stringify({
          items
        })
      };
      batahUpdateOrder(params).then((res) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    onCellclick(event) {
      if (event.args.rightclick) {
        const clickCellInfo = event.args;
        this.clickCellInfo = clickCellInfo;
        const scrollTop = $(window).scrollTop();
        const scrollLeft = $(window).scrollLeft();
        this.$refs.jqxMenu.open(
          parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
          parseInt(event.args.originalEvent.clientY) + 5 + scrollTop
        );
        return false;
      }
    },
    onItemclick(event) {
      const menu = event.args.textContent;
      if (menu == ADD_DELIVERY) {
        const rowData = this.clickCellInfo.row.bounddata;
        this.$refs.deliveryWindow.open(ADD_DELIVERY, rowData);
      }
    },
    refresh() {
      this.$refs.myGrid.updatebounddata();
    },
    refreshChild() {
      this.childGridInstance.updatebounddata();
    }
  }
};
</script>

<style scoped>
</style>
