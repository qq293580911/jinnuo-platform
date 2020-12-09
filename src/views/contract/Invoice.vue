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
      :editable="editable"
      :editmode="'dblclick'"
      :selectionmode="'multiplerowsextended'"
      :virtualmode="true"
      :rendergridrows="rendergridrows"
      :showstatusbar="true"
      :statusbarheight="30"
      :showaggregates="true"
      :rowdetails="true"
      :initrowdetails="initrowdetails"
      :rowdetailstemplate="rowdetailstemplate"
    >
    </JqxGrid>
    <preview-window ref="previewWindow" :src="previewUrl"></preview-window>
    <invoice-window ref="invoiceWinodw"></invoice-window>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";
import JqxTooltip from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtooltip.vue";
import PreviewWindow from "@/components/common/PreviewWindow.vue";
import InvoiceWindow from "./childComps/InvoiceWindow";

import { getLocalization } from "@/common/localization.js";
import { formatFilter } from "@/common/util.js";
import { Message, ADD_CONTRACT_INVOICE } from "@/common/const.js";
import {
  showContractInvoiceList,
  deleteContractInvoice,
} from "@/network/invoice.js";
import {
  getContractInvoiceAnnexList,
  getAnnexUrl,
  downloadAnnex,
  deleteAnnex,
} from "@/network/annex.js";
export default {
  name: "ContractInvoice",
  components: {
    JqxGrid,
    PreviewWindow,
    InvoiceWindow,
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
  created() {
    if (this.hasAuthority(this, "contrInv:update")) {
      this.editable = true;
    }
  },
  data() {
    const that = this;
    return {
      annexType: "合同发票附件",
      //数据网格
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data;
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          showContractInvoiceList(source, serverdata).then((res) => {
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
              value = that.dataAdapter.formatNumber(value, "d2");
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
      rowdetailstemplate: {
        rowdetails: "<div class='child-grid' style='margin: 10px;'></div>",
        rowdetailsheight: 220,
        rowdetailshidden: true,
        previewUrl: "",
      },
      previewUrl: "",
    };
  },
  methods: {
    createButtonsContainers: function (toolbar) {
      let buttonsContainer = document.createElement("div");
      buttonsContainer.style.cssText =
        "overflow: hidden; position: relative; margin: 5px;";
      toolbar[0].appendChild(buttonsContainer);

      // 添加
      if (this.hasAuthority(this, "contrInv:add")) {
        let addButtonContainer = document.createElement("div");
        addButtonContainer.id = "addButton";
        addButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(addButtonContainer);
        let addButtonInstance = jqwidgets.createInstance(
          "#addButton",
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
          }
        );
        jqwidgets.createInstance("#addButton", "jqxTooltip", {
          content: "添加",
          position: "bottom",
        });
        addButtonInstance.addEventHandler("click", (event) => {
          this.$refs.invoiceWinodw.open(ADD_CONTRACT_INVOICE);
        });
      }

      // 删除
      if (this.hasAuthority(this, "contrInv:delete")) {
        let deleteButtonContainer = document.createElement("div");
        deleteButtonContainer.id = "deleteButton";
        deleteButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(deleteButtonContainer);
        let deleteButtonInstance = jqwidgets.createInstance(
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

        deleteButtonInstance.addEventHandler("click", (event) => {
          let selectedrowindex = this.$refs.myGrid.getselectedrowindex();
          if (selectedrowindex < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED });
            return false;
          }
          let id = this.$refs.myGrid.getrowid(selectedrowindex);
          this.$refs.myGrid.deleterow(id);
        });
      }

      // 修改
      if (this.hasAuthority(this, "contrInv:update")) {
        let editButtonContainer = document.createElement("div");
        editButtonContainer.id = "editButton";
        editButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(editButtonContainer);

        let editButtonInstance = jqwidgets.createInstance(
          "#editButton",
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
          }
        );
        jqwidgets.createInstance("#deleteButton", "jqxTooltip", {
          content: "修改",
          position: "bottom",
        });
      }

      // 上传
      if (this.hasAuthority(this, "contrInvAnnex:upload")) {
        let uploadButtonContainer = document.createElement("div");
        uploadButtonContainer.id = "uploadButton";
        uploadButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(uploadButtonContainer);
        let uploadButtonInstance = jqwidgets.createInstance(
          "#uploadButton",
          "jqxButton",
          {
            imgSrc: require(`@/assets/iconfont/custom/upload.svg`),
          }
        );
        jqwidgets.createInstance("#deleteButton", "jqxTooltip", {
          content: "上传",
          position: "bottom",
        });
      }

      // 导出
      if (this.hasAuthority(this, "contrInv:export")) {
        let exportButtonContainer = document.createElement("div");
        exportButtonContainer.id = "exportButton";
        exportButtonContainer.style.cssText =
          "float: left;margin-left: 5px;  cursor: pointer;";
        buttonsContainer.appendChild(exportButtonContainer);
        let exportButtonInstance = jqwidgets.createInstance(
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
      }

      let reloadButtonContainer = document.createElement("div");
      reloadButtonContainer.id = "reloadButton";
      reloadButtonContainer.style.cssText =
        "float:right;margin-left: 5px;  cursor: pointer;";
      buttonsContainer.appendChild(reloadButtonContainer);
      let reloadButtonInstance = jqwidgets.createInstance(
        "#reloadButton",
        "jqxButton",
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      );
      jqwidgets.createInstance("#reloadButton", "jqxTooltip", {
        content: "刷新",
        position: "bottom",
      });

      reloadButtonInstance.addEventHandler("click", (event) => {
        this.$refs.myGrid.updatebounddata();
      });
    },
    initrowdetails(index, parentElement, gridElement, record) {
      const that = this;
      parentElement.style["z-index"] = 1000;
      const id = record.uid.toString();
      const childGrid = $($(parentElement).children()[0]);
      const params = {
        jsonParams: JSON.stringify({
          boundId: id,
          annexType: that.annexType,
        }),
      };
      const annexSource = {
        dataFields: [
          { name: "annex_id", type: "number" },
          { name: "annex_name", type: "string" },
          { name: "bound_id", type: "number" },
        ],

        url: "/annex/showAnnexBySelectBoundId.do",
        type: "get",
        data: params,
        dataType: "json",
        id: "annex_id",
      };

      const nestedGridAdapter = new jqx.dataAdapter(annexSource, {
        formatData: function (data) {
          return data;
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata);
          getContractInvoiceAnnexList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            });
          });
        },
        loadComplete(records) {
          records.records.forEach((item) => {
            const annexName = item["annex_name"];
            const suffix = annexName.substring(annexName.lastIndexOf(".") + 1);
            item["file_type"] = suffix;
          });
        },
      });

      let childGridInstance = jqwidgets.createInstance(childGrid, "jqxGrid", {
        localization: getLocalization("zh-CN"),
        source: nestedGridAdapter,
        width: "96%",
        height: 200,
        columns: (function () {
          const columns = [];
          columns.push({
            text: "附件名称",
            datafield: "annex_name",
            cellsAlign: "center",
            align: "center",
          });
          columns.push({
            text: "文件类型",
            datafield: "file_type",
            cellsAlign: "center",
            align: "center",
            cellsrenderer: function (row, column, value) {
              const imgurl = require(`@/assets/iconfont/custom/${value}.svg`);
              const img =
                '<div style="text-align:center;"><img style="margin: 8px;" width="16" height="16" src="' +
                imgurl +
                '"></div>';
              return img;
            },
          });
          if (that.hasAuthority(that, "contrAnnex:delete")) {
            columns.push({
              text: "",
              datafield: "annexDelete",
              columntype: "button",
              width: 50,
              cellsrenderer: function () {
                return "删除";
              },
              buttonclick: function (rowindex) {
                that.$confirm({
                  title: `${Message.CONFIRM_DELETE}`,
                  okText: "确认",
                  cancelText: "取消",
                  centered: true,
                  content: (h) => <div style="color:red;"></div>,
                  onOk() {
                    const annexId = childGridInstance.getrowid(rowindex);
                    const params = {
                      jsonParams: JSON.stringify({
                        annexId,
                      }),
                    };
                    deleteAnnex(params).then((res) => {
                      childGridInstance.updatebounddata();
                    });
                  },
                  onCancel() {},
                  class: "test",
                });
              },
            });
          }
          if (that.hasAuthority(that, "contrAnnex:preview")) {
            columns.push({
              text: "",
              datafield: "annexPreview",
              columntype: "button",
              width: 50,
              cellsrenderer: function () {
                return "预览";
              },
              buttonclick: function (rowindex) {
                const annexId = childGridInstance.getrowid(rowindex);
                const params = {
                  jsonParams: JSON.stringify({
                    annexId,
                  }),
                };
                getAnnexUrl(params).then((res) => {
                  const suffix = res.substring(res.lastIndexOf(".") + 1);
                  if (["xlsx", "xls", "doc", "docx"].includes(suffix, 0)) {
                    that.previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${res}`;
                  } else {
                    that.previewUrl = res;
                  }
                  that.$refs.previewWindow.open("预览");
                });
              },
            });
          }
          if (that.hasAuthority(that, "contrAnnex:download")) {
            columns.push({
              text: "",
              datafield: "annexDownload",
              columntype: "button",
              width: 50,
              cellsrenderer: function () {
                return "下载";
              },
              buttonclick: function (rowindex) {
                const annexId = childGridInstance.getcellvalue(
                  rowindex,
                  "annex_id"
                );
                const fileName = childGridInstance.getcellvalue(
                  rowindex,
                  "annex_name"
                );
                const params = {
                  annexId,
                };
                // axios请求二进制流下载
                axios({
                  method: "post",
                  url: "/api/annex/downloadFile.do",
                  data: params,
                  responseType: "blob",
                }).then((res) => {
                  const content = res.data;
                  const blob = new Blob([content]);
                  let blobUrl = URL.createObjectURL(blob);
                  const elink = document.createElement("a");
                  elink.download = fileName;
                  elink.style.display = "none";
                  elink.href = URL.createObjectURL(blob);
                  document.body.appendChild(elink);
                  elink.click();
                  URL.revokeObjectURL(elink.href); // 释放URL 对象
                  document.body.removeChild(elink);
                });
              },
            });
          }
          return columns;
        })(),
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