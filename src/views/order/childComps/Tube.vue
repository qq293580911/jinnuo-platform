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
      :editable="true"
      :editmode="'dblclick'"
      :selectionmode="'multiplerowsextended'"
      :virtualmode="true"
      :rendergridrows="rendergridrows"
      :showstatusbar="true"
      :showaggregates="true"
      :statusbarheight="30"
      :rowdetails="true"
      :initrowdetails="initrowdetails"
      :rowdetailstemplate="rowdetailstemplate"
      @cellclick="onCellclick($event)"
    >
    </JqxGrid>
    <JqxMenu
      ref="jqxMenu"
      :mode="'popup'"
      :autoOpenPopup="false"
      :width="120"
      :height="140"
      @itemclick="onItemclick($event)"
    >
      <div>
        <ul>
          <li>添加送货信息</li>
        </ul>
      </div>
    </JqxMenu>
    <order-window ref="orderWindow"></order-window>
    <order-import-window ref="orderImportWindow"></order-import-window>
    <delivery-window
      ref="deliveryWindow"
      :order-number-disabled="true"
      :project-name-disabled="true"
    ></delivery-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import JqxMenu from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue'

import OrderImportWindow from '../childComps/OrderImportWindowTube'
import OrderWindow from '../childComps/OrderWindowTube'
import DeliveryWindow from '@/components/content/delivery/DeliveryTubeWindow'

import { getLocalization } from '@/common/localization.js'
import { formatFilter, dataExport } from '@/common/util.js'
import { contentHeight } from '@/common/mixin.js'
import {
  Message,
  ADD_ORDER,
  EDIT_ORDER,
  ADD_DELIVERY,
  EDIT_DELIVERY,
} from '@/common/const'
import {
  showTubeOrderList,
  deleteOrder,
  getDeliveryByOrderNumber,
} from '@/network/order.js'

