<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'90%'"
      :height="'90%'"
      :autoOpen="false"
      :position="{ x: '20%', y: '5%' }"
    >
      <div>
        <JqxGrid
            ref="myGrid"
            :width="'99.8%'"
            :height="'99.7%'"
            :localization="localization"
            :source="dataAdapter"
            :columns="columns"
            :showtoolbar="true"
            :rendertoolbar="createButtonsContainers"
            :altrows="true"
            :enabletooltip="true"
            :selectionmode="'multiplerowsextended'"
          >
          </JqxGrid>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import Vue from 'vue'
import JqxWindow from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue'
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import CustomUploader from '@/components/common/CustomUploader'
import { getLocalization } from '@/common/localization.js'
import { Message } from '@/common/const'
import {
  calc_misc_log_manage_fee,
  calc_misc_freight,
  calc_misc_tax,
  calc_misc_warranty,
  calc_rsv_p,
} from '@/common/util'
import { getRelatedOrderInfo, importDelivery } from '@/network/delivery.js'
export default {
  components: {
    JqxWindow,
    JqxGrid,
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: 'delivery_date', type: 'string' },
        { name: 'order_number', type: 'string' },
        { name: 'delivery_amount', type: 'number' },
        { name: 'logistics_management_fee', type: 'string' },
        { name: 'freight', type: 'string' },
        { name: 'tax', type: 'string' },
        { name: 'warranty', type: 'string' },
        { name: 'install_fee', type: 'string' }
      ],
      dataType: 'json',
      localdata: [],
    }
  },
  data() {
    const that = this
    return {
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        beforeLoadComplete(records) {
          records.forEach((item) => {
            const dlvAmt = item['delivery_amount']
            const logManageFee = item['logistics_management_fee']
            const freight = item['freight']
            const tax = item['tax']
            const warranty = item['warranty']
            const installFee = item['install_fee']
            // 计算送货杂费
            const dlvLogManageFee = calc_misc_log_manage_fee(
              dlvAmt,
              installFee,
              logManageFee
            )
            const dlvTax = calc_misc_tax(dlvAmt, installFee, tax)
            const dlvWarranty = calc_misc_warranty(dlvAmt, installFee, warranty)
            const dlvFreight = calc_misc_freight(
              dlvAmt,
              installFee,
              dlvLogManageFee,
              dlvTax,
              dlvWarranty,
              freight
            )
            // 计算送货底价
            const dlvRsvP = calc_rsv_p(
              dlvAmt,
              dlvLogManageFee,
              dlvFreight,
              dlvTax,
              dlvWarranty,
              installFee
            )
            item['delivery_reserve_price'] = dlvRsvP
          })
        },
      }),
      columns: [
        {
          text: '送货日期',
          dataField: 'delivery_date',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: function (row, columnfield, value, data) {
            var r = value.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/)
            if (r == null) {
              return 'yellow'
            }
            return ''
          },
        },
        {
          text: '下单编号',
          dataField: 'order_number',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '送货金额',
          dataField: 'delivery_amount',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '物流管理费',
          dataField: 'logistics_management_fee',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '运费',
          dataField: 'freight',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '税金',
          dataField: 'tax',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '质保金',
          dataField: 'warranty',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '安装费',
          dataField: 'install_fee',
          cellsAlign: 'center',
          align: 'center',
        },
        {
          text: '送货底价',
          dataField: 'delivery_reserve_price',
          cellsAlign: 'center',
          align: 'center',
        }
      ],
      fileContent: [],
      startRow: 0,
      endRow: 0,
      allowedFormat: true,
    }
  },
  watch: {
    startRow() {
      if (this.endRow < this.startRow) {
        this.$message.warning(Message.END_ROW_LESS_THAN_START_ROW)
      } else {
        this.allowedFormat = true
        const data = this.fileContent.slice(this.startRow, this.endRow)
        data.forEach((item) => {
          item['deliveryDate'] = item['delivery_date']
          item['deliveryAmount'] = item['delivery_amount']
          item['orderNumber'] = item['order_number']
        })
        const params = {
          jsonParams: JSON.stringify({
            items: data,
          }),
        }
        getRelatedOrderInfo(params).then((res) => {
          this.source.localdata = res
          this.$refs.myGrid.updatebounddata()
        })
      }
    },
    endRow() {
      if (this.endRow < this.startRow) {
        this.$message.warning(Message.END_ROW_LESS_THAN_START_ROW)
      } else {
        this.allowedFormat = true
        const data = this.fileContent.slice(this.startRow, this.endRow)
        data.forEach((item) => {
          item['deliveryDate'] = item['delivery_date']
          item['deliveryAmount'] = item['delivery_amount']
          item['orderNumber'] = item['order_number']
        })
        const params = {
          jsonParams: JSON.stringify({
            items: data,
          }),
        }
        getRelatedOrderInfo(params).then((res) => {
          this.source.localdata = res
          this.$refs.myGrid.updatebounddata()
        })
      }
    },
  },
  mounted() {
    const that = this
    // 上传器绑定值改变事件
    this.uploaderInstance.$off('changed').$on('changed', (data) => {
      const sheetName = Object.keys(data[0])[0]
      const fileContent = data[0][sheetName]
      fileContent.forEach(function (value, index) {
        if (index > 0) {
          value['delivery_date'] = LAY_EXCEL.dateCodeFormat(
            value['delivery_date'],
            'YYYY-MM-DD'
          )
          value['delivery_amount'] = parseFloat(
            value['delivery_amount']
          ).toFixed(2)
        }
      })
      that.fileContent = fileContent
      that.source.localdata = that.fileContent
      that.$refs.myGrid.updatebounddata()
    })
    // 开始行绑定选择事件
    this.startRowInstance.addEventHandler('valueChanged', (event) => {
      const startRow = event.args.value
      that.startRow = startRow
    })
    // 结束行绑定选择事件
    this.endRowInstance.addEventHandler('valueChanged', (event) => {
      const endRow = event.args.value
      that.endRow = endRow
    })
    // 确认导入按钮绑定点击事件
    this.importInstance.addEventHandler('click', () => {
      if (this.fileContent.length == 0) {
        this.$message.warning(Message.NOT_FOUND_CONTENT)
        return false
      }
      if (this.allowedFormat == false) {
        this.$message.warning(Message.NOT_ALLOWED_FORMAT)
        return false
      }
      // 导入前再确认
      this.$confirm({
        title: `${Message.CONFIRM_IMPORT}`,
        okText: '确认',
        cancelText: '取消',
        centered: true,
        content: (h) => <div style="color:red;"></div>,
        onOk() {
          that.import()
        },
        onCancel() {},
        class: 'test',
        zIndex: 1500,
      })
    })
  },
  methods: {
    createButtonsContainers: function (toolbar) {
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      toolbar[0].appendChild(buttonsContainer)
      // 上传器
      const uploadContainer = document.createElement('div')
      uploadContainer.classList.add('tool-item')
      buttonsContainer.appendChild(uploadContainer)
      const uploader = document.createElement('div')
      const uploaderID = JQXLite.generateID()
      uploader.id = uploaderID
      uploadContainer.appendChild(uploader)
      const uploaderComponent = Vue.extend(CustomUploader)
      this.uploaderInstance = new uploaderComponent({
        propsData: {
          width: 190,
          height: 25,
          type: 'jqxInput',
          showUploadButton: true,
          fieldsCofig: {
            fields: {
              delivery_date: 'A',
              order_number: 'B',
              delivery_amount: 'C'
            },
          },
        },
      }).$mount(`#${uploaderID}`)
      // 开始行
      let spanContainer = document.createElement('span')
      spanContainer.classList.add('tool-item')
      spanContainer.innerHTML = '开始行：'
      const startRowContainer = document.createElement('div')
      const startRowID = JQXLite.generateID()
      startRowContainer.id = startRowID
      startRowContainer.classList.add('tool-item')
      buttonsContainer.appendChild(spanContainer)
      buttonsContainer.appendChild(startRowContainer)
      this.startRowInstance = jqwidgets.createInstance(
        `#${startRowID}`,
        'jqxNumberInput',
        {
          width: 100,
          height: 25,
          min: 0,
          decimalDigits: 0,
          digits: 5,
          spinButtons: true,
        }
      )
      // 结束行
      spanContainer = document.createElement('span')
      spanContainer.classList.add('tool-item')
      spanContainer.innerHTML = '结束行：'
      buttonsContainer.appendChild(spanContainer)
      const endRowContainer = document.createElement('div')
      const endRowID = JQXLite.generateID()
      endRowContainer.id = endRowID
      endRowContainer.classList.add('tool-item')
      buttonsContainer.appendChild(endRowContainer)
      this.endRowInstance = jqwidgets.createInstance(
        `#${endRowID}`,
        'jqxNumberInput',
        {
          width: 100,
          height: 25,
          min: 0,
          decimalDigits: 0,
          digits: 5,
          spinButtons: true,
        }
      )

      // 确认导入按钮
      const confirmContainer = document.createElement('div')
      confirmContainer.classList.add('tool-item')
      const confirmButtonID = JQXLite.generateID()
      confirmContainer.id = confirmButtonID
      buttonsContainer.appendChild(confirmContainer)
      this.importInstance = jqwidgets.createInstance(
        `#${confirmButtonID}`,
        'jqxButton',
        { height: 25, width: 40, value: '确认' }
      )
      jqwidgets.createInstance(`#${confirmButtonID}`, 'jqxTooltip', {
        content: '确认导入',
        position: 'bottom',
      })

      // 批量修改按钮
      // const batchUpdateContainer = document.createElement('div')
      // batchUpdateContainer.classList.add('tool-item')
      // const batchUpdateButtonID = JQXLite.generateID()
      // batchUpdateContainer.id = batchUpdateButtonID
      // buttonsContainer.appendChild(batchUpdateContainer)
      // this.batchUpdateInstance = jqwidgets.createInstance(
      //   `#${batchUpdateButtonID}`,
      //   'jqxButton',
      //   {
      //     width: 25,
      //     height: 25,
      //     imgSrc: require(`@/assets/iconfont/custom/batch-update.svg`),
      //   }
      // )
      // jqwidgets.createInstance(`#${batchUpdateButtonID}`, 'jqxTooltip', {
      //   content: '批量更新',
      //   position: 'bottom',
      // })
      // 字段选择
      // const fieldSelection = document.createElement('div')
      // const fieldSelectionID = JQXLite.generateID()
      // fieldSelection.id = fieldSelectionID
      // fieldSelection.classList.add('tool-item')
      // buttonsContainer.appendChild(fieldSelection)
      // this.fieldSelectionInstance = jqwidgets.createInstance(
      //   `#${fieldSelectionID}`,
      //   'jqxDropDownList',
      //   {
      //     source: ['实际运费', '计提成状态'],
      //     width: 100,
      //     height: 25,
      //   }
      // )
    },
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      this.$refs.myWindow.open()
    },
    import() {
      const rowsData = this.$refs.myGrid.getrows()
      const params = {
        jsonParams: JSON.stringify({
          items: rowsData,
        }),
      }
      importDelivery(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style scoped>
::v-deep .tool-item {
  margin-right: 5px;
  display: inline-block;
  vertical-align: middle;
}
</style>