<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'90%'"
      :height="700"
      :autoOpen="false"
      :position="{ x: '20%', y: '15%' }"
    >
      <div style="overflow:hidden;">
        <JqxDataTable
          ref="myDataTable"
          :width="'100%'"
          :height="'100%'"
          :source="dataAdapter"
          :columns="columns"
          :pageable="true"
          :pageSize="20"
          :altRows="true"
          :filterable="true"
          :sortable="true"
          @rowDoubleClick="onRowDoubleClick($event)"
        >
        </JqxDataTable>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxDataTable from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdatatable.vue";

import { formatFilter } from "@/common/util.js";
import { getLocalization } from "@/common/localization.js";
import { updateContract } from "@/network/contract.js"
import { showCustomerList } from "@/network/customer.js";
export default {
  components: {
    JqxWindow,
    JqxDataTable,
  },
  beforeCreate: function () {
    this.source = {
      dataFields: [
        { name: "id", type: "number" },
        { name: "name", type: "string" },
        { name: "type", type: "string" },
        { name: "gender", type: "string" },
        { name: "phone", type: "string" },
        { name: "company", type: "string" },
        { name: "position", type: "string" },
      ],
      type: "get",
      dataType: "json",
      url: "/customer/showCustomerList.do",
      sortcolumn: "id",
      sortdirection: "desc",
      root: "rows",
      record: "rows",
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
          showCustomerList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            });
          });
        },
      }),
      columns: [
        {
          text: "名称",
          cellsAlign: "center",
          align: "center",
          dataField: "name",
        },
        {
          text: "性别",
          cellsAlign: "center",
          align: "center",
          dataField: "gender",
        },
        {
          text: "电话",
          dataField: "phone",
          cellsAlign: "center",
          align: "center",
          width: 120,
        },
        {
          text: "公司",
          dataField: "company",
          align: "center",
          cellsAlign: "center",
        },
        {
          text: "职位",
          cellsAlign: "center",
          align: "center",
          dataField: "position",
        },
      ],
      contractInfo:{}
    };
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      this.contractInfo = params[1]
      this.$refs.myWindow.open();
    },
    onRowDoubleClick(event){
      const value = this.$refs.myDataTable.getSelection();
      const newData = {
        id:this.contractInfo['id'],
        customer:value[0]['id']
      }
      const params = {
        jsonParams:JSON.stringify(newData)
      }
      updateContract(params).then(res=>{
        this.$parent.refresh()
      })
      this.$refs.myWindow.close()
    }
  },
};
</script>

<style>
</style>