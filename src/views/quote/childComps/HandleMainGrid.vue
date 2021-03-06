<template>
  <div class="mainGrid">
    <JqxGrid
      ref="myGrid"
      :width="'100%'"
      :height="'100%'"
      :localization="localization"
      :source="dataAdapter"
      :columns="columns"
      :editable="true"
      :editmode="'dblclick'"
      :columnsresize="true"
      :columnsautoresize="true"
      :selectionmode="'multiplerowsextended'"
      @rowselect="myGridOnRowSelect($event)"
      :showtoolbar="true"
      :rendertoolbar="rendertoolbar"
      :showstatusbar="true"
      :statusbarheight="35"
      :showaggregates="true"
    >
    </JqxGrid>
    <JqxLoader
      ref="myLoader"
      :text="'计算中...'"
      :imagePosition="'top'"
      :width="100"
      :height="60"
    >
    </JqxLoader>
    <show-more-window
      @showColumn="showColumn"
      @hiddenColumn="hiddenColumn"
      ref="showMoreWindow"
    ></show-more-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import JqxLoader from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxloader.vue'
import ShowMoreWindow from './ShowMoreWindow'
import { Message } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import { dataExport } from '@/common/util.js'
import { filterData, handle } from '@/network/quote.js'
export default {
  name: 'MainGrid',
  components: {
    JqxGrid,
    JqxLoader,
    ShowMoreWindow,
  },
  beforeCreate: function () {
    this.source = {
      datafields: [
        { name: 'serialNumber', type: 'number' },
        { name: 'productName', type: 'string' },
        { name: 'specModel', type: 'string' },
        { name: 'unit', type: 'string' },
        { name: 'quantity', type: 'number' },
        { name: 'unitPrice', type: 'number' },
        { name: 'totalPrice', type: 'number' },
        { name: 'remark', type: 'string' },
        { name: 'selection', type: 'string' },
        { name: 'transfer', type: 'string' },
        { name: 'formula', type: 'string' },
        { name: 'designateType', type: 'string' },
        { name: 'isCcc', type: 'boolean' },
        { name: 'processStatus', type: 'string' },
        { name: 'actuatorCount', map: 'filter>actuatorCount', type: 'number' },
        { name: 'specErrorDesc', type: 'array' },
      ],
      localdata: [],
    }
  },
  data() {
    const that = this
    return {
      firstHandle: true,
      showMore: false,
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        beforeLoadComplete: function (records) {
          records.forEach((item, index) => {
            const processStatus = item['processStatus']
            const unitPrice = item['unitPrice']
            // 处理状态
            if (processStatus === 'NON_FORMULA') {
              if (item['specModel'] == '') {
                item['unitPrice'] = ''
              } else {
                item['unitPrice'] = '无公式产品'
              }
            }
            if (processStatus === 'SELECTION_PRODUCT') {
              item['unitPrice'] = '需选型产品'
            }
            if (processStatus === 'SPEC_NOT_STANDARD') {
              item['unitPrice'] = '规格参数不规范'
            }
            // 单价
            if (/^\d+$/.test(unitPrice)) {
              item['unitPrice'] = unitPrice
            }
            // 执行器个数
            const actuatorCount = item['actuatorCount']
            if (actuatorCount) {
              item['selection'] = actuatorCount
            }
            // 合计
            const total = item['quantity'] * item['unitPrice']
            if (isNaN(total) || total === 0) {
              item['totalPrice'] = ''
            } else {
              item['totalPrice'] = total
            }
          })
        },
      }),
      columns: [
        {
          text: '序号',
          datafield: 'serialNumber',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
          width: 45,
        },
        {
          text: '名称',
          datafield: 'productName',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
          width: 200,
        },
        {
          text: '规格及型号',
          datafield: 'specModel',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
          width: 450,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            let cellElement = `<div class='jqx-center-align'>${rowdata['specModel']}</div>`
            if (rowdata['specErrorDesc']) {
              cellElement += `<div style='display: none'>${rowdata['specErrorDesc']} </div>`
            }
            return cellElement
          },
          cellclassname: function (row, columnfield, value) {
            const rowdata = that.$refs.myGrid.getrowdata(row)
            if (rowdata['specErrorDesc']) {
              return 'yellow'
            }
          },
        },
        {
          text: '单位',
          datafield: 'unit',
          columntype: 'dropdownlist',
          align: 'center',
          cellsalign: 'center',
          width: 45,
          cellclassname: function (row, columnfield, value) {
            const rowdata = that.$refs.myGrid.getrowdata(row)
            const specModel = rowdata['specModel']
            if (specModel != null && specModel != '') {
              if (
                /^[台,个]$/.test(value) == false &&
                value != null &&
                value != ''
              ) {
                return 'yellow'
              }
            }
          },
          createeditor: function (row, cellvalue, editor) {
            editor.jqxDropDownList({ source: ['台', '个'] })
          },
        },
        {
          text: '数量',
          datafield: 'quantity',
          columntype: 'numberinput',
          align: 'center',
          cellsalign: 'center',
          width: 45,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            if (rowdata.quantity == 'error') {
              return `<div style='margin: 6px;color: #ff0000;' class='jqx-center-align'>
                ${rowdata['quantity']}
                </div>`
            }
          },
          validation: function (cell, value) {
            if (value < 0 || value > 1500) {
              return { result: false, message: '数量只能在0-1500之间' }
            }
            return true
          },
          createeditor: function (row, cellvalue, editor) {
            editor.jqxNumberInput({ decimalDigits: 0, digits: 3 })
          },
          cellclassname: function (row, columnfield, value) {
            if (/^[1-9]+\d*$/.test(value) == false) {
              return 'yellow'
            }
          },
        },
        {
          text: '单价',
          datafield: 'unitPrice',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
          width: 100,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            const unitPrice = rowdata['unitPrice']
            if (unitPrice == '' || unitPrice == null) {
              return `<div class='jqx-center-align'></div>`
            }
            if (unitPrice == '需选型产品') {
              return `<div style='color: #008800;cursor: pointer;' class='jqx-center-align'>
                ${unitPrice}
                </div>`
            }
            if (unitPrice == '无公式产品') {
              return `<div style='color: #F37223;' class='jqx-center-align'>
                ${unitPrice}
                </div>`
            }
            if (rowdata.unitPrice == '规格参数不规范') {
              return `<div style='color: #f30507;' class='jqx-center-align'>
               ${unitPrice}
                </div>`
            }
            return `<div class='jqx-center-align'>
              ${that.dataAdapter.formatNumber(unitPrice, 'd0')}
              </div>`
          },
        },
        {
          text: '总价',
          datafield: 'totalPrice',
          cellbeginedit: true,
          align: 'center',
          aggregates: ['sum'],
          cellsalign: 'center',
          width: 100,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            const unitPrice = rowdata['unitPrice']
            const quantity = rowdata['quantity']
            if (unitPrice == '' || isNaN(unitPrice)) {
              return defaultvalue
            } else {
              const total = unitPrice * quantity
              return `<div class='jqx-center-align'>
                ${that.dataAdapter.formatNumber(total, 'd0')}</div>`
            }
          },
          aggregatesrenderer: that.aggregatesrenderer,
        },
        {
          text: '备注',
          datafield: 'remark',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
          width: 185,
          cellsrenderer: function (
            index,
            datafield,
            value,
            defaultvalue,
            column,
            rowdata
          ) {
            if (rowdata['processStatus'] == 'SELECTION_PRODUCT') {
              return `<div class='jqx-center-align'>${value} </div>`
            }
            return `<div class='jqx-center-align'> ${value} </div>`
          },
        },
        {
          text: '选型/执行器',
          datafield: 'selection',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '加点',
          datafield: 'transfer',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
          hidden: true,
          width: 100,
        },
        {
          text: '公式',
          datafield: 'formula',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
          hidden: true,
          width: 300,
        },
        {
          text: '指派类型',
          datafield: 'designateType',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
          hidden: true,
          width: 200,
        },
      ],
    }
  },
  watch: {
    showMore() {
      if (this.showMore) {
        const offset = $(`#${this.showMoreID}`).offset()
        const clientX = offset.left + 12
        const clientY = offset.top + 14
        this.$refs.showMoreWindow.open(clientX, clientY)
        $(`#${this.showMoreID}`).jqxButton({
          imgSrc: require(`@/assets/iconfont/custom/hidden.svg`),
        })
      } else {
        $(`#${this.showMoreID}`).jqxButton({
          imgSrc: require(`@/assets/iconfont/custom/show.svg`),
        })
        this.$refs.showMoreWindow.close()
      }
    },
  },
  mounted() {
    const that = this
    // 显示更多绑定事件
    this.showMoreButtonInstance.addEventHandler('click', () => {
      this.showMore = !this.showMore
    })

    // 接收到导入的请求，获取文本内容并筛选渲染
    this.$bus.$off('import').$on('import', () => {
      this.firstHandle = true
      const content = this.$store.state.currentQuote.content
      this.$store.dispatch('filterQuoteContent', content).then((response) => {
        const params = {
          jsonParams: JSON.stringify({
            content: response,
          }),
        }
        filterData(params).then((res) => {
          this.$store.dispatch('saveCurrentQuoteContent', res['content'])
          this.refresh()
        })
      })
    })

    // 接收到处理的请求，对阀门风口进行匹配价格
    this.$bus.$off('handler').$on('handler', () => {
      const gridContent = this.$refs.myGrid.getrows()
      if (gridContent.length < 1) {
        this.$message.warning(Message.NO_DATA)
        return false
      }
      let content = []
      const rows = this.$refs.myGrid.getrows()
      if (this.firstHandle) {
        // 如果是第一次处理，取网格全部数据
        content = rows
      } else {
        // 取选中的数据
        const selectedIndexes = this.$refs.myGrid.getselectedrowindexes()
        selectedIndexes.forEach((selectedIndex) => {
          const rowData = this.$refs.myGrid.getrowdata(selectedIndex)
          content.push(rowData)
        })
      }
      if (content.length == 0) {
        return false
      }
      const pricePlan = this.$store.state.currentQuote.pricePlan.rule
      const splitPlan = this.$store.state.currentQuote.splitPlan
      const params = {
        jsonParams: JSON.stringify({
          dataSource: content,
          priceRule: pricePlan,
          splitRule: splitPlan,
        }),
      }
      this.$refs.myLoader.open()
      handle(params).then((res) => {
        that.firstHandle = false
        this.$refs.myLoader.close()
        this.$store.dispatch('updateCurrentQuoteContent', res)
        this.refresh()
      })
    })

    // 接收到指派类型的请求，对产品类型进行鉴别
    this.$bus.$off('assign').$on('assign', (val) => {
      const rowIndexes = this.$refs.myGrid.getselectedrowindexes()
      rowIndexes.forEach((rowIndex) => {
        this.$refs.myGrid.setcellvalue(rowIndex, 'designateType', val)
      })
      this.$message.success(`指派了${rowIndexes.length}条`)
    })

    // 接收到筛选的请求，对数据进行筛选
    this.$bus.$off('filter').$on('filter', () => {
      const rows = this.$refs.myGrid.getrows()
      if (rows.length == 0) {
        this.$message.warning(Message.NO_DATA)
        return false
      }
      const selectedIndexes = this.$refs.myGrid.getselectedrowindexes()
      if (selectedIndexes.length == 0) {
        this.$message.warning('筛选条件太少了')
        return false
      }
      const firstProductName = this.$refs.myGrid.getcellvalue(
        selectedIndexes[0],
        'productName'
      )
      if (selectedIndexes.length > 1) {
        const allEqual = selectedIndexes.every((selectedIndex, index) => {
          const productName = that.$refs.myGrid.getcellvalue(
            selectedIndex,
            'productName'
          )
          return productName == firstProductName
        })
        if (allEqual == false) {
          this.$message.warning('筛选条件太多了')
          return false
        }
      }
      rows
        .filter((rowdata) => {
          return rowdata['productName'] == firstProductName
        })
        .forEach((item) => {
          that.$refs.myGrid.selectrow(item['uid'])
        })
    })

    // 接收到导出的请求，导出到excel
    this.$bus.$off('export').$on('export', () => {
      const name = `done_${this.$store.state.currentQuote.name}`
      const columns = this.$refs.myGrid.columns
      let content = this.$refs.myGrid.getrows()
      if (content.length < 1) {
        this.$message.warning(Message.NO_DATA)
        return false
      }
      content = content.map((item) => {
        let unitPrice = item['unitPrice']
        if (/\d+\.?\d+/.test(unitPrice) == false) {
          unitPrice = ''
        }
        let totalPrice = item['totalPrice']
        if (/\d+\.?\d+/.test(totalPrice) == false) {
          totalPrice = 0
        }
        const map = {
          serialNumber: item['serialNumber'],
          productName: item['productName'],
          specModel: item['specModel'],
          unit: item['unit'],
          quantity: item['quantity'],
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          remark: item['remark'],
          selection: item['selection'],
          transfer: item['transfer'],
          formula: item['formula'],
        }
        return map
      })
      const newColumns = {}
      newColumns.records = columns.records
      newColumns.records = newColumns.records.filter((item) => {
        return item['datafield'] != 'designateType'
      })

      dataExport(name, newColumns, content, {
        rowConfig: {
          start: 30,
          end: 30,
          other: 30,
        },
        colConfig: {
          A: 40,
          B: 120,
          C: 120,
          D: 40,
          E: 40,
          F: 80,
          G: 80,
          H: 80,
          I: 100,
          J: 40,
          k: 120,
          L: 100,
        },
        numberCol: ['序号', '数量', '单价', '总价'],
        mergeConf: [
          ['A' + [content.length + 2], 'F' + [content.length + 2]],
          ['G' + [content.length + 2], 'H' + [content.length + 2]],
        ],
        showTotalText: true,
        totalTextCell: 'serialNumber',
        formulaConfig: { totalPrice: ['E', '*', 'F'] },
      })
      this.$confirm({
        title: `要记录到今日报价吗？`,
        okText: '确认',
        cancelText: '取消',
        centered: true,
        content: (h) => <div style="color:red;"></div>,
        onOk() {
          const payload = {
            name,
            content,
          }
          that.$store.dispatch('saveTodayQuote', payload)
          that.$bus.$emit('refreshTodayQuote')
        },
        onCancel() {},
        class: 'test',
      })
    })

    // 接收到选型网格发过来的请求，对主网格进行数据更新
    this.$bus.$off('selectModel').$on('selectModel', (data) => {
      const selectedIndexes = this.$refs.myGrid.getselectedrowindexes()
      if (selectedIndexes.length < 1) {
        return false
      }
      const arr = selectedIndexes.map((rowIndex) => {
        const rowData = this.$refs.myGrid.getrowdata(rowIndex)
        rowData['unitPrice'] = data['price']
        rowData['remark'] = data['remark']
        rowData['selection'] = data['selection']
        rowData['addControlBox'] = data['addControlBox']
        return rowData
      })
      this.$store.dispatch('updateCurrentQuoteContent', arr)
      this.refresh()
    })

    // 接收到网格刷新请求，对主网格进行刷新
    this.$bus.$off('refresh').$on('refresh', () => {
      this.refresh()
    })

    // 当选型类型发生改变时，清除主网格的选择
    // this.$bus.$off('changeSelectionType').$on('changeSelectionType', () => {
    //   this.$refs.myGrid.clearselection()
    // })
  },
  methods: {
    rendertoolbar(toolbar) {
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      toolbar[0].appendChild(buttonsContainer)
      // 显示更多
      const showMoreContainer = document.createElement('div')
      this.showMoreID = JQXLite.generateID()
      showMoreContainer.id = this.showMoreID
      showMoreContainer.style.cssText = 'float: right;cursor: pointer;'
      buttonsContainer.appendChild(showMoreContainer)
      // 创建按钮
      this.showMoreButtonInstance = jqwidgets.createInstance(
        `#${this.showMoreID}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/show-more.svg`),
        }
      )

      jqwidgets.createInstance(`#${this.showMoreID}`, 'jqxTooltip', {
        content: '显示更多',
        position: 'mouse',
      })
    },
    aggregatesrenderer(aggregates, column, element) {
      let renderString = ''
      $.each(aggregates, function (key, value) {
        renderString += `<div class="jqx-center-align">合计: 
          ${value}</div>`
      })
      return renderString
    },
    refresh() {
      this.source.localdata = this.$store.state.currentQuote.content
      this.$refs.myGrid.updatebounddata()
    },
    myGridOnRowSelect(event) {
      const rowData = event.args.row
      const unit = rowData['unit']
      if (unit === '台') {
        // 初始化并设置选型参数
        this.$bus.$emit('setSelectionParams', rowData)
        // 暂存主网格数据
        this.$bus.$emit('savePrimaryGridRowData',rowData)
        this.$store.dispatch('saveCurrentQuotePrimaryGridRowData',rowData)
      }
    },
    showColumn(field) {
      this.$refs.myGrid.beginupdate()
      this.$refs.myGrid.showcolumn(field)
      this.$refs.myGrid.endupdate()
    },
    hiddenColumn(field) {
      this.$refs.myGrid.beginupdate()
      this.$refs.myGrid.hidecolumn(field)
      this.$refs.myGrid.endupdate()
    },
  },
  destroyed() {},
}
</script>

<style scoped>
.mainGrid {
  height: calc(100vh - 200px);
  overflow: unset;
}
::v-deep .jqx-center-align {
  line-height: 30px;
}
</style>
