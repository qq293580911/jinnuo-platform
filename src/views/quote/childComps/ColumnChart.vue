<template>
  <JqxChart
    ref="myChart"
    style="width: 100%; height: 100%"
    :title="title"
    :description="description"
    :enableAnimations="true"
    :showLegend="true"
    :padding="padding"
    :titlePadding="titlePadding"
    :source="dataAdapter"
    :xAxis="xAxis"
    :seriesGroups="seriesGroups"
    :colorScheme="colorScheme"
  >
  </JqxChart>
</template>
<script>
import JqxChart from "jqwidgets-scripts/jqwidgets-vue/vue_jqxchart.vue";

import { formatDate } from "@/common/util";
import { getQuoterColumnChartData } from "@/network/quote";
export default {
  components: {
    JqxChart,
  },
  beforeCreate: function () {
    this.source = {
      datafields: [
        { name: "years", map: "years", type: "string" },
        { name: "months", map: "months", type: "string" },
        { name: "days", map: "days", type: "string" },
        { name: "quoter", map: "quoter", type: "string" },
        { name: "count", map: "count", type: "number" },
      ],
      url: "/api/qtnStat/getQuoterQuotationColumnChartData.do",
      data: {},
      async: false,
      datatype: "json",
      type: "Get",
    };
  },
  props: {
    dateMode: {
      type: String,
      default: "days",
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    subject: {
      type: Number,
      default: 0,
    },
    model: {
      type: String,
      default: "报价员",
    },
  },
  created() {
    this.source.data = { jsonParams: JSON.stringify(this.params) };
  },
  data: function () {
    const that = this;
    return {
      params: {
        quoter: this.subject,
        startDate: this.startDate,
        endDate: this.endDate,
        dateMode: this.dateMode,
        model: this.model,
      },
      dataAdapter: new jqx.dataAdapter(this.source),
      title: "报价员报价份数记录",
      description: "所选择日期区间的记录",
      enableAnimations: true,
      showLegend: true,
      padding: { left: 5, top: 5, right: 5, bottom: 5 },
      titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
      colorScheme: "scheme01",
      xAxis: {
        dataField: "days",
        displayText: "日",
        type: "date",
        baseUnit: "day",
        formatFunction: function (value) {
          if (value) {
            const dateMode = that.dateMode;
            switch (dateMode) {
              case "days":
                value = new Date(value).format("dd");
                break;
              case "months":
                value = new Date(value).format("yyyy-MM");
                break;
              case "years":
                value = new Date(value).format("yyyy");
                break;
              default:
                break;
            }
            return value;
          }
          return "";
        },
        showGridLines: true,
      },
      seriesGroups: [
        {
          type: "column",
          columnsGapPercent: 25,
          seriesGapPercent: 10,
          columnsMaxWidth: 40,
          columnsMinWidth: 1,
          valueAxis: {
            unitInterval: 5,
            minValue: 0,
            maxValue: 50,
            extraordinary: 30,
            displayValueAxis: true,
            description: "",
            axisSize: "auto",
            tickMarksColor: "#888888",
          },
          series: [
            {
              dataField: "count",
              displayText: "份",
              labels: {
                visible: true,
                verticalAlignment: "top",
                offset: { x: 0, y: -20 },
              },
              colorFunction: function (value, itemIndex, serie, group) {
                const dateMode = that.dateMode;
                switch (dateMode) {
                  case "days":
                    return value > 40
                      ? "#DD001B"
                      : value > 30
                      ? "#1CA261"
                      : "#2682EE";
                    break;
                  case "months":
                    return value > 700
                      ? "#DD001B"
                      : value > 500
                      ? "#1CA261"
                      : "#2682EE";
                    break;
                  case "years":
                    return value > 15000
                      ? "#DD001B"
                      : value > 10000
                      ? "#1CA261"
                      : "#2682EE";
                    break;
                  default:
                    break;
                }
              },
              formatFunction: function (value) {
                if (value) {
                  return value;
                }
                return "";
              },
            },
          ],
        },
      ],
    };
  },
  watch: {
    subject(data) {
      this.subject = data;
      this.params.quoter = data;
      this.refresh();
    },
    startDate(data) {
      this.startDate = data;
      this.params.startDate = data;
      this.refresh();
    },
    endDate(data) {
      this.endDate = data;
      this.params.endDate = data;
      this.refresh();
    },
    dateMode(data) {
      switch (data) {
        case "days":
          this.seriesGroups[0].valueAxis.maxValue = 50;
          this.seriesGroups[0].valueAxis.unitInterval = 5;
          this.xAxis.dataField = "days";
          this.xAxis.displayText = "日";
          this.xAxis.baseUnit = "day";
          break;
        case "months":
          this.seriesGroups[0].valueAxis.maxValue = 1000;
          this.seriesGroups[0].valueAxis.unitInterval = 100;
          this.xAxis.dataField = "months";
          this.xAxis.displayText = "月";
          this.xAxis.baseUnit = "month";
          break;
        case "years":
          this.seriesGroups[0].valueAxis.maxValue = 10000;
          this.seriesGroups[0].valueAxis.unitInterval = 1000;
          this.xAxis.dataField = "years";
          this.xAxis.displayText = "年";
          this.xAxis.baseUnit = "year";
          break;
        default:
          break;
      }
      this.dateMode = data;
      this.params.dateMode = data;
      this.refresh();
    },
  },
  methods: {
    refresh() {
      this.source.data = { jsonParams: JSON.stringify(this.params) };
      this.dataAdapter.dataBind();
      this.$refs.myChart.refresh();
    },
  },
};
</script>
<style scoped>
</style>