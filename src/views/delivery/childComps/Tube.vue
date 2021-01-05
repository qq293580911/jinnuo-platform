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
    <delivery-window
      ref="deliveryWindow"
      :order-number-disabled="false"
      :project-name-disabled="false"
    ></delivery-window>
    <import-tube-window ref="deliveryImportWindow"></import-tube-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import DeliveryWindow from '@/components/content/delivery/DeliveryTubeWindow.vue'
import ImportTubeWindow from './ImportTubeWindow'

import { getLocalization } from '@/common/localization.js'
import { formatFilter, dataExport } from '@/common/util.js'
import {
  Message,
  ADD_DELIVERY,
  EDIT_DELIVERY,
  IMPORT_DELIVERY,
} from '@/common/const.js'
import { contentHeight } from '@/common/mixin.js'
import { showDeliveryTubeList, deleteDelivery } from '@/network/delivery.js'
export default {
  components: {
    JqxGrid,
    DeliveryWindow,
    ImportTubeWindow,
  },
  mixins: [contentHeight],
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      dataFields: [
        { name: 'id', type: 'number' },
        { name: 'order_number', type: 'string' },
        { name: 'delivery_date', type: 'string' },
        { name: 'delivery_amount', type: 'number' },
        { name: 'delivery_area', type: 'float' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/dlvDtl/showDeliveryTubeList.do`,
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
          showDeliveryTubeList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
      }),
      rendergridrows: function (obj) {
        return obj.data
      },
      columns: [
        {
          text: '下单编号',
          datafield: 'order_number',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '送货日期',
          datafield: 'delivery_date',
          cellsformat: 'yyyy-MM-dd',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '送货金额',
          datafield: 'delivery_amount',
          align: 'center',
          cellsalign: 'center',
          aggregates: ['sum'],
          aggregatesRenderer: this.aggregatesRenderer,
          cellsformat: 'n',
        },
        {
          text: '送货面积',
          datafield: 'delivery_area',
          align: 'center',
          cellsalign: 'center',
          aggregates: ['sum'],
          aggregatesRenderer: this.aggregatesRenderer,
          cellsformat: 'n',
        },
      ],
    }
  },
  methods: {
    createButtonsContainers: function (toolbar) {
      const that = this
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      toolbar[0].appendChild(buttonsContainer)

      // 创建添加按钮
      if (this.hasAuthority(this, 'dlvDtl:add')) {
        const addButtonContainer = document.createElement('div')
        const addButtonID = JQXLite.generateID()
        addButtonContainer.id = addButtonID
        addButtonContainer.style.cssText =
          'float: left;margin-left: 5px;  cursor: pointer;'
        buttonsContainer.appendChild(addButtonContainer)
        // 创建按钮
        const addInstance = jqwidgets.createInstance(
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

        addInstance.addEventHandler('click', () => {
          this.$refs.deliveryWindow.open(ADD_DELIVERY)
        })
      }

      // 创建删除按钮
      if (this.hasAuthority(this, 'dlvDtl:delete')) {
        const deleteButtonContainer = document.createElement('div')
        const deleteButtonID = JQXLite.generateID()
        deleteButtonContainer.id = deleteButtonID
        deleteButtonContainer.style.cssText =
          'float: left;margin-left: 5px;  cursor: pointer;'
        buttonsContainer.appendChild(deleteButtonContainer)
        const deleteButton = jqwidgets.createInstance(
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
        deleteButton.addEventHandler('click', (event) => {
          const selectedrowindex = this.$refs.myGrid.getselectedrowindex()
          if (selectedrowindex < 0) {
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
              const id = that.$refs.myGrid.getrowid(selectedrowindex)
              that.delete(id)
            },
            onCancel() {},
            class: 'test',
          })
        })
      }

      // 创建编辑按钮
      if (this.hasAuthority(this, 'dlvDtl:update')) {
        const editButtonContainer = document.createElement('div')
        const editButtonID = JQXLite.generateID()
        editButtonContainer.id = editButtonID
        editButtonContainer.style.cssText =
          'float: left;margin-left: 5px;  cursor: pointer;'
        buttonsContainer.appendChild(editButtonContainer)
        const updateInstance = jqwidgets.createInstance(
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

        updateInstance.addEventHandler('click', () => {
          const selectedIndex = this.$refs.myGrid.getselectedrowindex()
          if (selectedIndex < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED })
            return false
          }
          const rowData = this.$refs.myGrid.getrowdata(selectedIndex)
          this.$refs.deliveryWindow.open(EDIT_DELIVERY, rowData)
        })
      }

      // 创建导入按钮
      if (this.hasAuthority(this, 'dlvDtl:import')) {
        const importButtonContainer = document.createElement('div')
        const importButtonID = JQXLite.generateID()
        importButtonContainer.id = importButtonID
        importButtonContainer.style.cssText =
          'float: left;margin-left: 5px;  cursor: pointer;'
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

      // 创建导出按钮
      const exportButtonContainer = document.createElement('div')
      const exportButtonID = JQXLite.generateID()
      exportButtonContainer.id = exportButtonID
      exportButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
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
        dataExport('送货-风管.xlsx', columns, rowsData, {
          rowConfig: {
            start: 30,
            end: 30,
            other: 30,
          },
          colConfig: {
            A: 120,
            B: 120,
            C: 120,
            D: 120,
          },
          numberCol: ['送货金额'],
        })
      })

      // 创建刷新按钮
      const reloadButtonContainer = document.createElement('div')
      const reloadButtonID = JQXLite.generateID()
      reloadButtonContainer.id = reloadButtonID
      reloadButtonContainer.style.cssText =
        'float:right;margin-left: 5px;  cursor: pointer;'
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
        this.refresh()
      })
    },
    delete(id) {
      const params = {
        jsonParams: JSON.stringify({
          id,
        }),
      }
      deleteDelivery(params).then((res) => {
        this.refresh()
      })
    },
    refresh() {
      this.$refs.myGrid.updatebounddata()
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