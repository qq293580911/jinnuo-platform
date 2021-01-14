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
      :pageable="true"
      :pagesize="20"
      :pagesizeoptions="pagesizeoptions"
      :sortable="true"
      :filterable="true"
      :altrows="true"
      :enabletooltip="true"
      :editable="false"
      :selectionmode="'multiplerowsextended'"
      :virtualmode="true"
      :rendergridrows="rendergridrows"
      :showstatusbar="true"
      :showaggregates="true"
      :statusbarheight="30"
    >
    </JqxGrid>
    <import-window ref="deliveryImportWindow"></import-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import ImportWindow from './ImportWindow'
import { getLocalization } from '@/common/localization.js'
import {
  formatFilter,
  calc_misc_tax,
  calc_misc_log_manage_fee,
  calc_misc_warranty,
  calc_misc_freight,
  calc_rsv_p,
  dataExport,
} from '@/common/util.js'
import { Message, IMPORT_DELIVERY } from '@/common/const.js'
import { showDeliveryDetailList, syncToServer } from '@/network/delivery.js'
import { contentHeight } from '@/common/mixin.js'
export default {
  components: {
    JqxGrid,
    ImportWindow,
  },
  mixins: [contentHeight],
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      dataFields: [
        { name: 'id', type: 'number' },
        { name: 'delivery_date', type: 'string' },
        { name: 'salesman_company', type: 'string' },
        { name: 'salesman_agency', type: 'string' },
        { name: 'salesman_name', type: 'string' },
        { name: 'salesman', type: 'number' },
        { name: 'province', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'county', type: 'string' },
        { name: 'contract_number', type: 'string' },
        { name: 'contract_amount', type: 'number' },
        { name: 'order_number', type: 'string' },
        { name: 'project_name', type: 'string' },
        { name: 'order_amount', type: 'number' },
        { name: 'delivery_amount', type: 'string' },
        { name: 'consideration_commission_order_amount', type: 'number' },
        { name: 'not_consideration_commission_order_amount', type: 'number' },
        { name: 'logistics_management_fee', type: 'string' },
        { name: 'freight', type: 'string' },
        { name: 'tax', type: 'string' },
        { name: 'warranty', type: 'string' },
        { name: 'install_fee', type: 'number' },
        { name: 'over_budget_bear', type: 'string' },
        { name: 'actual_freight', type: 'number' },
        { name: 'consideration_commission_status', type: 'string' },
        { name: 'remark', type: 'string' },
        { name: 'order_area', type: 'float' },
        { name: 'delivery_area', type: 'float' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/dlvDtl/showDeliveryDetailList.do`,
    }
  },
  data() {
    return {
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata)
          showDeliveryDetailList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
        beforeLoadComplete(records) {
          const orderNumbers = []
          records.forEach((value) => {
            let ordAmt = value['order_amount']
            let dlvAmt = value['delivery_amount']
            let logManageFee = value['logistics_management_fee']
            let freight = value['freight']
            let tax = value['tax']
            let warranty = value['warranty']

            //  安装费只在一条送货数据里体现
            const orderNumber = value['order_number']
            const has = orderNumbers.includes(orderNumber, 0)
            let installFee = 0
            if (has == false) {
              installFee =
                value['install_fee'] == null ? 0 : value['install_fee']
            } 
            value['install_fee'] = installFee
            orderNumbers.push(orderNumber)

            if (logManageFee == '' || logManageFee == null) {
              logManageFee = 0
            }

            if (freight == '' || logManageFee == null) {
              freight = 0
            }

            if (tax == '' || tax == null) {
              tax = 0
            }

            if (warranty == '' || warranty == null) {
              warranty = 0
            }

            // 计算送货税金
            const dlvTax = calc_misc_tax(dlvAmt, installFee, tax)
            value['delivery_tax'] = dlvTax

            // 计算送货物流管理费
            const dlvLogManageFee = calc_misc_log_manage_fee(
              dlvAmt,
              installFee,
              logManageFee
            )
            value['delivery_logistics_management_fee'] = dlvLogManageFee

            // 计算送货质保金
            const dlvWrt = calc_misc_warranty(dlvAmt, installFee, warranty)
            value['delivery_warranty'] = dlvWrt

            // 计算送货运费
            const dlvFreight = calc_misc_freight(
              dlvAmt,
              installFee,
              dlvTax,
              dlvLogManageFee,
              dlvWrt,
              freight
            )
            value['delivery_freight'] = dlvFreight

            // 计算送货底价
            const dlvRsvP = calc_rsv_p(
              dlvAmt,
              installFee,
              dlvLogManageFee,
              dlvFreight,
              dlvTax,
              dlvWrt
            )
            value['delivery_reserve_price'] = dlvRsvP
            // 未送货金额
            const unDlvAmt = ordAmt - dlvAmt
            isNaN(unDlvAmt)
              ? (value['undelivered_amount'] = ordAmt)
              : (value['undelivered_amount'] = unDlvAmt)
          })
        },
      }),
      pagesizeoptions: (() => {
        return [20,25, 30, 50, 100, 500, 1000, 3000, 5000, 7000, 10000]
      })(),
      rendergridrows: function (obj) {
        return obj.data
      },
      columns: [
        {
          text: '送货日期',
          datafield: 'delivery_date',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
        },
        {
          text: '大区',
          datafield: 'salesman_company',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        },
        {
          text: '办事处',
          datafield: 'salesman_agency',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        },
        {
          text: '业务员',
          datafield: 'salesman_name',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        },
        {
          text: '省',
          datafield: 'province',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        },
        {
          text: '市',
          datafield: 'city',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        },
        {
          text: '县',
          datafield: 'county',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        },
        {
          text: '合同编号',
          datafield: 'contract_number',
          align: 'center',
          cellsalign: 'center',
          width: 150,
        },
        {
          text: '合同金额',
          datafield: 'contract_amount',
          align: 'center',
          cellsalign: 'center',
          width: 100,
        },
        {
          text: '下单编号',
          datafield: 'order_number',
          align: 'center',
          cellsalign: 'center',
          width: 150,
        },
        {
          text: '项目名称',
          datafield: 'project_name',
          align: 'center',
          cellsalign: 'center',
          width: 180,
        },
        {
          text: '下单金额',
          datafield: 'order_amount',
          align: 'center',
          cellsalign: 'center',
          width: 100,
          aggregates: ['sum'],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: '送货金额',
          datafield: 'delivery_amount',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
          aggregates: ['sum'],
          aggregatesrenderer: this.aggregatesRenderer,
        },

        {
          text: '税金',
          datafield: 'tax',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
        },
        {
          text: '物流管理费',
          datafield: 'logistics_management_fee',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
        },
        {
          text: '质保金',
          datafield: 'warranty',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
          editable: false,
        },
        {
          text: '运费',
          datafield: 'freight',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
        },
        {
          text: '安装费',
          datafield: 'install_fee',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
          editable: false,
        },
        {
          text: '送货税金',
          datafield: 'delivery_tax',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '送货物流管理费',
          datafield: 'delivery_logistics_management_fee',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '送货质保金',
          datafield: 'delivery_warranty',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '送货运费',
          datafield: 'delivery_freight',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '送货底价',
          datafield: 'delivery_reserve_price',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
          aggregates: ['sum'],
          aggregatesrenderer: this.aggregatesRenderer,
        },
        {
          text: '超点承担',
          datafield: 'over_budget_bear',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '实际运费',
          datafield: 'actual_freight',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '未送货金额',
          datafield: 'undelivered_amount',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '计提成状态',
          datafield: 'consideration_commission_status',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == '已终止') {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                '</span>'
              )
            }
            if (value == '进行中') {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #9CD7FF;">' +
                value +
                '</span>'
              )
            }
            return (
              '<span style="width:100%;display:block; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px; color: #ff0000;">' +
              value +
              '</span>'
            )
          },
        },
        {
          text: '备注',
          datafield: 'remark',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '下单面积',
          datafield: 'order_area',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
        {
          text: '送货面积',
          datafield: 'delivery_area',
          cellsAlign: 'center',
          align: 'center',
          width: 125,
        },
      ],
    }
  },
  mounted() {},
  methods: {
    createButtonsContainers: function (toolbar) {
      const that = this
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      toolbar[0].appendChild(buttonsContainer)

      const syncButtonContainer = document.createElement('div')
      const importButtonContainer = document.createElement('div')
      const exportButtonContainer = document.createElement('div')
      const reloadButtonContainer = document.createElement('div')

      const syncButtonID = JQXLite.generateID()
      const importButtonID = JQXLite.generateID()
      const exportButtonID = JQXLite.generateID()
      const reloadButtonID = JQXLite.generateID()

      syncButtonContainer.id = syncButtonID
      importButtonContainer.id = importButtonID
      exportButtonContainer.id = exportButtonID
      reloadButtonContainer.id = reloadButtonID

      syncButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      importButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      exportButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      reloadButtonContainer.style.cssText =
        'float:right;margin-left: 5px;  cursor: pointer;'
      // 同步
      if (this.hasAuthority(this, 'dlvDtl:update')) {
        buttonsContainer.appendChild(syncButtonContainer)
        const syncInstance = jqwidgets.createInstance(
          `#${syncButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/async.svg`),
          }
        )
        jqwidgets.createInstance(`#${syncButtonID}`, 'jqxTooltip', {
          content: '同步数据到服务器',
          position: 'bottom',
        })
        syncInstance.addEventHandler('click', () => {
          this.$confirm({
            title: `${Message.CONFIRM_SYNCHRONIZE}`,
            okText: '确认',
            cancelText: '取消',
            centered: true,
            content: (h) => <div style="color:red;"></div>,
            onOk() {
              const rowsData = that.$refs.myGrid.getrows()
              const data = rowsData.map((item) => {
                return {
                  order_number: item['order_number'],
                  delivery_date: item['delivery_date'],
                  delivery_amount: item['delivery_amount'],
                  delivery_reserve_price: item['delivery_reserve_price'],
                  delivery_area: item['delivery_area'],
                  id: item['id'],
                }
              })
              that.syncToServer(data)
            },
            onCancel() {},
            class: 'test',
          })
        })
      }

      // 导入
      if (this.hasAuthority(this, 'dlvDtl:import')) {
        buttonsContainer.appendChild(importButtonContainer)
        const importInstance = jqwidgets.createInstance(
          `#${importButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/import.svg`),
          }
        )
        jqwidgets.createInstance(`#${importButtonID}`, 'jqxTooltip', {
          content: '导入',
          position: 'bottom',
        })

        importInstance.addEventHandler('click', () => {
          this.$refs.deliveryImportWindow.open(IMPORT_DELIVERY)
        })
      }

      // 导出
      if (this.hasAuthority(this, 'dlvDtl:export')) {
        buttonsContainer.appendChild(exportButtonContainer)
        const exportInstance = jqwidgets.createInstance(
          `#${exportButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/export.svg`),
          }
        )
        jqwidgets.createInstance(`#${exportButtonID}`, 'jqxTooltip', {
          content: '导出',
          position: 'bottom',
        })
        exportInstance.addEventHandler('click', () => {
          const columns = this.$refs.myGrid.columns
          const rowsData = this.$refs.myGrid.getrows()
          dataExport('送货详细数据汇总.xlsx', columns, rowsData, {
            numberCol: [
              '合同金额',
              '下单金额',
              '送货金额',
              '送货税金',
              '送货物流管理费',
              '送货质保金',
              '送货运费',
              '送货底价',
              '安装费',
              '实际运费',
              '未送货金额',
              '下单面积',
              '送货面积',
            ],
          })
        })
      }

      buttonsContainer.appendChild(reloadButtonContainer)
      const reloadButton = jqwidgets.createInstance(
        `#${reloadButtonID}`,
        'jqxButton',
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      )
      jqwidgets.createInstance(`#${reloadButtonID}`, 'jqxTooltip', {
        content: '刷新',
        position: 'bottom',
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
    syncToServer(data) {
      const params = {
        jsonParams: JSON.stringify({
          items: data,
        }),
      }
      syncToServer(params).then((res) => {
        this.refresh()
      })
    },
    refresh() {
      this.$refs.myGrid.updatebounddata()
    },
  },
}
</script>

<style scoped>
</style>
