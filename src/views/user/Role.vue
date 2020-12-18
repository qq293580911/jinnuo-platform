<template>
  <div class="base-tab-content-element">
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
    <role-window ref="roleWindow"></role-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import RoleWindow from './childComps/RoleWindow'

import { formatFilter } from '@/common/util.js'
import { Message, ADD_ROLE, EDIT_ROLE } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import { showRoleList, deleteRole } from '@/network/user.js'
export default {
  components: {
    JqxGrid,
    RoleWindow,
  },
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      datafields: [
        { name: 'role_id', map: 'roleId', type: 'number' },
        { name: 'role_name', map: 'roleName', type: 'string' },
        { name: 'role_desc', map: 'roleDesc', type: 'string' },
        { name: 'enabled', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'role_id',
      sortdirection: 'asc',
      id: 'role_id',
      url: `/role/showRoleList.do`,
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
          showRoleList(source, serverdata).then((res) => {
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
          text: '角色名称',
          datafield: 'role_name',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '角色描述',
          datafield: 'role_desc',
          columntype: 'textbox',
          align: 'center',
          cellsalign: 'center',
        },
        {
          text: '启用状态',
          datafield: 'enabled',
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
            let color
            if (value == '未启用') {
              color = `#ff0000`
            } else {
              color = `#008000`
            }
            return (
              '<span style="width:100%;display:block; text-align: ' +
              columnproperties.cellsalign +
              ';line-height:29px; color:' +
              color +
              ';">' +
              value +
              '</span>'
            )
          },
        },
      ],
    }
  },
  methods: {
    createButtonsContainers: function (statusbar) {
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
      statusbar[0].appendChild(buttonsContainer)
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
        this.$refs.roleWindow.open(ADD_ROLE)
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
        this.$refs.roleWindow.open(EDIT_ROLE, rowData)
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
    delete(roleId) {
      const params = {
        jsonParams: JSON.stringify({
          roleId,
        }),
      }
      deleteRole(params).then((res) => {
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
.base-tab-content-element {
  height: calc(100vh - 105px);
}
</style>
