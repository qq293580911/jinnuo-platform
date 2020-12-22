<template>
  <div class="content">
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
    <customer-window ref="customerWindow"></customer-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import CustomerWindow from './childPoms/CustomerWindow'

import { formatFilter } from '@/common/util.js'
import { Message, ADD_CUSTOMER, EDIT_CUSTOMER } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import { showCustomerList, deleteCustomer } from '@/network/customer.js'
export default {
  name: 'CustomerManagement',
  components: {
    JqxGrid,
    CustomerWindow,
  },
  beforeCreate: function () {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      datafields: [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'gender', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'company', type: 'string' },
        { name: 'position', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'id',
      sortdirection: 'desc',
      id: 'id',
      url: `/customer/showCustomerList.do`,
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
          showCustomerList(source, serverdata).then((res) => {
            callback({
              records: res.rows,
              totalrecords: res.total,
            })
          })
        },
        beforeLoadComplete(records) {},
        beforeSend: function (xhr) {},
      }),
      rendergridrows: function (obj) {
        return obj.data
      },
      columns: [
        {
          text: '客户姓名',
          datafield: 'name',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '客户类型',
          datafield: 'type',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '性别',
          datafield: 'gender',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '电话',
          datafield: 'phone',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '公司',
          datafield: 'company',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
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

      buttonsContainer.appendChild(addButtonContainer)
      buttonsContainer.appendChild(deleteButtonContainer)
      buttonsContainer.appendChild(editButtonContainer)
      buttonsContainer.appendChild(reloadButtonContainer)
      toolbar[0].appendChild(buttonsContainer)
      // 添加
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
        this.$refs.customerWindow.open(ADD_CUSTOMER)
      })
      // 删除
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
        const selectedrowindexes = this.$refs.myGrid.getselectedrowindexes()
        if (selectedrowindexes.length < 1) {
          this.$message.warning({ content: Message.NO_ROWS_SELECTED })
          return false
        }
        this.$confirm({
            title: `${Message.CONFIRM_DELETE}`,
            okText: "确认",
            cancelText: "取消",
            centered: true,
            okType: "danger",
            content: (h) => <div style='color:red;'></div>,
            onOk() {
              const ids = selectedrowindexes.map(rowIndex=>{
                return that.$refs.myGrid.getrowid(rowIndex)
              })
              that.delete(ids)
            },
            onCancel() {},
            class: "test"
          });
      })
      // 编辑
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
        this.$refs.customerWindow.open(EDIT_CUSTOMER, rowData)
      })
      // 刷新
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
    delete(ids) {
      const params = {
        jsonParams: JSON.stringify({
          items:ids,
        }),
      }
      deleteCustomer(params).then((res) => {
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
.content {
  height: calc(100vh - 100px);
}
</style>
