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
    <receive-window ref="receiveWindow"></receive-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import ReceiveWindow from './ReceiveWindow'

import { formatFilter } from '@/common/util.js'
import { Message,ADD_SUPPLIES_RECEIVE } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import { showReceiveList } from '@/network/supplies.js'

import { contentHeight } from '@/common/mixin.js'
export default {
  components: {
    JqxGrid,
    ReceiveWindow
  },
  mixins: [contentHeight],
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      datafields: [
        { name: 'id', type: 'string' },
        { name: 'receive_date', type: 'string' },
        { name: 'supplies_id', type: 'number' },
        { name: 'supplies_name', type: 'string' },
        { name: 'supplies_unit', type: 'string' },
        { name: 'receive_quantity', type: 'string' },
        { name: 'dept_id', type: 'string' },
        { name: 'receive_department', type: 'number' },
        { name: 'department_name', type: 'string' },
        { name: 'dept_name', type: 'string' },
        { name: 'recipient', type: 'string' },
        { name: 'emp_name', type: 'string' },
        { name: 'remark', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/supplies/showOfficeSuppliesReceiveList.do`,
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
          showReceiveList(source, serverdata).then((res) => {
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
          text: '领用日期',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'receive_date',
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
          text: '领用数量',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'receive_quantity',
        },
        {
          text: '领用部门',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'department_name',
        },
        {
          text: '领用人',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'emp_name',
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
      const reloadButtonContainer = document.createElement('div')
      addButtonContainer.id = JQXLite.generateID()
      deleteButtonContainer.id = JQXLite.generateID()
      updateButtonContainer.id = JQXLite.generateID()
      reloadButtonContainer.id = JQXLite.generateID()
      addButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      deleteButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      updateButtonContainer.style.cssText =
        'float: left;margin-left: 5px;  cursor: pointer;'
      reloadButtonContainer.style.cssText =
        'float:right;margin-left: 5px;  cursor: pointer;'
      buttonsContainer.appendChild(addButtonContainer)
      buttonsContainer.appendChild(deleteButtonContainer)
      buttonsContainer.appendChild(updateButtonContainer)
      buttonsContainer.appendChild(reloadButtonContainer)
      toolbar[0].appendChild(buttonsContainer)
      // 创建按钮
      const addButton = jqwidgets.createInstance(`#${addButtonContainer.id}`, 'jqxButton', {
        imgSrc: require(`@/assets/iconfont/custom/add-circle.svg`),
      })
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

      const updateButton = jqwidgets.createInstance(`#${updateButtonContainer.id}`, 'jqxButton', {
        imgSrc: require(`@/assets/iconfont/custom/export.svg`),
      })
      jqwidgets.createInstance(`#${updateButtonContainer.id}`, 'jqxTooltip', {
        content: '修改',
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
      addButton.addEventHandler('click',()=>{
        this.$refs.receiveWindow.open(ADD_SUPPLIES_RECEIVE)
      })

      deleteButton.addEventHandler('click', (event) => {
        const selectedrowindex = this.$refs.myGrid.getselectedrowindex()
        if (selectedrowindex < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED })
          return false
        }
        const id = this.$refs.myGrid.getrowid(selectedrowindex)
        this.$refs.myGrid.deleterow(id)
      })

      updateButton.addEventHandler('click',()=>{
        const selectedIndex = this.$refs.myGrid.getselectedrowindex()
        const rowData = this.$refs.myGrid.getrowdata(selectedIndex)
        this.$refs.receiveWindow.open(EDIT_SUPPLIES_PURCHASE, rowData)
      })

      reloadButton.addEventHandler('click', (event) => {
        this.$refs.myGrid.updatebounddata()
      })
    },
  },
}
</script>

<style>
</style>