import { deleteDelivery } from '@/network/delivery.js'
export default {
  name: 'TubeOrder',
  components: {
    JqxMenu,
    JqxGrid,
    OrderImportWindow,
    OrderWindow,
    DeliveryWindow,
  },
  mixins: [contentHeight],
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      dataFields: [
        { name: 'id', type: 'number' },
        { name: 'product_type', type: 'string' },
        { name: 'order_date', type: 'string' },
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
        { name: 'province', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'county', type: 'string' },
        { name: 'final_price', type: 'number' },
        { name: 'order_amount', type: 'number' },
        { name: 'actual_freight', type: 'number' },
        {
          name: 'consideration_commission_status',
          type: 'string',
        },
        { name: 'delivery_date', type: 'string' },
        { name: 'delivery_amount', type: 'number' },
        { name: 'remark', type: 'string' },
        { name: 'order_area', type: 'float' },
        { name: 'delivery_area', type: 'float' },
        { name: 'creator', type: 'number' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/ordDtl/showOrderDetailTubeList.do`,
    }
  },
  data() {
    const that = this
    return {
      // 数据网格
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata)
          showTubeOrderList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
        beforeLoadComplete(records) {
          records.forEach((item) => {
            const ordAmt = item['order_amount']
            const dlvAmt = item['delivery_amount']
            const unDlvAmt = ordAmt - dlvAmt
            item['undelivered_amount'] = unDlvAmt
          })
        },
      }),
      pagesizeoptions: (() => {
        return [20,25, 30, 50, 100, 500, 1000, 3000, 5000, 7000, 10000]
      })(),
      rendergridrows: function (obj) {
        return obj.data
      },
      columns: (function () {
        const columns = []
        columns.push({
          text: '下单日期',
          datafield: 'order_date',
          cellsformat: 'yyyy-MM-dd',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '大区',
          datafield: 'salesman_company',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '办事处',
          datafield: 'salesman_agency',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '业务员',
          datafield: 'salesman_name',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '省',
          datafield: 'province',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '市',
          datafield: 'city',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '县',
          datafield: 'county',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '合同编号',
          datafield: 'contract_number',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 150,
        })
        columns.push({
          text: '合同金额',
          datafield: 'contract_amount',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '下单编号',
          datafield: 'order_number',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 150,
        })
        columns.push({
          text: '项目名称',
          datafield: 'project_name',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          width: 200,
        })
        columns.push({
          text: '下单金额',
          datafield: 'order_amount',
          align: 'center',
          cellsalign: 'center',
          cellclassname: that.cellClass,
          aggregates: ['sum'],
          aggregatesrenderer: that.aggregatesRenderer,
          width: 100,
        })
        columns.push({
          text: '送货日期',
          datafield: 'delivery_date',
          cellsAlign: 'center',
          align: 'center',
          cellclassname: that.cellClass,
          width: 100,
        })
        columns.push({
          text: '送货金额',
          datafield: 'delivery_amount',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: that.cellClass,
          aggregates: ['sum'],
          aggregatesrenderer: that.aggregatesRenderer,
        })
        columns.push({
          text: '未送货金额',
          datafield: 'undelivered_amount',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: that.cellClass,
        })
        columns.push({
          text: '下单面积',
          datafield: 'order_area',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: that.cellClass,
          aggregates: ['sum'],
          aggregatesrenderer: that.aggregatesRenderer,
        })
        columns.push({
          text: '送货面积',
          datafield: 'delivery_area',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: that.cellClass,
          aggregates: ['sum'],
          aggregatesrenderer: that.aggregatesRenderer,
        })
        columns.push({
          text: '实际运费',
          datafield: 'actual_freight',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: that.cellClass,
        })
        columns.push({
          text: '计提成状态',
          datafield: 'consideration_commission_status',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: that.cellClass,
        })
        columns.push({
          text: '备注',
          datafield: 'remark',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: that.cellClass,
        })
        return columns
      })(),
      rowdetailstemplate: {
        rowdetails:
          "<div style='margin: 10px;'>" +
          "<ul style='margin-left: 30px;'>" +
          "<li class='title'>送货</li>" +
          '</ul>' +
          "<div class='deliveryGrid' style='border-style: none;'></div>" +
          '</div>',
        rowdetailsheight: 220,
        rowdetailshidden: true,
      },
    }
  },
  mounted() {
    const gridId = this.$refs.myGrid.componentSelector
    $(gridId).on('contextmenu', () => {
      return false
    })
  },
  methods: {
    createButtonsContainers: function (toolbar) {
      const that = this
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      const addButtonContainer = document.createElement('div')
      const deleteButtonContainer = document.createElement('div')
      const editButtonContainer = document.createElement('div')
      const importButtonContainer = document.createElement('div')
      const exportButtonContainer = document.createElement('div')
      const reloadButtonContainer = document.createElement('div')
      const addButtonID = JQXLite.generateID()
      const deleteButtonID = JQXLite.generateID()
      const editButtonID = JQXLite.generateID()
      const importButtonID = JQXLite.generateID()
      const exportButtonID = JQXLite.generateID()
      const reloadButtonID = JQXLite.generateID()
      addButtonContainer.id = addButtonID
      deleteButtonContainer.id = deleteButtonID
      editButtonContainer.id = editButtonID
      importButtonContainer.id = importButtonID
      exportButtonContainer.id = exportButtonID
      reloadButtonContainer.id = reloadButtonID
      addButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      deleteButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      editButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      importButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      exportButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      reloadButtonContainer.style.cssText =
        'float:right;margin-left: 5px;  cursor: pointer;'
      buttonsContainer.appendChild(addButtonContainer)
      buttonsContainer.appendChild(deleteButtonContainer)
      buttonsContainer.appendChild(editButtonContainer)
      buttonsContainer.appendChild(importButtonContainer)
      buttonsContainer.appendChild(exportButtonContainer)
      buttonsContainer.appendChild(reloadButtonContainer)
      toolbar[0].appendChild(buttonsContainer)
      // 添加
      const addButtonInstance = jqwidgets.createInstance(
        `#${addButtonID}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
        }
      )
      jqwidgets.createInstance(`#${addButtonID}`, 'jqxTooltip', {
        content: '添加',
        position: 'bottom',
      })
      addButtonInstance.addEventHandler('click', () => {
        this.$refs.orderWindow.open(ADD_ORDER)
      })

      // 删除
      const deleteButtonInstance = jqwidgets.createInstance(
        `#${deleteButtonID}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
        }
      )
      jqwidgets.createInstance(`#${deleteButtonID}`, 'jqxTooltip', {
        content: '删除',
        position: 'bottom',
      })
      deleteButtonInstance.addEventHandler('click', () => {
        const selectedrowindexes = this.$refs.myGrid.getselectedrowindexes()
        if (selectedrowindexes.length < 1) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED })
          return false
        }
        this.$confirm({
          title: `${Message.CONFIRM_DELETE}`,
          okText: '确认',
          cancelText: '取消',
          centered: true,
          okType: 'danger',
          content: (h) => <div style="color:red;"></div>,
          onOk() {
            const ids = selectedrowindexes.map((item) => {
              return {
                id: that.$refs.myGrid.getrowid(item),
              }
            })
            that.delete(ids)
          },
          onCancel() {},
          class: 'test',
        })
      })
      // 修改
      const editButtonInstance = jqwidgets.createInstance(
        `#${editButtonID}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
        }
      )
      jqwidgets.createInstance(`#${editButtonID}`, 'jqxTooltip', {
        content: '编辑',
        position: 'bottom',
      })
      editButtonInstance.addEventHandler('click', () => {
        const selectedrowindex = this.$refs.myGrid.getselectedrowindex()
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED })
          return false
        }
        const rowData = this.$refs.myGrid.getrowdata(selectedrowindex)
        this.$refs.orderWindow.open(EDIT_ORDER, rowData)
      })

      // 导入
      const importButtonInstance = jqwidgets.createInstance(
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
      importButtonInstance.addEventHandler('click', () => {
        this.$refs.orderImportWindow.open()
      })

      // 导出
      const exportButtonInstance = jqwidgets.createInstance(
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

      exportButtonInstance.addEventHandler('click', () => {
        const columns = this.$refs.myGrid.columns
        const rowsData = this.$refs.myGrid.getrows()
        dataExport('下单详细数据汇总—风管.xlsx', columns, rowsData, {
          numberCol: [
            '合同金额',
            '下单金额',
            '送货金额',
            '未送货金额',
            '下单面积',
            '送货面积',
            '实际运费',
          ],
        })
      })

      // 刷新
      const reloadButton = jqwidgets.createInstance(
        `#${reloadButtonID}`,
        'jqxButton',
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      )
      this.refreshInstance = jqwidgets.createInstance(
        `#${reloadButtonID}`,
        'jqxTooltip',
        {
          content: '刷新',
          position: 'bottom',
        }
      )
      reloadButton.addEventHandler('click', (event) => {
        this.$refs.myGrid.clearfilters()
      })
    },
    cellClass(row, columnfield, value) {
      const deliveryDate = this.$refs.myGrid.getcellvalue(row, 'delivery_date')
      const orderAmount = this.$refs.myGrid.getcellvalue(row, 'order_amount')
      const deliveryAmount = this.$refs.myGrid.getcellvalue(
        row,
        'delivery_amount'
      )

      if (orderAmount == deliveryAmount) {
        if (
          new Date(deliveryDate) < new Date('2018-10-01') ||
          deliveryDate == null ||
          deliveryDate == ''
        ) {
          return ''
        }
        if (deliveryDate != null && deliveryDate != '') {
          return 'green'
        }
      }
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
    initrowdetails(index, parentElement, gridElement, record) {
      parentElement.style['z-index'] = 1000
      const tabsDiv = $($(parentElement).children()[0])
      let childGrid = null
      if (tabsDiv != null) {
        childGrid = tabsDiv.find('.deliveryGrid')
        const container = $('<div style="margin: 5px;"></div>')
        container.appendTo($(childGrid))
        jqwidgets.createInstance(tabsDiv, 'jqxTabs', {
          width: '96%',
          height: 170,
        })
      }
      const orderNumber = record.order_number.toString()
      const jsonParams = {
        orderNumber,
      }
      const source = {
        datafields: [
          { name: 'id', type: 'number' },
          { name: 'order_number', type: 'string' },
          { name: 'order_amount', type: 'number' },
          { name: 'project_name', type: 'string' },
          { name: 'delivery_date', type: 'string' },
          { name: 'delivery_amount', type: 'number' },
          { name: 'delivery_reserve_price', type: 'number' },
          { name: 'logistics_management_fee', type: 'string' },
          { name: 'freight', type: 'string' },
          { name: 'tax', type: 'string' },
          { name: 'warranty', type: 'string' },
        ],
        id: 'id',
        url: '/dlvDtl/showDeliveryDetailByOrderNumber.do',
        type: 'get',
        data: { jsonParams: JSON.stringify(jsonParams) },
        dataType: 'json',
      }

      const nestedGridAdapter = new $.jqx.dataAdapter(source, {
        formatData: function (data) {
          return data
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata)
          getDeliveryByOrderNumber(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
      })

      const childGridInstance = jqwidgets.createInstance(childGrid, 'jqxGrid', {
        localization: getLocalization('zh-CN'),
        source: nestedGridAdapter,
        width: '100%',
        height: '100%',
        editable: true,
        editmode: 'dblclick',
        columns: [
          {
            text: '送货日期',
            datafield: 'delivery_date',
            cellsAlign: 'center',
            align: 'center',
          },
          {
            text: '送货金额',
            datafield: 'delivery_amount',
            cellsAlign: 'center',
            align: 'center',
          },
          {
            text: '送货底价',
            datafield: 'delivery_reserve_price',
            cellsAlign: 'center',
            align: 'center',
          },
          {
            text: '',
            datafield: 'Delete',
            columntype: 'button',
            width: 50,
            cellsrenderer: () => {
              return '删除'
            },
            buttonclick: (rowindex) => {
              this.$confirm({
                title: `${Message.CONFIRM_DELETE}`,
                okText: '确认',
                cancelText: '取消',
                centered: true,
                content: (h) => <div style="color:red;"></div>,
                onOk() {
                  const id = childGridInstance.getrowid(rowindex)
                  const params = {
                    jsonParams: JSON.stringify({
                      id,
                    }),
                  }
                  deleteDelivery(params).then((res) => {})
                },
                onCancel() {},
                class: 'test',
              })
            },
          },
          {
            text: '',
            datafield: 'Edit',
            columntype: 'button',
            width: 50,
            cellsrenderer: () => {
              return '编辑'
            },
            buttonclick: (rowindex) => {
              this.childGridInstance = childGridInstance
              const installFee = this.$refs.myGrid.getcellvalue(
                rowindex,
                'install_fee'
              )
              const rowData = childGridInstance.getrowdata(rowindex)
              rowData['install_fee'] = installFee
              this.$refs.deliveryWindow.open(EDIT_DELIVERY, rowData)
            },
          },
        ],
      })
    },
    onCellclick(event) {
      if (event.args.rightclick) {
        const clickCellInfo = event.args
        this.clickCellInfo = clickCellInfo
        const scrollTop = $(window).scrollTop()
        const scrollLeft = $(window).scrollLeft()
        this.$refs.jqxMenu.open(
          parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
          parseInt(event.args.originalEvent.clientY) + 5 + scrollTop
        )
        return false
      }
    },
    onItemclick(event) {
      const menu = event.args.textContent
      if (menu == ADD_DELIVERY) {
        const rowData = this.clickCellInfo.row.bounddata
        this.$refs.deliveryWindow.open(ADD_DELIVERY, rowData)
      }
    },
    delete(ids) {
      const params = {
        jsonParams: JSON.stringify({
          ids,
        }),
      }
      deleteOrder(params).then((res) => {
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
