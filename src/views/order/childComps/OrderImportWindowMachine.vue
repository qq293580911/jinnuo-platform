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
        <div style="height: 100%; overflow: hidden">
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
import { importOrder, batchUpdateOrderByOrderNumber } from '@/network/order'
export default {
  components: {
    JqxWindow,
    JqxGrid,
  },
  beforeCreate() {
    this.source = {
      datafields: [
        {
          name: 'product_type',
          map: 'productType',
          type: 'string',
        },
        {
          name: 'order_date',
          map: 'orderDate',
          type: 'string',
        },
        {
          name: 'salesman',
          type: 'number',
        },
        {
          name: 'salesman_name',
          map: 'salesmanName',
          type: 'string',
        },
        {
          name: 'contract_number',
          map: 'contractNumber',
          type: 'string',
        },
        {
          name: 'order_number',
          map: 'orderNumber',
          type: 'number',
        },
        {
          name: 'project_name',
          map: 'projectName',
          type: 'string',
        },
        {
          name: 'order_amount',
          map: 'orderAmount',
          type: 'number',
        },
        {
          name: 'consideration_commission_order_amount',
          map: 'considerationCommissionOrderAmount',
          type: 'number',
        },
        {
          name: 'not_consideration_commission_order_amount',
          map: 'notConsiderationCommissionOrderAmount',
          type: 'number',
        },
        {
          name: 'logistics_management_fee',
          map: 'logisticsManagementFee',
          type: 'string',
        },
        {
          name: 'freight',
          map: 'freight',
          type: 'string',
        },
        {
          name: 'tax',
          map: 'tax',
          type: 'string',
        },
        {
          name: 'warranty',
          map: 'warranty',
          type: 'string',
        },
        {
          name: 'install_fee',
          map: 'installFee',
          type: 'string',
        },
        {
          name: 'order_reserve_price',
          type: 'number',
        },
        {
          name: 'consideration_commission_status',
          map: 'considerationCommissionStatus',
          type: 'string',
        },
        {
          name: 'remark',
          map: 'remark',
          type: 'string',
        },
        {
          name: 'actual_freight',
          map: 'actualFreight',
          type: 'string',
        },
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
          const salesmans = that.$store.state.salesmans
          records.map((item) => {
            const ordAmt = item['order_amount']
            const logManageFee = item['logistics_management_fee']
            const freight = item['freight']
            const tax = item['tax']
            const warranty = item['warranty']
            const installFee = item['install_fee']
            // 计算下单杂费
            const ordLogManageFee = calc_misc_log_manage_fee(
              ordAmt,
              installFee,
              logManageFee
            )
            const ordTax = calc_misc_tax(ordAmt, installFee, tax)
            const ordWarranty = calc_misc_warranty(ordAmt, installFee, warranty)
            const ordFreight = calc_misc_freight(
              ordAmt,
              installFee,
              ordLogManageFee,
              ordTax,
              ordWarranty,
              freight
            )
            // 计算下单底价
            const ordRsvP = calc_rsv_p(
              ordAmt,
              ordLogManageFee,
              ordFreight,
              ordTax,
              ordWarranty,
              installFee
            )
            item['order_reserve_price'] = ordRsvP
            // 放入业务员ID
            const salesman = salesmans.find((salesman) => {
              return salesman['emp_name'] == item['salesman_name']
            })
            if (salesman) {
              item['salesman'] = salesman['emp_id']
            }
          })
        },
      }),
      columns: [
        {
          text: '产品类型',
          dataField: 'product_type',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: function (row, columnfield, value, data) {
            if (/^设备$/.test(value) == false) {
              that.allowedFormat = false
              return 'yellow'
            }
            return ''
          },
        },
        {
          text: '下单日期',
          dataField: 'order_date',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
          cellclassname: function (row, columnfield, value, data) {
            const r = value.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/)
            if (r == null) {
              that.allowedFormat = false
              return 'yellow'
            }
            return ''
          },
        },
        {
          text: '业务员',
          dataField: 'salesman_name',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
          cellclassname: function (row, columnfield, value, data) {
            if (data['salesman'] == null) {
              that.allowedFormat = false
              return 'yellow'
            }
            return ''
          },
        },
        {
          text: '合同编号',
          dataField: 'contract_number',
          cellsAlign: 'center',
          align: 'center',
          width: 150,
        },
        {
          text: '下单编号',
          dataField: 'order_number',
          cellsAlign: 'center',
          align: 'center',
          width: 150,
        },
        {
          text: '项目名称',
          dataField: 'project_name',
          cellsAlign: 'center',
          align: 'center',
          width: 300,
        },
        {
          text: '下单金额',
          dataField: 'order_amount',
          cellsAlign: 'center',
          align: 'center',
          width: 120,
        },
        {
          text: '计提成下单金额',
          dataField: 'consideration_commission_order_amount',
          cellsAlign: 'center',
          align: 'center',
          width: 120,
        },
        {
          text: '非3C风阀下单金额',
          dataField: 'not_consideration_commission_order_amount',
          cellsAlign: 'center',
          align: 'center',
          width: 120,
        },
        {
          text: '物流管理费',
          dataField: 'logistics_management_fee',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
        },
        {
          text: '运费',
          dataField: 'freight',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
        },
        {
          text: '税金',
          dataField: 'tax',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
        },
        {
          text: '质保金',
          dataField: 'warranty',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
        },
        {
          text: '安装费',
          dataField: 'install_fee',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
        },
        {
          text: '下单底价',
          dataField: 'order_reserve_price',
          cellsAlign: 'center',
          align: 'center',
          width: 100,
        },
        {
          text: '备注',
          dataField: 'remark',
          cellsAlign: 'center',
          align: 'center',
          width: 150,
        },
        {
          text: '计提成状态',
          dataField: 'consideration_commission_status',
          cellsAlign: 'center',
          align: 'center',
          width: 110,
        },
        {
          text: '实际运费',
          dataField: 'actual_freight',
          cellsAlign: 'center',
          align: 'center',
          width: 80,
        },
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
        this.source.localdata = data
        this.$refs.myGrid.updatebounddata()
      }
    },
    endRow() {
      if (this.endRow < this.startRow) {
        this.$message.warning(Message.END_ROW_LESS_THAN_START_ROW)
      } else {
        this.allowedFormat = true
        const data = this.fileContent.slice(this.startRow, this.endRow)
        this.source.localdata = data
        this.$refs.myGrid.updatebounddata()
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
          value['orderDate'] = LAY_EXCEL.dateCodeFormat(
            value['orderDate'],
            'YYYY-MM-DD'
          )
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
          that.importOrder()
        },
        onCancel() {},
        class: 'test',
        zIndex: 1500,
      })
    })
    // 批量修改按钮绑定点击事件
    this.batchUpdateInstance.addEventHandler('click', () => {
      this.batchUpdateOrder()
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
              productType: 'A',
              orderDate: 'B',
              salesmanName: 'C',
              contractNumber: 'D',
              orderNumber: 'E',
              projectName: 'F',
              orderAmount: 'G',
              considerationCommissionOrderAmount: 'H',
              notConsiderationCommissionOrderAmount: 'I',
              logisticsManagementFee: 'J',
              freight: 'K',
              tax: 'L',
              warranty: 'M',
              installFee: 'N',
              remark: 'O',
              considerationCommissionStatus: 'P',
              actualFreight: 'Q',
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
      const batchUpdateContainer = document.createElement('div')
      batchUpdateContainer.classList.add('tool-item')
      const batchUpdateButtonID = JQXLite.generateID()
      batchUpdateContainer.id = batchUpdateButtonID
      buttonsContainer.appendChild(batchUpdateContainer)
      this.batchUpdateInstance = jqwidgets.createInstance(
        `#${batchUpdateButtonID}`,
        'jqxButton',
        {
          width: 25,
          height: 25,
          imgSrc: require(`@/assets/iconfont/custom/batch-update.svg`),
        }
      )
      jqwidgets.createInstance(`#${batchUpdateButtonID}`, 'jqxTooltip', {
        content: '批量更新',
        position: 'bottom',
      })
      // 字段选择
      const fieldSelection = document.createElement('div')
      const fieldSelectionID = JQXLite.generateID()
      fieldSelection.id = fieldSelectionID
      fieldSelection.classList.add('tool-item')
      buttonsContainer.appendChild(fieldSelection)
      this.fieldSelectionInstance = jqwidgets.createInstance(
        `#${fieldSelectionID}`,
        'jqxDropDownList',
        {
          source: ['实际运费', '计提成状态'],
          width: 100,
          height: 25,
        }
      )
    },
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {},
    importOrder() {
      const rowsData = this.$refs.myGrid.getrows()
      const params = {
        jsonParams: JSON.stringify({
          items: rowsData,
        }),
      }
      importOrder(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    batchUpdateOrder() {
      const rowsData = this.$refs.myGrid.getrows()
      const params = {
        jsonParams: JSON.stringify({
          items: rowsData,
        }),
      }
      batchUpdateOrderByOrderNumber(params).then((res) => {
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
