<template>
  <div style="width:100%;height:300px">
    <column-chart
      ref="columnChart"
      :date-mode="dateMode"
      :start-date="startDate"
      :end-date="endDate"
      :subject="subject"
      :model="'报价员'"
    >
    </column-chart>
  </div>
</template>

<script>
import ColumnChart from "@/views/quote/childComps/ColumnChart";
export default {
  components: {
    ColumnChart,
  },
  created() {},
  data() {
    return {
      dateMode: "days",
      startDate: "2020-7-01",
      endDate: "2020-7-31",
      subject: 280,
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>