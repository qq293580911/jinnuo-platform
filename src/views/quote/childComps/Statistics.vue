<template>
  <div :style="contentStyle">
    <JqxTabs
      ref="myTabs"
      :width="'100%'"
      :height="'100%'"
      :position="'top'"
      :animationType="'none'"
      :selectionTracker="false"
      :showCloseButtons="true"
    >
      <ul>
        <li style="margin-left: 30px">报价员</li>
        <!-- <li>业务员</li> -->
      </ul>
      <div>
        <chart-toolbar
          ref="chartToolbar"
          @changeSubject="changeSubject"
          @changeStartDate="changeStartDate"
          @changeEndDate="changeEndDate"
          @changeDateMode="changeDateMode"
        ></chart-toolbar>
        <chart-layout ref="chartLayout">
          <slot slot="top">
            <!-- 上部柱状图 -->
            <column-chart
              ref="columnChart"
              :date-mode="dateMode"
              :start-date="startDate"
              :end-date="endDate"
              :subject="subject"
              :model="'报价员'"
            ></column-chart>
          </slot>
          <slot slot="bottomLeft">
            <!-- 下左 饼状图个人 -->
            <pie-chart-single
              ref="pieChartSingle"
              :subject="subject"
            ></pie-chart-single>
          </slot>
          <!-- 下中 饼状图所有 -->
          <slot slot="bottomCenter">
            <pie-chart-all
              ref="pieChartSingle"
              :subject="subject"
              :start-date="startDate"
              :end-date="endDate"
            ></pie-chart-all>
          </slot>
          <!-- 下右 所有占比网格化 -->
          <slot slot="bottomRight">
            <ratio-grid
              ref="ratioGrid"
              :subject="subject"
              :start-date="startDate"
              :end-date="endDate"
            ></ratio-grid>
          </slot>
        </chart-layout>
      </div>
      <!-- <div>业务员</div> -->
    </JqxTabs>
  </div>
</template>

<script>
import JqxTabs from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtabs.vue'
import ChartToolbar from './ChartToolbar'
import ChartLayout from './ChartLayout'
import ColumnChart from './ColumnChart'
import PieChartSingle from './PieChartSingle'
import PieChartAll from './PieChartAll'
import RatioGrid from './RatioGrid'

import { contentHeight } from '@/common/mixin.js'
export default {
  components: {
    JqxTabs,
    ChartToolbar,
    ChartLayout,
    ColumnChart,
    PieChartSingle,
    PieChartAll,
    RatioGrid,
  },
  mixins:[contentHeight],
  data() {
    const that = this
    return {
      dateMode: 'days',
      startDate: (() => {
        const date = new Date()
        const startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).format('yyyy-MM-dd')
        return startDate
      })(),
      endDate: (() => {
        const date = new Date()
        const endDate = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).format('yyyy-MM-dd')
        return endDate
      })(),
      subject: (() => {
        const quoters = that.$store.state.quoters
        const firstQuoter = quoters[0]['emp_id']
        return firstQuoter
      })(),
    }
  },
  mounted() {},
  methods: {
    init(data) {
      this.subject = data['quoter']
      this.startDate = data['startDate']
      this.endDate = data['endData']
      this.dateMode = data['dateMode']
      this.model = '报价员'
    },
    changeSubject(data) {
      this.subject = data
    },
    changeStartDate(data) {
      this.startDate = data
    },
    changeEndDate(data) {
      this.endDate = data
    },
    changeDateMode(data) {
      this.dateMode = data
    },
  },
}
</script>

<style scoped>
</style>
