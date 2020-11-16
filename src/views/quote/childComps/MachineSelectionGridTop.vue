<template>
  <div>
    <JqxGrid
      :source="dataAdapter"
      :columns="columns"
      :localization="localization"
      :width="'100%'"
      :height="'100%'"
      :columnsresize="true"
      :columnsautoresize="true"
      :showtoolbar="true"
      :toolbarheight="33"
      :selectionmode="'singlerow'"
      :columngroups="columngroups"
    ></JqxGrid>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";

import { getLocalization } from "@/common/localization.js";
export default {
  name: "MachineSelectionGridTop",
  components: {
    JqxGrid,
  },
  beforeCreate() {
    this.source = {
      datafields: [
        {
          name: "machineName",
          map: "pm_name",
          type: "string",
        },
        {
          name: "minAirVolume",
          map: "min_air_volume",
          type: "number",
        },
        {
          name: "maxAirVolume",
          map: "max_air_volume",
          type: "number",
        },
        {
          name: "priceNonCcc",
          map: "price_non_ccc",
          type: "number",
        },
        { name: "power", map: "power", type: "string" },
        { name: "remark", map: "remark", type: "string" },
      ],
      localdata: [],
    };
  },
  data() {
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source),
      columns: [
        {
          text: "型号",
          columngroup: "SelectionDetails",
          datafield: "machineName",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "风量",
          columngroup: "SelectionDetails",
          datafield: "minAirVolume",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "风量",
          columngroup: "SelectionDetails",
          datafield: "maxAirVolume",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "功率",
          columngroup: "SelectionDetails",
          datafield: "power",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "单价",
          columngroup: "SelectionDetails",
          datafield: "priceCcc",
          align: "center",
          cellsalign: "center",
        },
        {
          text: "备注",
          columngroup: "SelectionDetails",
          datafield: "remark",
          align: "center",
          cellsalign: "center",
          hidden: true,
        },
      ],
      columngroups: [
        {
          text: "非3C",
          align: "center",
          name: "SelectionDetails",
          align: "left",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>