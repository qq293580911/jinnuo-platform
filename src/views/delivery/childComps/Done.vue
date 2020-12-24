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
      :pagesizeoptions="[5, 10, 15, 20, 25, 30]"
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
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'

import { getLocalization } from '@/common/localization.js'
import {
  formatFilter,
  calc_misc_tax,
  calc_misc_log_manage_fee,
  calc_misc_warranty,
  calc_misc_freight,
  calc_rsv_p,
} from '@/common/util.js'
import { showDeliveryDoneList } from '@/network/delivery.js'
import { contentHeight } from '@/common/mixin.js'
export default {
  components: {
    JqxGrid,
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
        { name: 'logistics_management_fee', type: 'string' },
        { name: 'freight', type: 'string' },
        { name: 'tax', type: 'string' },
        { name: 'warranty', type: 'string' },
        { name: 'delivery_amount', type: 'number' },
        { name: 'delivery_reserve_price', type: 'number' },
        { name: 'not_consideration_commission_order_amount', type: 'number' },
        { name: 'over_budget_bear', type: 'string' },
        { name: 'actual_freight', type: 'number' },
        { name: 'consideration_commission_status', type: 'string' },
        { name: 'remark', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/dlvDtl/showDeliveryDoneList.do`,
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
          showDeliveryDoneList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
        beforeLoadComplete(records) {
          const orderNumbers = []
          records.forEach(function (value, index, array) {
            const ordAmt = value['order_amount']
            const dlvAmt = value['delivery_amount']
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
            } else {
              orderNumbers.push(orderNumber)
            }
            value['install_fee'] = installFee

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
      rendergridrows: function (obj) {
        return obj.data
      },
      columns: [
        {
          text: '送货日期',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'delivery_date',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '大区',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'salesman_company',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '办事处',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'salesman_agency',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '业务员',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'salesman',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '省',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'province',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '市',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'city',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '县',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'county',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '合同编号',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'contract_number',
          width: 120,
          cellclassname: 'green',
        },
        {
          text: '合同金额',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'contract_amount',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '下单编号',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'order_number',
          width: 150,
          cellclassname: 'green',
        },
        {
          text: '项目名称',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'project_name',
          width: 150,
          cellclassname: 'green',
        },
        {
          text: '下单金额',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'order_amount',
          width: 100,
          aggregates: ['sum'],
            aggregatesrenderer: that.aggregatesRenderer,
          cellclassname: 'green',
        },
        {
          text: '送货金额',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'delivery_amount',
          width: 100,
          aggregates: ['sum'],
            aggregatesrenderer: that.aggregatesRenderer,
          cellclassname: 'green',
        },
        {
          text: '送货物流管理费',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'delivery_logistics_management_fee',
          width: 120,
          cellclassname: 'green',
        },
        {
          text: '送货运费',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'delivery_freight',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '送货税金',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'delivery_tax',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '送货质保金',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'delivery_warranty',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '送货底价',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'delivery_reserve_price',
          width: 100,
          aggregates: ['sum'],
          aggregatesrenderer: that.aggregatesRenderer,
          cellclassname: 'green',
        },
        {
          text: '非3C风阀送货金额',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'not_consideration_commission_delivery_amount',
          width: 150,
          cellclassname: 'green',
        },
        {
          text: '非3C风阀送货物流管理费',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'not_consideration_commission_logistics_management_fee',
          width: 180,
          cellclassname: 'green',
        },
        {
          text: '非3C风阀运费',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'not_consideration_commission_freight',
          width: 120,
          cellclassname: 'green',
        },
        {
          text: '非3C风阀税金',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'not_consideration_commission_tax',
          width: 120,
          cellclassname: 'green',
        },
        {
          text: '非3C风阀质保金',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'not_consideration_commission_warranty',
          width: 120,
          cellclassname: 'green',
        },
        {
          text: '非3C风阀送货底价',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'not_consideration_commission_delivery_reserve_price',
          width: 120,
          cellclassname: 'green',
        },
        {
          text: '超点承担',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'over_budget_bear',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '实际运费',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'actual_freight',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '未送货金额',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'undelivered_amount',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '计提成状态',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'consideration_commission_status',
          width: 100,
          cellclassname: 'green',
        },
        {
          text: '备注',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'remark',
          width: 100,
          cellclassname: 'green',
        },
      ],
    }
  },
  methods: {
    createButtonsContainers: function (toolbar) {},
    aggregatesRenderer(aggregates, column, element) {
      const that = this
      let renderString = ''
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
    refresh() {
      this.$refs.myGrid.updatebounddata()
    },
  },
}
</script>

<style>
</style>