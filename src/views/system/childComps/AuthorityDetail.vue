<template>
  <div>
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
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import { formatFilter } from '@/common/util.js'
import { Message } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
import { showPermissionList } from '@/network/system.js'
export default {
  components: {},
  beforeCreate() {
    this.source = {
      filter: () => {
        this.$refs.myGrid.updatebounddata('filter')
      },
      datafields: [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'url', type: 'string' },
        { name: 'per_code', type: 'string' },
        { name: 'available', type: 'string' },
      ],
      type: 'get',
      datatype: 'json',
      root: 'rows',
      sortcolumn: 'user_id',
      sortdirection: 'asc',
      id: 'user_id',
      url: `/permission/showPermissionList.do`,
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
          showPermissionList(source, serverdata).then((res) => {
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
          text: '名称',
          datafield: 'name',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
        {
          text: '类型',
          datafield: 'type',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
        {
          text: '路径',
          datafield: 'url',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
        {
          text: '权限码',
          datafield: 'per_code',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
        {
          text: '状态',
          datafield: 'available',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
      ],
    }
  },
  mounted() {},
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
  },
}
</script>

<style scoped>
</style>