<template>
  <div>
    <JqxGrid
      ref="myGrid"
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
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";

import { getLocalization } from "@/common/localization.js";
export default {
  components: {
    JqxGrid,
  },
  props: {
    selectionType: {
      type: String,
      default: null,
    },
    columnGroupName: {
      type: String,
      default: "",
    },
  },
  beforeCreate() {
    this.source = {
      datafields: [],
      localdata: [],
    };
  },
  data() {
    const that = this;
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source),
      columns: [],
      columngroups: [
        {
          text: that.columnGroupName,
          align: "center",
          name: "SelectionDetails",
          align: "left",
        },
      ],
    };
  },
  watch: {
    selectionType() {
      console.log(this.selectionType);
    },
  },
  mounted() {
    const that = this;
    // this.$bus.$on("changeSelectionType", (val) => {
    //   console.log(val);
    // });

    switch (that.selectionType) {
      case "常规风机":
        that.source.datafields.push({
          name: "pm_name",
          type: "string",
        });

        that.source.datafields.push({
          name: "min_air_volume",
          type: "number",
        });
        that.source.datafields.push({
          name: "max_air_volume",
          type: "number",
        });
        if (that.columnGroupName == "非3C") {
          that.source.datafields.push({
            name: "price_non_ccc",
            type: "number",
          });
        } else {
          that.source.datafields.push({
            name: "price_ccc",
            type: "number",
          });
        }
        that.source.datafields.push({ name: "power", type: "string" });
        that.source.datafields.push({ name: "remark", type: "string" });

        that.columns.push({
          text: "名称",
          columngroup: "SelectionDetails",
          datafield: "pm_name",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "最低风量",
          columngroup: "SelectionDetails",
          datafield: "min_air_volume",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "最高风量",
          columngroup: "SelectionDetails",
          datafield: "max_air_volume",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "功率",
          columngroup: "SelectionDetails",
          datafield: "power",
          align: "center",
          cellsalign: "center",
        });
        if (that.columnGroupName == "非3C") {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_non_ccc",
            align: "center",
            cellsalign: "center",
          });
        } else {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_ccc",
            align: "center",
            cellsalign: "center",
          });
        }

        that.columns.push({
          text: "备注",
          columngroup: "SelectionDetails",
          datafield: "remark",
          align: "center",
          cellsalign: "center",
          hidden: true,
        });
        break;
      case "控制箱":
        that.source.datafields.push({ name: "pm_name", type: "string" });
        if (that.columnGroupName == "非3C") {
          that.source.datafields.push({
            name: "price_non_ccc",
            type: "number",
          });
        } else {
          that.source.datafields.push({ name: "price_ccc", type: "number" });
        }
        that.source.datafields.push({ name: "power", type: "string" });

        that.columns.push({
          text: "型号",
          columngroup: "SelectionDetails",
          datafield: "pm_name",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "功率",
          columngroup: "SelectionDetails",
          datafield: "power",
          align: "center",
          cellsalign: "center",
        });
        if (that.columnGroupName == "非3C") {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_non_ccc",
            align: "center",
            cellsalign: "center",
          });
        } else {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_ccc",
            align: "center",
            cellsalign: "center",
          });
        }
        break;
      case "换气扇":
        that.source.datafields.push({ name: "name", type: "string" });
        that.source.datafields.push({ name: "air_volume", type: "string" });
        that.source.datafields.push({ name: "price", type: "number" });
        that.source.datafields.push({ name: "specification", type: "string" });
        that.source.datafields.push({ name: "panel_material", type: "string" });

        that.columns.push({
          text: "名称",
          datafield: "name",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "风量",
          datafield: "air_volume",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "单价",
          datafield: "price",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "规格",
          datafield: "specification",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "材质",
          datafield: "panel_material",
          align: "center",
          cellsalign: "center",
        });
        break;
      case "方形壁式风机":
        that.source.datafields.push({ name: "pm_name", type: "string" });
        that.source.datafields.push({ name: "min_air_volume", type: "number" });
        that.source.datafields.push({ name: "max_air_volume", type: "number" });
        that.source.datafields.push({ name: "power", type: "string" });
        that.source.datafields.push({ name: "price_non_ccc", type: "number" });

        that.columns.push({
          text: "名称",
          datafield: "pm_name",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "最低风量",
          datafield: "min_air_volume",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "最高风量",
          datafield: "max_air_volume",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "功率",
          datafield: "power",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "单价",
          datafield: "price_non_ccc",
          align: "center",
          cellsalign: "center",
        });
        break;
      default:
        // GDF
        // 超静音
        // 边墙
        // 边墙（防爆）
        that.source.datafields.push({ name: "pm_name", type: "string" });
        that.source.datafields.push({ name: "min_air_volume", type: "number" });
        that.source.datafields.push({ name: "max_air_volume", type: "number" });
        that.source.datafields.push({ name: "power", type: "string" });
        that.source.datafields.push({ name: "price_non_ccc", type: "number" });
        that.source.datafields.push({ name: "model", type: "string" });

        that.columns.push({
          text: "名称",
          datafield: "pm_name",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "最低风量",
          datafield: "min_air_volume",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "最高风量",
          datafield: "max_air_volume",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "功率",
          datafield: "power",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "单价",
          datafield: "price_non_ccc",
          align: "center",
          cellsalign: "center",
        });
        that.columns.push({
          text: "型号",
          datafield: "model",
          align: "center",
          cellsalign: "center",
        });
        break;
    }
    that.$refs.myGrid.updatebounddata();
  },
  methods: {},
};
</script>

<style>
</style>