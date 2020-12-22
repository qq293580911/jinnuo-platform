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
    <user-window ref="userWindow"></user-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import UserWindow from './childComps/UserWindow.vue'

import { formatFilter } from '@/common/util.js'
import { Message, ADD_USER, EDIT_USER } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import { showUserList, deleteUser } from '@/network/user.js'
export default {
  components: {
    JqxGrid,
    UserWindow,
  },
  computed: {
    contentStyle() {
      const style = {}
      switch (jqx.theme) {
        case 'ui-smoothness':
          style.height = 'calc(100vh - 103px)'
          break
        default:
          style.height = 'calc(100vh - 100px)'
          break
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
        { name: 'user_id', type: 'number' },
        { name: 'account', type: 'string' },
        { name: 'user_name', type: 'string' },
        { name: 'role_name', type: 'string' },
        { name: 'gender', type: 'string' },
        { name: 'locked', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'user_id',
      sortdirection: 'asc',
      id: 'user_id',
      url: `/user/showUserList.do`,
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
          showUserList(source, serverdata).then((res) => {
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
          text: '账号',
          datafield: 'account',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
        {
          text: '姓名',
          datafield: 'user_name',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
        {
          text: '性别',
          datafield: 'gender',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
        {
          text: '启用状态',
          datafield: 'locked',
          columntype: 'dropdownlist',
          align: 'center',
          cellsalign: 'center',
          cellsrenderer: function (
            row,
            columnfield,
            value,
            defaulthtml,
            columnproperties,
            rowdata
          ) {
            if (value == '已停用') {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #ff0000;">' +
                value +
                '</span>'
              )
            } else {
              return (
                '<span style="width:100%;display:block; text-align: ' +
                columnproperties.cellsalign +
                ';line-height:29px; color: #008000;">' +
                value +
                '</span>'
              )
            }
          },
        },
      ],
    }
  },
  methods: {
    createButtonsContainers: function (toobar) {
      const that = this
      const buttonsContainer = document.createElement('div')
      buttonsContainer.style.cssText =
        'overflow: hidden; position: relative; margin: 5px;'
      toobar[0].appendChild(buttonsContainer)

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
        'float: left; margin-left: 5px;cursor: pointer;'
      deleteButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      editButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      reloadButtonContainer.style.cssText =
        'float: right; margin-left: 5px;cursor: pointer;'

      buttonsContainer.appendChild(addButtonContainer)
      buttonsContainer.appendChild(deleteButtonContainer)
      buttonsContainer.appendChild(editButtonContainer)
      buttonsContainer.appendChild(reloadButtonContainer)

      // 添加按钮
      const addButtonIntance = jqwidgets.createInstance(
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
      addButtonIntance.addEventHandler('click', (event) => {
        this.$refs.userWindow.open(ADD_USER)
      })

      // 删除按钮
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
          okText: '确认',
          cancelText: '取消',
          centered: true,
          okType: 'danger',
          content: (h) => <div style="color:red;"></div>,
          onOk() {
            const ids = selectedrowindexes.map((rowIndex) => {
              return that.$refs.myGrid.getrowid(rowIndex)
            })
            that.delete(ids)
          },
          onCancel() {},
          class: 'test',
        })
      })

      // 编辑按钮
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
        this.$refs.userWindow.open(EDIT_USER, rowData)
      })

      // 刷新按钮
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
          items: ids,
        }),
      }
      deleteUser(params).then((res) => {
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
