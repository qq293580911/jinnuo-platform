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
    JqxChart,
  },
  props: {
    subject: {
      type: Number,
      default: 0,
    },
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: "name", map: "quoter", type: "string" },
        { name: "month", map: "month", type: "string" },
        { name: "count", map: "count", type: "number" },
        { name: "quote_share", map: "quote_share", type: "number" },
      ],
      url: "/api/qtnStat/getQuoterSinglePieChartByMonthGroup.do",
      data: {},
      async: false,
      datatype: "json",
      type: "Get",
    };
  },
  created() {
    this.source.data = { jsonParams: JSON.stringify(this.params) };
  },
  data() {
    return {
      params: {
        quoter: this.subject,
      },
      dataAdapter: new jqx.dataAdapter(this.source, {
        beforeLoadComplete: function (records) {
          if (records.length == 0) {
            records.push({ month: "其他", quote_share: 100 });
          }
        },
      }),
      title: "报价记录所占比",
      description: "该报价员占其个人本年度报价总份数百分比",
      legendLayout: {
        left: 480,
        top: 160,
        width: 300,
        height: 200,
        flow: "vertical",
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
              displayText: "month",
              labelRadius: 130,
              initialAngle: 15,
              radius: 100,
              centerOffset: 0,
              formatSettings: { decimalPlaces: 1 },
            },
          ],
        },
      ],
    };
  },
  watch: {
    subject(data) {
      // this.subject = data;
      // this.params.quoter = data;
      // this.refresh();
    },
  },
};
</script>

<style scoped>
</style>