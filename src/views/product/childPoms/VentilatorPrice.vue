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
    <price-window ref="priceWindow"></price-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'

import PriceWindow from './VentilatorPriceWindow'
import { formatFilter } from '@/common/util.js'
import { contentHeight } from '@/common/mixin.js'
import { getLocalization } from '@/common/localization.js'
import {
  Message,
  ADD_PRODUCT_PRICE,
  EDIT_PRODUCT_PRICE,
} from '@/common/const.js'
import {
  showVentilatorPrice,
  deleteVentilatorPrice,
} from '@/network/product.js'
export default {
  components: {
    JqxGrid,
    PriceWindow,
  },
  mixins: [contentHeight],
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      datafields: [
        { name: 'id', type: 'number' },
        { name: 'plan_id', type: 'number' },
        { name: 'plan_name', type: 'string' },
        { name: 'specification', type: 'string' },
        { name: 'air_volume', type: 'number' },
        { name: 'hole_size', type: 'string' },
        { name: 'panel_material', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'vent_id', type: 'number' },
        { name: 'vent_name', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'asc',
      id: 'id',
      url: `/productPrice/showVentilatorPriceList.do`,
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
          showVentilatorPrice(source, serverdata).then((res) => {
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
          text: '产品名称',
          datafield: 'vent_name',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '规格',
          datafield: 'specification',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '风量',
          datafield: 'air_volume',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '开孔尺寸',
          datafield: 'hole_size',
          align: 'center',
          cellsalign: 'center',
        },

        {
          text: '面板材质',
          datafield: 'panel_material',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '价格',
          datafield: 'price',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '价格方案',
          datafield: 'plan_name',
          align: 'center',
          cellsalign: 'center',
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

      const addButtonContainer = document.createElement('div')
      const deleteButtonContainer = document.createElement('div')
      const editButtonContainer = document.createElement('div')
      const reloadButtonContainer = document.createElement('div')

      const addButtonID = JQXLite.generateID()
      const deleteButtonID = JQXLite.generateID()
      const editButtonID = JQXLite.generateID()
      const reloadButtonID = JQXLite.generateID()

      addButtonContainer.id = addButtonID
      deleteButtonContainer.id = deleteButtonID
      editButtonContainer.id = editButtonID
      reloadButtonContainer.id = reloadButtonID

      addButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor:pointer;'
      deleteButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor:pointer;'
      editButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor:pointer;'
      reloadButtonContainer.style.cssText =
        'float: right; margin-left: 5px;cursor:pointer;'

      // 添加
      if (this.hasAuthority(this, 'prodPrc:add')) {
        buttonsContainer.appendChild(addButtonContainer)
        const addButton = jqwidgets.createInstance(
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

        addButton.addEventHandler('click', (event) => {
          this.$refs.priceWindow.open(ADD_PRODUCT_PRICE)
        })
      }
      // 删除
      if (this.hasAuthority(this, 'prodPrc:delete')) {
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
      // 修改
      if (this.hasAuthority(this, 'prodPrc:update')) {
        buttonsContainer.appendChild(editButtonContainer)
        const editButton = jqwidgets.createInstance(
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
        editButton.addEventHandler('click', (event) => {
          const index = this.$refs.myGrid.getselectedrowindex()
          if (index < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED })
            return false
          }
          const rowData = this.$refs.myGrid.getrowdata(index)
          this.$refs.priceWindow.open(EDIT_PRODUCT_PRICE, rowData)
        })
      }
      // 刷新
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
    delete(id) {
      const params = {
        jsonParams: JSON.stringify({
          ventId: id,
        }),
      }
      deleteVentilatorPrice(params).then((res) => {
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