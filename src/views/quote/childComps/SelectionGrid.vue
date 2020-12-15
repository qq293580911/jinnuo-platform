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
      @rowselect="onRowselect($event)"
      @rowclick="onRowClick($event)"
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from "jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue";

import { getLocalization } from "@/common/localization.js";
import {
  GENERAL_BLOWER,
  OUTSIDE_BUY,
  VENTILATOR,
  CONTROL_BOX,
  WALL_BLOWER,
  DUCT_BLOWER,
  MUTE_BLOWER,
  SIDE_WALL_BLOWER,
  SIDE_WALL_BLOWER_EP
} from "@/common/const.js";
export default {
  components: {
    JqxGrid
  },
  props: {
    selectionType: {
      type: String,
      default: null
    },
    columnGroupName: {
      type: String,
      default: ""
    }
  },
  beforeCreate() {
    this.source = {
      datafields: [],
      localdata: []
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
          name: "SelectionDetails",
          align: "left"
        }
      ]
    };
  },
  watch: {
    selectionType() {
      // console.log(this.selectionType);
    }
  },
  mounted() {
    const that = this;
    switch (that.selectionType) {
      case GENERAL_BLOWER:
        that.source.datafields.push({
          name: "pm_name",
          type: "string"
        });

        that.source.datafields.push({
          name: "min_air_volume",
          type: "number"
        });
        that.source.datafields.push({
          name: "max_air_volume",
          type: "number"
        });
        if (that.columnGroupName == "非3C") {
          that.source.datafields.push({
            name: "price_non_ccc",
            type: "number"
          });
        } else {
          that.source.datafields.push({
            name: "price_ccc",
            type: "number"
          });
        }
        that.source.datafields.push({ name: "power", type: "string" });
        that.source.datafields.push({ name: "remark", type: "string" });

        that.columns.push({
          text: "名称",
          columngroup: "SelectionDetails",
          datafield: "pm_name",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "最低风量",
          columngroup: "SelectionDetails",
          datafield: "min_air_volume",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "最高风量",
          columngroup: "SelectionDetails",
          datafield: "max_air_volume",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "功率",
          columngroup: "SelectionDetails",
          datafield: "power",
          align: "center",
          cellsalign: "center"
        });
        if (that.columnGroupName == "非3C") {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_non_ccc",
            align: "center",
            cellsalign: "center"
          });
        } else {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_ccc",
            align: "center",
            cellsalign: "center"
          });
        }

        that.columns.push({
          text: "备注",
          columngroup: "SelectionDetails",
          datafield: "remark",
          align: "center",
          cellsalign: "center",
          hidden: true
        });
        break;
      case OUTSIDE_BUY:
        that.source.datafields.push({
          name: "pm_name",
          type: "string"
        });

        that.source.datafields.push({
          name: "min_air_volume",
          type: "number"
        });
        that.source.datafields.push({
          name: "max_air_volume",
          type: "number"
        });
        if (that.columnGroupName == "非3C") {
          that.source.datafields.push({
            name: "price_non_ccc",
            type: "number"
          });
        } else {
          that.source.datafields.push({
            name: "price_ccc",
            type: "number"
          });
        }
        that.source.datafields.push({ name: "power", type: "string" });
        that.source.datafields.push({ name: "remark", type: "string" });

        that.columns.push({
          text: "名称",
          columngroup: "SelectionDetails",
          datafield: "pm_name",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "最低风量",
          columngroup: "SelectionDetails",
          datafield: "min_air_volume",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "最高风量",
          columngroup: "SelectionDetails",
          datafield: "max_air_volume",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "功率",
          columngroup: "SelectionDetails",
          datafield: "power",
          align: "center",
          cellsalign: "center"
        });
        if (that.columnGroupName == "非3C") {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_non_ccc",
            align: "center",
            cellsalign: "center"
          });
        } else {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_ccc",
            align: "center",
            cellsalign: "center"
          });
        }

        that.columns.push({
          text: "备注",
          columngroup: "SelectionDetails",
          datafield: "remark",
          align: "center",
          cellsalign: "center",
          hidden: true
        });
        break;
      case CONTROL_BOX:
        that.source.datafields.push({ name: "pm_name", type: "string" });
        if (that.columnGroupName == "非3C") {
          that.source.datafields.push({
            name: "price_non_ccc",
            type: "number"
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
          cellsalign: "center"
        });
        that.columns.push({
          text: "功率",
          columngroup: "SelectionDetails",
          datafield: "power",
          align: "center",
          cellsalign: "center"
        });
        if (that.columnGroupName == "非3C") {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_non_ccc",
            align: "center",
            cellsalign: "center"
          });
        } else {
          that.columns.push({
            text: "单价",
            columngroup: "SelectionDetails",
            datafield: "price_ccc",
            align: "center",
            cellsalign: "center"
          });
        }
        break;
      case VENTILATOR:
        that.source.datafields.push({ name: "name", type: "string" });
        that.source.datafields.push({ name: "air_volume", type: "string" });
        that.source.datafields.push({ name: "price", type: "number" });
        that.source.datafields.push({ name: "specification", type: "string" });
        that.source.datafields.push({ name: "panel_material", type: "string" });

        that.columns.push({
          text: "名称",
          datafield: "name",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "风量",
          datafield: "air_volume",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "单价",
          datafield: "price",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "规格",
          datafield: "specification",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "材质",
          datafield: "panel_material",
          align: "center",
          cellsalign: "center"
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
          cellsalign: "center"
        });
        that.columns.push({
          text: "最低风量",
          datafield: "min_air_volume",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "最高风量",
          datafield: "max_air_volume",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "功率",
          datafield: "power",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "单价",
          datafield: "price_non_ccc",
          align: "center",
          cellsalign: "center"
        });
        that.columns.push({
          text: "型号",
          datafield: "model",
          align: "center",
          cellsalign: "center"
        });
        break;
    }
    that.$refs.myGrid.updatebounddata();
  },
  methods: {
    refresh() {
      this.$refs.myGrid.updatebounddata();
    },
    onRowselect(event) {
      const rowData = event.args.row;
      const params = this.getSelectionRarams(rowData);
      this.$bus.$emit("selectModel", params);
      this.$emit('rowselect')
    },
    onRowClick(event) {
      const rowData = event.args.row.bounddata;
      const params = this.getSelectionRarams(rowData);
      this.$bus.$emit("selectModel", params);
      this.$emit('rowselect')
    },
    getSelectionRarams(rowData) {
      const machineName = rowData["pm_name"];
      let price = 0;
      if (rowData["price_non_ccc"]) {
        price = rowData["price_non_ccc"];
      } else if (rowData["price_ccc"]) {
        price = rowData["price_ccc"];
      } else {
        price = rowData["price"];
      }
      let remark = "非3C";
      let selection = "";
      let spec = "";
      let powerSupply = "";
      let addControlBox = false;
      switch (this.selectionType) {
        case GENERAL_BLOWER:
        {
          addControlBox = true;
          if (rowData["price_ccc"]) {
            remark = "3C";
          }
          if (/圆机/.test(machineName)) {
            remark += "圆机";
          } else {
            remark += "柜机";
          }
          selection += machineName.substring(0, machineName.indexOf("#") + 1);
          const power = rowData["power"];
          selection += `${power}KW`;
          if (/SWF/.test(machineName)) {
            remark += "（SWF）";
          }
          break;
        }
        case OUTSIDE_BUY:
        {
          remark += "圆机";
          selection += machineName.substring(0, machineName.indexOf("#") + 1);
          selection = `外购${selection}`;
          const power = rowData["power"];
          selection += `${power}KW`;
          break;
        }
        case CONTROL_BOX:
        {
          if (rowData["price_ccc"]) {
            remark = "3C";
          }
          if (/单电源/.test(machineName)) {
            powerSupply = "单电源";
          } else {
            powerSupply = "双电源";
          }
          remark += powerSupply;
          const power = rowData["power"];
          selection += `${power}KW`;
          break;
        }
        case VENTILATOR:
          selection = rowData["specification"];
          break;
        case WALL_BLOWER:
        {
          remark += "圆机";
          const power = rowData["power"];
          selection += `${power}KW`;
          spec = rowData["model"];
          selection += " " + spec;
          break;
        }
        case DUCT_BLOWER:
        {
          remark += "圆机";
          const power = rowData["power"];
          selection += `${power}KW`;
          spec = rowData["model"];
          selection += " " + spec;
          break;
        }
        case MUTE_BLOWER:
        {
          remark += "圆机";
          const power = rowData["power"];
          selection += `${power}KW`;
          spec = rowData["model"];
          selection += " " + spec;
          break;
        }

        case SIDE_WALL_BLOWER:
        {
          remark += "圆机";
          const power = rowData["power"];
          selection += `${power}KW`;
          spec = rowData["model"];
          selection += " " + spec;
          break;
        }
        case SIDE_WALL_BLOWER_EP:
        {
          remark += "圆机";
          const power = rowData["power"];
          selection += `${power}KW`;
          spec = rowData["model"];
          selection += " " + spec;
          break;
        }
        default:
          break;
      }
      const map = {
        addControlBox,
        price,
        remark,
        selection
      };
      return map
    },
    selectrow(rowIndex) {
      this.$refs.myGrid.selectrow(rowIndex);
    },
    clearselection() {
      this.$refs.myGrid.clearselection()
    }
  }
};
</script>

<style scoped>
</style>
