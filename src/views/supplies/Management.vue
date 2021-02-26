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
      :pagesize="25"
      :pagesizeoptions="[5, 10, 15, 20, 25, 30]"
      :sortable="true"
      :filterable="true"
      :altrows="true"
      :rowsheight="29"
      :enabletooltip="true"
      :editable="false"
      :selectionmode="'multiplerowsextended'"
      :virtualmode="true"
      :rendergridrows="rendergridrows"
    >
    </JqxGrid>

    <supplies-window ref="suppliesWindow"></supplies-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'

import SuppliesWindow from './childComps/SuppliesWindow'

import { formatFilter } from '@/common/util.js'
import { Message, ADD_SUPPLIES, EDIT_SUPPLIES } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'

import { showSuppliesList, deleteSupplies } from '@/network/supplies.js'

import { contentHeight } from '@/common/mixin.js'
export default {
  components: {
    JqxGrid,
    SuppliesWindow,
  },
  computed: {
    contentStyle() {
      const style = {}
      if (this.height) {
        style.height = this.height
      } else {
        switch (jqx.theme) {
          case 'ui-smoothness':
            style.height = 'calc(100vh - 103px)'
            break
          default:
            style.height = 'calc(100vh - 100px)'
            break
        }
      }
      return style
    },
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      datafields: [
        { name: 'id', type: 'number' },
        { name: 'supplies_name', type: 'string' },
        { name: 'st_id', type: 'string' },
        { name: 'type_name', type: 'string' },
        { name: 'specification_model', type: 'string' },
        { name: 'supplies_unit', type: 'string' },
        { name: 'supplies_unit_price', type: 'string' },
        { name: 'supplies_color', type: 'string' },
        { name: 'dealer', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'creator', type: 'string' },
        { name: 'remark', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/supplies/showSuppliesList.do`,
    }
  },
  data: function () {
    return {
      // 数据网格
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        formatData: function (data) {
          return data
        },
        loadServerData: function (serverdata, source, callback) {
          serverdata = formatFilter(serverdata)
          showSuppliesList(source, serverdata).then((res) => {
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
          text: '用品名称',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'supplies_name',
        },
        {
          text: '用品类型',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'type_name',
        },
        {
          text: '规格型号',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'specification_model',
        },
        {
          text: '用品单位',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'supplies_unit',
        },
        {
          text: '用品单价',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'supplies_unit_price',
        },
        {
          text: '用品颜色',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'supplies_color',
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties
          ) {
            return (
              '<span style="width:100%;display:block;background-color:' +
              value +
              '; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px;">' +
              value +
              '</span>'
            )
          },
        },
        {
          text: '运营商',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'dealer',
        },
        {
          text: '地址/网址',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'address',
        },
        {
          text: '创建者',
          cellsAlign: 'center',
          align: 'center',
          datafield: 'creator',
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

      const editButton = jqwidgets.createInstance(
        `#${updateButtonContainer.id}`,
        'jqxButton',
        {
          imgSrc: require(`@/assets/iconfont/custom/edit.svg`),
        }
      )
      jqwidgets.createInstance(`#${updateButtonContainer.id}`, 'jqxTooltip', {
        content: '编辑',
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
        this.$refs.suppliesWindow.open(ADD_SUPPLIES)
      })

      deleteButton.addEventHandler('click', () => {
        const selectedrowindexes = this.$refs.myGrid.getselectedrowindexes()
        if (selectedrowindexes < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED })
          return false
        }

        const that = this

        this.$confirm({
          title: `${Message.CONFIRM_DELETE}`,
          okText: '确认',
          cancelText: '取消',
          centered: true,
          okType: 'danger',
          content: (h) => <div style="color:red;"></div>,
          onOk() {
            const ids = selectedrowindexes.map((item) => {
              return that.$refs.myGrid.getrowid(item)
            })
            that.delete(ids)
          },
          onCancel() {},
          class: 'test',
        })
      })

      editButton.addEventHandler('click', () => {
        const index = this.$refs.myGrid.getselectedrowindex()
        if (index < 0) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED })
          return false
        }
        const rowData = this.$refs.myGrid.getrowdata(index)
        this.$refs.suppliesWindow.open(EDIT_SUPPLIES, rowData)
      })

      reloadButton.addEventHandler('click', (event) => {
        this.$refs.myGrid.updatebounddata()
      })
    },
    delete(ids) {
      const params = {
        jsonParams: JSON.stringify({ items: ids }),
      }
      deleteSupplies(params).then((res) => {
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
