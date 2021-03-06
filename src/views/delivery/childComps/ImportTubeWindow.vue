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
import { importDelivery } from '@/network/delivery.js'
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
        { name: 'delivery_area', type: 'float' },
      ],
      dataType: 'json',
      localdata: [],
    }
  },
  data() {
    const that = this
    return {
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source),
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
          text: '送货面积',
          dataField: 'delivery_area',
          cellsAlign: 'center',
          align: 'center',
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
          value['delivery_date'] = LAY_EXCEL.dateCodeFormat(
            value['delivery_date'],
            'YYYY-MM-DD'
          )
          value['delivery_amount'] = parseFloat(
            value['delivery_amount']
          ).toFixed(2)
          value['delivery_area'] = parseFloat(value['delivery_area']).toFixed(2)
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
              delivery_amount: 'C',
              delivery_area: 'D',
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