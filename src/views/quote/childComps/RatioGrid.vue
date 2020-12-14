<template>
  <div style="width: 100%; height: 100%;padding:2px;">
    <JqxGrid
      ref="myGrid"
      :width="'100%'"
      :height="'100%'"
      :localization="localization"
      :source="dataAdapter"
      :columns="columns"
      :columnsresize="true"
      :columnsautoresize="true"
      :sortable="true"
      :filterable="true"
      :altrows="true"
      :enabletooltip="true"
      :editable="false"
      :selectionmode="'multiplerowsextended'"
      :rendergridrows="rendergridrows"
      :showstatusbar="true"
      :statusbarheight="35"
      :showaggregates="true"
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
  beforeCreate() {
    this.source = {
      dataFields: [
        { name: "name", type: "string" },
        { name: "count", type: "number" },
        { name: "amount", type: "number" },
        { name: "month_avg_count", type: "number" },
        { name: "month_avg_amount", type: "number" },
        { name: "quote_share", type: "number" },
      ],
      datatype: "json",
      localdata: [],
    };
  },
  data() {
    const that = this;
    return {
      localization: getLocalization("zh-CN"),
      dataAdapter: new jqx.dataAdapter(this.source),
      rendergridrows: function (obj) {
        return obj.data;
      },
      columns: [
        {
          text: "报价员",
          datafield: "name",
          cellsalign: "center",
          align: "center",
        },
        {
          text: "报价份数",
          datafield: "count",
          cellsalign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer,
        },
        {
          text: "报价金额",
          datafield: "amount",
          cellsalign: "center",
          align: "center",
          aggregates: ["sum"],
          aggregatesrenderer: that.aggregatesRenderer,
        },
        {
          text: "月平均份数",
          datafield: "month_avg_count",
          cellsalign: "center",
          align: "center",
        },
        {
          text: "月平均金额",
          datafield: "month_avg_amount",
          cellsalign: "center",
          align: "center",
        },
        {
          text: "报价占比",
          datafield: "quote_share",
          cellsalign: "center",
          align: "center",
        },
      ],
    };
  },
  mounted() {
    this.$bus.$off("refreshRatioGrid").$on("refreshRatioGrid", (data) => {
      this.source.localdata = data;
      this.$refs.myGrid.updatebounddata("cells");
    });
  },
  methods: {
    aggregatesRenderer(aggregates, column, element) {
      var renderString = "";
      $.each(aggregates, function (key, value) {
        switch (key) {
          case "sum":
            renderString +=
              '<div style="position: relative; line-height: 35px; text-align: center; overflow: hidden;">' +
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