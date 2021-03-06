<template>
  <div :style="contentStyle">
    <JqxGrid
      ref="myGrid"
      :width="'100%'"
      :height="'100%'"
      :localization="localization"
      :source="dataAdapter"
      :columns="columns"
      :showtoolbar="true"
      :rendertoolbar="createButtonsContainers"
      :columnsresize="true"
      :columnsautoresize="true"
      :showgroupaggregates="true"
      :showstatusbar="true"
      :statusBarHeight="30"
      :showaggregates="true"
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'

import { formatFilter, dataExport } from '@/common/util.js'
import { getLocalization } from '@/common/localization.js'
import { contentHeight } from '@/common/mixin.js'
import { showTubeList } from '@/network/sales.js'
export default {
  name: 'SalesTube',
  components: {
    JqxGrid,
  },
  mixins: [contentHeight],
  beforeCreate() {
    this.params = {
      startDate: (function () {
        const date = new Date()
        const startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        ).format('yyyy-MM-dd')
        return startDate
      })(),
      endDate: (function () {
        const date = new Date()
        const endDate = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).format('yyyy-MM-dd')
        return endDate
      })(),
    }

    this.source = {
      datafields: [
        { name: 'salesman_company', type: 'string' },
        { name: 'salesman_agency', type: 'string' },
        { name: 'salesman', type: 'string' },
        { name: 'is_resign', type: 'string' },
        { name: 'contract_count', type: 'number' },
        { name: 'contract_amount', type: 'number' },
        { name: 'order_area', type: 'float' },
        { name: 'delivery_area', type: 'float' },
      ],
      url: '/sales/showSalesTube.do',
      type: 'get',
      datatype: 'json',
    }
  },
  data() {
    const that = this
    return {
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata)
          serverdata.jsonParams = JSON.stringify(that.params)
          showTubeList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
        beforeLoadComplete(records) {},
      }),
      columns: [
        {
          text: '大区',
          datafield: 'salesman_company',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '办事处',
          datafield: 'salesman_agency',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '业务员',
          datafield: 'salesman',
          cellsAlign: 'center',
          align: 'center',
          aggregates: ['count'],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: '离职状态',
          datafield: 'is_resign',
          cellsAlign: 'center',
          align: 'center',
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == '在职') {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                '</span>'
              )
            } else {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #ff0000;">' +
                value +
                '</span>'
              )
            }
          },
        },
        {
          text: '合同份数',
          datafield: 'contract_count',
          cellsAlign: 'center',
          align: 'center',
          aggregates: ['sum'],
          cellsformat: 'd',
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: '合同金额',
          datafield: 'contract_amount',
          cellsAlign: 'center',
          align: 'center',
          cellsformat: 'd',
          aggregates: ['sum'],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: '下单面积',
          datafield: 'order_area',
          cellsAlign: 'center',
          align: 'center',
          aggregates: ['sum'],
          cellsformat: 'd',
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: '送货面积',
          datafield: 'delivery_area',
          cellsAlign: 'center',
          align: 'center',
          cellsformat: 'd',
          aggregates: ['sum'],
          aggregatesrenderer: this.aggregatesRenderer,
        },
      ],
    }
  },
  mounted() {},
  methods: {
    createButtonsContainers: function (statusbar) {
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      const startDateContainer = document.createElement('div')
      const endDateContainer = document.createElement('div')
      const exportButtonContainer = document.createElement('div')
      const reloadButtonContainer = document.createElement('div')

      const startDateContainerID = JQXLite.generateID()
      const endDateContainerID = JQXLite.generateID()
      const exportButtonContainerID = JQXLite.generateID()
      const reloadButtonContainerID = JQXLite.generateID()

      startDateContainer.id = startDateContainerID
      endDateContainer.id = endDateContainerID
      exportButtonContainer.id = exportButtonContainerID
      reloadButtonContainer.id = reloadButtonContainerID

      startDateContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      endDateContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      exportButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      reloadButtonContainer.style.cssText =
        'float:right;margin-left: 5px;  cursor: pointer;'

      buttonsContainer.appendChild(startDateContainer)
      // 区间符
      const joiner = document.createElement('span')
      joiner.style.cssText = 'float: left;margin-left: 5px;line-height:20px;'
      joiner.innerHTML = '-'
      buttonsContainer.appendChild(joiner)
      buttonsContainer.appendChild(endDateContainer)
      buttonsContainer.appendChild(exportButtonContainer)
      buttonsContainer.appendChild(reloadButtonContainer)
      statusbar[0].appendChild(buttonsContainer)
      // 创建部件
      const startDate = jqwidgets.createInstance(
        `#${startDateContainerID}`,
        'jqxDateTimeInput',
        {
          width: 150,
          formatString: 'yyyy-MM-dd',
          value: new Date(this.params.startDate),
        }
      )

      const endDate = jqwidgets.createInstance(
        `#${endDateContainerID}`,
        'jqxDateTimeInput',
        {
          width: 150,
          formatString: 'yyyy-MM-dd',
          value: new Date(this.params.endDate),
        }
      )

      const exportButton = jqwidgets.createInstance(
        `#${exportButtonContainerID}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/export.svg`),
        }
      )

      const reloadButton = jqwidgets.createInstance(
        `#${reloadButtonContainerID}`,
        'jqxButton',
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      )
      jqwidgets.createInstance(`#${reloadButtonContainerID}`, 'jqxTooltip', {
        content: '刷新',
        position: 'bottom',
      })

      // 日期选择绑定事件
      startDate.addEventHandler('change', (event) => {
        this.params.startDate = event.target.value
        this.$refs.myGrid.updatebounddata()
      })

      endDate.addEventHandler('change', (event) => {
        this.params.endDate = event.target.value
        this.$refs.myGrid.updatebounddata()
      })
      // 按钮绑定事件

      exportButton.addEventHandler('click', (event) => {
        const rowsData = this.$refs.myGrid.getrows()
        const columns = this.$refs.myGrid.columns
        dataExport('销售统计-风管.xlsx', columns, rowsData, {
          numberCol: [`合同份数`, '合同金额', `下单面积`, `送货面积`],
        })
      })

      reloadButton.addEventHandler('click', (event) => {
        this.$refs.myGrid.updatebounddata()
      })
    },
    aggregatesRenderer(aggregates, column, element) {
      var renderString = ''
      $.each(aggregates, function (key, value) {
        switch (key) {
          case 'sum':
            renderString +=
              '<div style="position: relative; line-height: 30px; text-align: center; overflow: hidden;">' +
              '合计' +
              ': ' +
              value +
              '</div>'
            break
        }
      })
      return renderString
    },
  },
}
</script>

<style scoped>
</style>
