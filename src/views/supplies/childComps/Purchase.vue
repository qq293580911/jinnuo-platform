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
    >
    </JqxGrid>
    <purchase-window ref="purchaseWindow"></purchase-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import PurchaseWindow from './PurchaseWindow'
import { formatFilter, dataExport } from '@/common/util.js'
import {
  Message,
  ADD_SUPPLIES_PURCHASE,
  EDIT_SUPPLIES_PURCHASE,
} from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import { showPurchaseList, deletePurchase } from '@/network/supplies.js'

import { contentHeight } from '@/common/mixin.js'
export default {
  components: {
    JqxGrid,
    PurchaseWindow,
  },
  mixins: [contentHeight],
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      datafields: [
        { name: 'id', type: 'string' },
        { name: 'purchase_date', type: 'string' },
        { name: 'supplies_id', type: 'number' },
        { name: 'supplies_name', type: 'string' },
        { name: 'supplies_unit', type: 'string' },
        { name: 'purchase_quantity', type: 'string' },
        { name: 'purchase_unit_price', type: 'string' },
        { name: 'operator', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'purchaser', type: 'number' },
        { name: 'purchaser_name', type: 'string' },
        { name: 'remark', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/supplies/showOfficeSuppliesPurchaseList.do`,
    }
  },
  data() {
    return {
      // 数据网格
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata)
          showPurchaseList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
        beforeLoadComplete(records) {},
      }),
      rendergridrows: function (obj) {
        return obj.data
      },
      columns: [
        {
          text: '采购日期',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'purchase_date',
          cellsformat: 'yyyy-MM-dd',
        },
        {
          text: '用品名称',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'supplies_name',
        },
        {
          text: '用品单位',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'supplies_unit',
        },
        {
          text: '采购数量',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'purchase_quantity',
        },
        {
          text: '采购单价',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'purchase_unit_price',
        },
        {
          text: '运营商',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'operator',
        },
        {
          text: '地址/网址',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'address',
        },
        {
          text: '采购人',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'purchaser_name',
        },
        {
          text: '备注',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'remark',
        },
      ],
    }
  },
  mounted() {},
  methods: {
    createButtonsContainers: function (toolbar) {
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      const addButtonContainer = document.createElement('div')
      const deleteButtonContainer = document.createElement('div')
      const updateButtonContainer = document.createElement('div')
      const exportButtonContainer = document.createElement('div')
      const reloadButtonContainer = document.createElement('div')
      addButtonContainer.id = JQXLite.generateID()
      deleteButtonContainer.id = JQXLite.generateID()
      updateButtonContainer.id = JQXLite.generateID()
      exportButtonContainer.id = JQXLite.generateID()
      reloadButtonContainer.id = JQXLite.generateID()
      addButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      deleteButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      updateButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      exportButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      reloadButtonContainer.style.cssText =
        'float:right;margin-left: 5px;  cursor: pointer;'
      buttonsContainer.appendChild(addButtonContainer)
      buttonsContainer.appendChild(deleteButtonContainer)
      buttonsContainer.appendChild(updateButtonContainer)
      buttonsContainer.appendChild(exportButtonContainer)
      buttonsContainer.appendChild(reloadButtonContainer)
      toolbar[0].appendChild(buttonsContainer)
      // 创建按钮
      const addButton = jqwidgets.createInstance(
        `#${addButtonContainer.id}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
        }
      )
      jqwidgets.createInstance(`#${addButtonContainer.id}`, 'jqxTooltip', {
        content: '添加',
        position: 'bottom',
      })

      const deleteButton = jqwidgets.createInstance(
        `#${deleteButtonContainer.id}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/ashbin.svg`),
        }
      )
      jqwidgets.createInstance(`#${deleteButtonContainer.id}`, 'jqxTooltip', {
        content: '删除',
        position: 'bottom',
      })

      const updateButton = jqwidgets.createInstance(
        `#${updateButtonContainer.id}`,
        `jqxButton`,
        {
          imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
        }
      )

      const exportButton = jqwidgets.createInstance(
        `#${exportButtonContainer.id}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/export.svg`),
        }
      )
      jqwidgets.createInstance(`#${exportButtonContainer.id}`, 'jqxTooltip', {
        content: '导出',
        position: 'bottom',
      })

      const reloadButton = jqwidgets.createInstance(
        `#${reloadButtonContainer.id}`,
        'jqxButton',
        { imgSrc: require(`@/assets/iconfont/custom/refresh.svg`) }
      )
      jqwidgets.createInstance(`#${reloadButtonContainer.id}`, 'jqxTooltip', {
        content: '刷新',
        position: 'bottom',
      })

      // 绑定事件
      addButton.addEventHandler('click', () => {
        this.$refs.purchaseWindow.open(ADD_SUPPLIES_PURCHASE)
      })

      deleteButton.addEventHandler('click', (event) => {
        const selectedrowindexes = this.$refs.myGrid.getselectedrowindexes()
        if (selectedrowindexes.length < 1) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED })
          return false
        }
        const ids = selectedrowindexes.map((item) => {
          return this.$refs.myGrid.getrowid(item)
        })
        this.delete(ids)
      })

      updateButton.addEventHandler('click', () => {
        const selectIndex = this.$refs.myGrid.getselectedrowindex()
        const rowData = this.$refs.myGrid.getrowdata(selectIndex)
        this.$refs.purchaseWindow.open(EDIT_SUPPLIES_PURCHASE, rowData)
      })

      exportButton.addEventHandler('click', () => {
        const columns = this.$refs.myGrid.columns
        const rowsData = this.$refs.myGrid.getrows()
        dataExport('用品-采购.xlsx', columns, rowsData, {
          numberCol: [`采购数量`, `采购单价`],
        })
      })

      reloadButton.addEventHandler('click', (event) => {
        this.$refs.myGrid.updatebounddata()
      })
    },
    delete(ids) {
      const params = {
        jsonParams: JSON.stringify({ items: ids }),
      }
      deletePurchase(params).then(() => {
        this.refresh()
      })
    },
    refresh() {
      this.$refs.myGrid.updatebounddata()
    },
  },
}
</script>

<style>
</style>
