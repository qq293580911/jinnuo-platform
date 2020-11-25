<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'90%'"
      :height="'90%'"
      :autoOpen="false"
      :position="{ x: '20%', y: '5%' }"
    >
      <div>
        <div style="height: 100%; overflow: hidden">
          <JqxGrid
            ref="myGrid"
            :width="'100%'"
            :height="'100%'"
            :localization="localization"
            :source="dataAdapter"
            :columns="columns"
            :showtoolbar="true"
            :rendertoolbar="createButtonsContainers"
            :altrows="true"
            :enabletooltip="true"
            :selectionmode="'multiplerowsextended'"
          >
          </JqxGrid>
        </div>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import Vue from "vue";
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxValidator from "jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";

import CustomUploader from "@/components/common/CustomUploader";
import { getLocalization } from "@/common/localization.js";
import { Message } from "@/common/const";
import { calc_ord_misc, calc_ord_rsv_p } from "@/common/util";
import { importOrder, batchUpdateOrderByOrderNumber } from "@/network/order";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
    JqxGrid,
  },
  beforeCreate() {
    this.source = {
      datafields: [
        {
          name: "product_type",
          map: "productType",
          type: "string",
        },
        {
          name: "order_date",
          map: "orderDate",
          type: "string",
        },
        {
          name: "salesman",
          type: "number",
        },
        {
          name: "salesman_name",
          map: "salesmanName",
          type: "string",
        },
        {
          name: "contract_number",
          map: "contractNumber",
          type: "string",
        },
        {
          name: "order_number",
          map: "orderNumber",
          type: "number",
        },
        {
          name: "project_name",
          map: "projectName",
          type: "string",
        },
        {
          name: "order_amount",
          map: "orderAmount",
          type: "number",
        },
        {
          name: "consideration_commission_order_amount",
          map: "considerationCommissionOrderAmount",
          type: "number",
        },
        {
          name: "not_consideration_commission_order_amount",
          map: "notConsiderationCommissionOrderAmount",
          type: "number",
        },
        {
          name: "logistics_management_fee",
          map: "logisticsManagementFee",
          type: "string",
        },
        {
          name: "freight",
          map: "freight",
          type: "string",
        },
        {
          name: "tax",
          map: "tax",
          type: "string",
        },
        {
          name: "warranty",
          map: "warranty",
          type: "string",
        },
        {
          name: "install_fee",
          map: "installFee",
          type: "string",
        },
        {
          name: "order_reserve_price",
          type: "number",
        },
        {
          name: "consideration_commission_status",
          map: "considerationCommissionStatus",
          type: "string",
        },
        {
          name: "remark",
          map: "remark",
          type: "string",
        },
        {
          name: "actual_freight",
          map: "actualFreight",
          type: "string",
        },
      ],
      dataType: "json",
      localdata: [],
    };
  },
  data() {
    const that = this;
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        beforeLoadComplete(records) {
          const salesmans = that.$store.state.salesmans;
          records.forEach((item) => {
            const ordAmt = item["order_amount"];
            const logManageFee = item["logistics_management_fee"];
            let freight = item["freight"];
            let tax = item["tax"];
            let warranty = item["warranty"];
            const installFee = item["install_fee"];
            // 计算下单杂费
            const ordLogManageFee = calc_ord_misc(logManageFee);
            const ordFreight = calc_ord_misc(freight);
            const ordTax = calc_ord_misc(tax);
            const ordWarranty = calc_ord_misc(warranty);
            // 计算下单底价
            const ordRsvP = calc_ord_rsv_p(
              ordAmt,
              ordLogManageFee,
              ordFreight,
              ordTax,
              ordWarranty,
              installFee
            );
            item["order_reserve_price"] = ordRsvP;
            //放入业务员ID
            const salesman = salesmans.find((salesman) => {
              return salesman["emp_name"] == item["salesman_name"];
            });
            if (salesman) {
              item["salesman"] = salesman["emp_id"];
            }
          });
        },
      }),
      columns: [
        {
          text: "产品类型",
          dataField: "product_type",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: function (row, columnfield, value, data) {
            if (/^设备$/.test(value) == false) {
              that.allowedFormat = false;
              return "yellow";
            }
            return "";
          },
        },
        {
          text: "下单日期",
          dataField: "order_date",
          cellsAlign: "center",
          align: "center",
          width: 100,
          cellclassname: function (row, columnfield, value, data) {
            let r = value.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/);
            if (r == null) {
              that.allowedFormat = false;
              return "yellow";
            }
            return "";
          },
        },
        {
          text: "业务员",
          dataField: "salesman_name",
          cellsAlign: "center",
          align: "center",
          width: 80,
          cellclassname: function (row, columnfield, value, data) {
            if (data["salesman"] == null) {
              that.allowedFormat = false;
              return "yellow";
            }
            return "";
          },
        },
        {
          text: "合同编号",
          dataField: "contract_number",
          cellsAlign: "center",
          align: "center",
          width: 150,
        },
        {
          text: "下单编号",
          dataField: "order_number",
          cellsAlign: "center",
          align: "center",
          width: 150,
        },
        {
          text: "项目名称",
          dataField: "project_name",
          cellsAlign: "center",
          align: "center",
          width: 300,
        },
        {
          text: "下单金额",
          dataField: "order_amount",
          cellsAlign: "center",
          align: "center",
          width: 120,
        },
        {
          text: "计提成下单金额",
          dataField: "consideration_commission_order_amount",
          cellsAlign: "center",
          align: "center",
          width: 120,
        },
        {
          text: "非3C风阀下单金额",
          dataField: "not_consideration_commission_order_amount",
          cellsAlign: "center",
          align: "center",
          width: 120,
        },
        {
          text: "物流管理费",
          dataField: "logistics_management_fee",
          cellsAlign: "center",
          align: "center",
          width: 100,
        },
        {
          text: "运费",
          dataField: "freight",
          cellsAlign: "center",
          align: "center",
          width: 80,
        },
        {
          text: "税金",
          dataField: "tax",
          cellsAlign: "center",
          align: "center",
          width: 80,
        },
        {
          text: "质保金",
          dataField: "warranty",
          cellsAlign: "center",
          align: "center",
          width: 80,
        },
        {
          text: "安装费",
          dataField: "install_fee",
          cellsAlign: "center",
          align: "center",
          width: 80,
        },
        {
          text: "下单底价",
          dataField: "order_reserve_price",
          cellsAlign: "center",
          align: "center",
          width: 100,
        },
        {
          text: "备注",
          dataField: "remark",
          cellsAlign: "center",
          align: "center",
          width: 150,
        },
        {
          text: "计提成状态",
          dataField: "consideration_commission_status",
          cellsAlign: "center",
          align: "center",
          width: 110,
        },
        {
          text: "实际运费",
          dataField: "actual_freight",
          cellsAlign: "center",
          align: "center",
          width: 80,
        },
      ],
      fileContent: [],
      startRow: 0,
      endRow: 0,
      allowedFormat: true,
    };
  },
  watch: {
    startRow() {
      if (this.endRow < this.startRow) {
        this.$message.warning(Message.END_ROW_LESS_THAN_START_ROW);
      } else {
        const data = this.fileContent.slice(this.startRow, this.endRow);
        this.source.localdata = data;
        this.$refs.myGrid.updatebounddata();
      }
    },
    endRow() {
      if (this.endRow < this.startRow) {
        this.$message.warning(Message.END_ROW_LESS_THAN_START_ROW);
      } else {
        const data = this.fileContent.slice(this.startRow, this.endRow);
        this.source.localdata = data;
        this.$refs.myGrid.updatebounddata();
      }
    },
  },
  mounted() {
    const that = this;
    // 上传器绑定值改变事件
    this.uploaderInstance.$on("changed", (data) => {
      let sheetName = Object.keys(data[0])[0];
      const fileContent = data[0][sheetName];
      fileContent.forEach(function (value, index) {
        if (index > 0) {
          value["orderDate"] = LAY_EXCEL.dateCodeFormat(
            value["orderDate"],
            "YYYY-MM-DD"
          );
        }
      });
      that.fileContent = fileContent;
      that.source.localdata = that.fileContent;
      that.$refs.myGrid.updatebounddata();
    });
    // 开始行绑定选择事件
    this.startRowInstance.addEventHandler("change", (event) => {
      const startRow = event.args.value;
      that.startRow = startRow;
    });
    // 结束行绑定选择事件
    this.endRowInstance.addEventHandler("change", (event) => {
      const endRow = event.args.value;
      that.endRow = endRow;
    });
    // 确认导入按钮绑定点击事件
    this.importInstance.addEventHandler("click", () => {
      if (this.fileContent.length == 0) {
        this.$message.warning(Message.NOT_FOUND_CONTENT);
        return false;
      }
      if (this.allowedFormat == false) {
        this.$message.warning(Message.NOT_ALLOWED_FORMAT);
        return false;
      }
      // 导入前再确认
      this.$confirm({
        title: `${Message.CONFIRM_DELETE}`,
        okText: "确认",
        cancelText: "取消",
        centered: true,
        content: (h) => <div style="color:red;"></div>,
        onOk() {
          that.importOrder()
        },
        onCancel() {},
        class: "test",
      });
    });
    // 批量修改按钮绑定点击事件
    this.batchUpdateInstance.addEventHandler("click", () => {
      this.batchUpdateOrder()
    });
  },
  methods: {
    createButtonsContainers: function (toolbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      toolbar[0].appendChild(buttonsContainer);
      // 上传器
      const uploadContainer = document.createElement("div");
      uploadContainer.classList.add("tool-item");
      buttonsContainer.appendChild(uploadContainer);
      const uploader = document.createElement("div");
      uploader.id = "uploader";
      uploadContainer.appendChild(uploader);
      let uploaderComponent = Vue.extend(CustomUploader);
      this.uploaderInstance = new uploaderComponent({
        propsData: {
          width: 190,
          height: 25,
          type: "jqxInput",
          showUploadButton: true,
          fieldsCofig: {
            fields: {
              orderDate: "A",
              salesmanName: "B",
              contractNumber: "C",
              orderNumber: "D",
              projectName: "E",
              orderAmount: "F",
              considerationCommissionOrderAmount: "G",
              notConsiderationCommissionOrderAmount: "H",
              logisticsManagementFee: "I",
              freight: "J",
              tax: "K",
              warranty: "L",
              orderArea: "M",
              remark: "N",
              considerationCommissionStatus: "O",
              actualFreight: "P",
            },
          },
        },
      }).$mount("#uploader");
      // 开始行
      let spanContainer = document.createElement("span");
      spanContainer.classList.add("tool-item");
      spanContainer.innerHTML = "开始行：";
      const startRowContainer = document.createElement("div");
      startRowContainer.id = "startRow";
      startRowContainer.classList.add("tool-item");
      buttonsContainer.appendChild(spanContainer);
      buttonsContainer.appendChild(startRowContainer);
      this.startRowInstance = jqwidgets.createInstance(
        "#startRow",
        "jqxNumberInput",
        {
          width: 100,
          height: 25,
          min: 0,
          decimalDigits: 0,
          digits: 5,
          spinButtons: true,
        }
      );
      // 结束行
      spanContainer = document.createElement("span");
      spanContainer.classList.add("tool-item");
      spanContainer.innerHTML = "结束行：";
      buttonsContainer.appendChild(spanContainer);
      const endRowContainer = document.createElement("div");
      endRowContainer.id = "endRow";
      endRowContainer.classList.add("tool-item");
      buttonsContainer.appendChild(endRowContainer);
      this.endRowInstance = jqwidgets.createInstance(
        "#endRow",
        "jqxNumberInput",
        {
          width: 100,
          height: 25,
          min: 0,
          decimalDigits: 0,
          digits: 5,
          spinButtons: true,
        }
      );

      // 确认导入按钮
      let confirmContainer = document.createElement("div");
      confirmContainer.classList.add("tool-item");
      confirmContainer.id = "confirmImport";
      buttonsContainer.appendChild(confirmContainer);
      let confirmImportButton = jqwidgets.createInstance(
        "#confirmImport",
        "jqxButton",
        { height: 25, width: 40, value: "确认" }
      );
      this.importInstance = jqwidgets.createInstance(
        "#confirmImport",
        "jqxTooltip",
        {
          content: "确认导入",
          position: "bottom",
        }
      );

      // 批量修改按钮
      let batchUpdateContainer = document.createElement("div");
      batchUpdateContainer.classList.add("tool-item");
      batchUpdateContainer.id = "batchUpdateButton";
      buttonsContainer.appendChild(batchUpdateContainer);
      let batchUpdateButton = jqwidgets.createInstance(
        "#batchUpdateButton",
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/batch-update.svg`) }
      );
      this.batchUpdateInstance = jqwidgets.createInstance(
        "#batchUpdateButton",
        "jqxTooltip",
        {
          content: "批量更新",
          position: "bottom",
        }
      );
      // 字段选择
      let fieldSelection = document.createElement("div");
      fieldSelection.id = "fieldSelection";
      fieldSelection.classList.add("tool-item");
      buttonsContainer.appendChild(fieldSelection);
      this.fieldSelectionInstance = jqwidgets.createInstance(
        "#fieldSelection",
        "jqxDropDownList",
        {
          source: ["实际运费", "计提成状态"],
          width: 100,
          height: 23,
        }
      );
    },
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {},
    importOrder() {
      const rowsData = this.$refs.myGrid.getrows();
      const params = {
        jsonParams: JSON.stringify({
          items: rowsData,
        }),
      };
      importOrder(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
    batchUpdateOrder() {
      const rowsData = this.$refs.myGrid.getrows();
      const params = {
        jsonParams: JSON.stringify({
          items: rowsData,
        }),
      };
      batchUpdateOrderByOrderNumber(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
  },
};
</script>

<style scoped>
::v-deep .tool-item {
  margin-right: 5px;
  display: inline-block;
  vertical-align: middle;
}
</style>