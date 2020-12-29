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
      :editable="true"
      :editmode="'dblclick'"
      :selectionmode="'multiplerowsextended'"
      :virtualmode="true"
      :rendergridrows="rendergridrows"
      :rowdetails="true"
      :initrowdetails="initrowdetails"
      :rowdetailstemplate="rowdetailstemplate"
      @rowselect="onRowSelect($event)"
    >
    </JqxGrid>
    <user-window ref="userWindow"></user-window>
    <assign-role-window ref="assignRoleWindow"></assign-role-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import UserWindow from './childComps/UserWindow.vue'
import AssignRoleWindow from './childComps/AssignRoleWindow'

import { formatFilter } from '@/common/util.js'
import { Message, ADD_USER, EDIT_USER, ASSIGN_ROLE } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import {
  showUserList,
  deleteUser,
  getRoleListByUserId,
  updateUserInfo,
} from '@/network/user.js'
export default {
  components: {
    JqxGrid,
    UserWindow,
    AssignRoleWindow
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
  props: {
    height: {
      type: String,
      default() {
        return ''
      },
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
      updaterow: function (rowid, rowdata, commit) {
        console.log(rowid, rowdata)
        const params = {
          jsonParams: JSON.stringify({
            userId: rowid,
            locked: rowdata['locked'] == '已停用' ? 1 : 0,
          }),
        }
        updateUserInfo(params).then((res) => {
          commit(true)
        })
      },
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
          createeditor: function (row, cellvalue, editor) {
            editor.jqxDropDownList({ source: ['已启用', '已停用'] })
          },
        },
      ],
      rowdetailstemplate: {
        rowdetails:
          "<div style='margin: 10px;'>" +
          "<ul style='margin-left: 30px;'>" +
          '<li>角色</li>' +
          '</ul>' +
          "<div class='role'></div>" +
          '</div>',
        rowdetailsheight: 200,
      },
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
      const assignButtonContainer = document.createElement('div')
      const reloadButtonContainer = document.createElement('div')

      const addButtonID = JQXLite.generateID()
      const deleteButtonID = JQXLite.generateID()
      const editButtonID = JQXLite.generateID()
      const assignButtonID = JQXLite.generateID()
      const reloadButtonID = JQXLite.generateID()

      addButtonContainer.id = addButtonID
      deleteButtonContainer.id = deleteButtonID
      editButtonContainer.id = editButtonID
      assignButtonContainer.id = assignButtonID
      reloadButtonContainer.id = reloadButtonID

      addButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      deleteButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      editButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      assignButtonContainer.style.cssText =
        'float: left; margin-left: 5px;cursor: pointer;'
      reloadButtonContainer.style.cssText =
        'float: right; margin-left: 5px;cursor: pointer;'

      // 添加按钮
      if (this.hasAuthority(this, 'user:add')) {
        buttonsContainer.appendChild(addButtonContainer)
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
      }

      // 删除按钮
      if (this.hasAuthority(this, 'user:delete')) {
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
      }

      // 编辑按钮
      if (this.hasAuthority(this, 'user:update')) {
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
          this.$refs.userWindow.open(EDIT_USER, rowData)
        })
      }

      // 分配角色按钮
      if (this.hasAuthority(this, 'user:assign')) {
        buttonsContainer.appendChild(assignButtonContainer)
        const assignButton = jqwidgets.createInstance(
          `#${assignButtonID}`,
          'jqxButton',
          {
            imgSrc: require(`@/assets/iconfont/custom/assign.svg`),
          }
        )
        jqwidgets.createInstance(`#${assignButtonID}`, 'jqxTooltip', {
          content: '分配角色',
          position: 'bottom',
        })
        assignButton.addEventHandler('click', (event) => {
          const index = this.$refs.myGrid.getselectedrowindex()
          if (index < 0) {
            this.$message.warning({ content: Message.NO_ROWS_SELECTED })
            return false
          }
          const userId = this.$refs.myGrid.getrowid(index)
          this.$refs.assignRoleWindow.open(ASSIGN_ROLE, userId)
        })
      }

      // 刷新按钮
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
    initrowdetails(index, parentElement, gridElement, datarecord) {
      let tabsdiv = null
      let roleGrid = null
      tabsdiv = $($(parentElement).children()[0])
      if (tabsdiv != null) {
        roleGrid = tabsdiv.find('.role')
        const id = datarecord.user_id
        const params = {
          jsonParams: JSON.stringify({
            userId: id,
          }),
        }

        getRoleListByUserId(params).then((res) => {
          initNestedGrid(res)
        })

        const initNestedGrid = (data) => {
          const source = {
            dataFields: [
              { name: 'role_id', map: 'roleId', type: 'number' },
              { name: 'role_name', map: 'roleName', type: 'string' },
              { name: 'role_desc', map: 'roleDesc', type: 'string' },
            ],
            localdata: data,
          }
          const nestedGridAdapter = new $.jqx.dataAdapter(source)
          if (roleGrid != null) {
            roleGrid.jqxGrid({
              source: nestedGridAdapter,
              width: '100%',
              height: '100%',
              localization: getLocalization('zh-CN'),
              columns: [
                {
                  text: '角色ID',
                  datafield: 'role_id',
                  cellsAlign: 'center',
                  align: 'center',
                  hidden: true,
                },
                {
                  text: '角色名称',
                  datafield: 'role_name',
                  cellsAlign: 'center',
                  align: 'center',
                },
                {
                  text: '角色描述',
                  datafield: 'role_desc',
                  cellsAlign: 'center',
                  align: 'center',
                },
              ],
            })
          }
        }

        // const jsonParams = {}
        // jsonParams.userId = id
        // const source = {
        //   dataFields: [
        //     { name: 'role_id', map: 'roleId', type: 'number' },
        //     { name: 'role_name', map: 'roleName', type: 'string' },
        //     { name: 'role_desc', map: 'roleDesc', type: 'string' },
        //   ],
        //   url: '/user/showRoleListByUserId.do',
        //   type: 'get',
        //   data: { jsonParams: JSON.stringify(jsonParams) },
        //   dataType: 'json',
        //   id: 'role_id',
        //   async: false,
        //   localdata: [],
        // }

        $(tabsdiv).jqxTabs({ width: '96%', height: 160 })
      }
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
    onRowSelect(event) {
      const rowData = event.args.row
      this.$bus.$emit('sendUser', rowData)
    },
  },
}
</script>

<style scoped>
</style>
