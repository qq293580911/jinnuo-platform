<template>
  <JqxChart
    ref="myChart"
    style="width: 100%; height: 100%"
    :title="title"
    :description="description"
    :showLegend="true"
    :enableAnimations="false"
    :showBorderLine="true"
    :padding="padding"
    :titlePadding="titlePadding"
    :source="dataAdapter"
    :legendLayout="legendLayout"
    :seriesGroups="seriesGroups"
    :colorScheme="'scheme01'"
  >
  </JqxChart>
</template>

<script>
import JqxChart from "jqwidgets-scripts/jqwidgets-vue/vue_jqxchart.vue";
export default {
  components: {
    JqxChart
  },
  props: {
    subject: {
      type: Number,
      default: 0
    },
    startDate: {
      type: String,
      default: ""
    },
    endDate: {
      type: String,
      default: ""
    }
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: "name", map: "quoter", type: "string" },
        { name: "count", map: "count", type: "number" },
        { name: "amount", map: "amount", type: "number" },
        { name: "month_avg_count", map: "month_avg_count", type: "number" },
        { name: "month_avg_amount", map: "month_avg_amount", type: "number" },
        { name: "quote_share", map: "quote_share", type: "number" }
      ],
      url: "/api/qtnStat/getPieChartDataByQuoterGroup.do",
      data: {},
      async: false,
      datatype: "json",
      type: "Get"
    };
  },
  created() {
    this.source.data = { jsonParams: JSON.stringify(this.params) };
  },
  data() {
    const that = this;
    return {
      params: {
        quoter: this.subject,
        startDate: this.startDate,
        endDate: this.endDate
      },
      dataAdapter: new jqx.dataAdapter(this.source, {
        beforeLoadComplete: function(records) {
          if (records.length == 0) {
            records.push({ month: "其他", quote_share: 100 });
          }
          that.$nextTick(() => {
            that.$bus.$emit("refreshRatioGrid", records);
          });
        }
      }),
      title: "报价记录所占比",
      description: "所选日期区段各报价员占报价总份数百分比",
      legendLayout: {
        left: 480,
        top: 160,
        width: 300,
        height: 200,
        flow: "vertical"
      },
      padding: { left: 5, top: 5, right: 5, bottom: 5 },
      titlePadding: { left: 0, top: 0, right: 0, bottom: 10 },
      seriesGroups: [
        {
          type: "pie",
          showLabels: true,
          series: [
            {
              dataField: "quote_share",
              displayText: "name",
              labelRadius: 130,
              initialAngle: 15,
              radius: 100,
              centerOffset: 0,
              formatSettings: { decimalPlaces: 1 }
            }
          ]
        }
      ]
    };
  },
  watch: {
    subject(data) {
      this.params.quoter = data;
      this.refresh();
    },
    startDate(data) {
      this.params.startDate = data;
      this.refresh();
    },
    endDate(data) {
      this.params.endDate = data;
      this.refresh();
    }
  },
  methods: {
    refresh() {
      this.source.data = { jsonParams: JSON.stringify(this.params) };
      this.dataAdapter.dataBind();
      this.$refs.myChart.refresh();
    }
  }
};
</script>

<style scoped>
</style>
