<template>
  <div :style="{
    height:'100%'
  }">
    <JqxGrid
      ref="myGrid"
      :width="'100%'"
      :height="'100%'"
      :localization="localization"
      :source="dataAdapter"
      :columns="columns"
      :showtoolbar="true"
      :filterable="true"
      :editable="true"
      @cellvaluechanged="onCellvaluechanged($event)"
    >
    </JqxGrid>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'

import { formatFilter } from '@/common/util.js'
import { getLocalization } from '@/common/localization.js'
import {
  showUserGroupAuthorityList,
  saveUserGroupAuthority,
} from '@/network/user.js'
export default {
  components: {
    JqxGrid,
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: 'id', type: 'number' },
        { name: 'user_id', type: 'number' },
        { name: 'group_id', type: 'number' },
        { name: 'group_name', type: 'string' },
        { name: 'enabled', type: 'number' },
      ],
      type: 'get',
      datatype: 'json',
      localdata: [],
    }
  },
  data() {
    const that = this
    return {
      localization: getLocalization('zh-CN'),
      dataAdapter: new jqx.dataAdapter(this.source, {
        loadComplete(records) {
          records.forEach((item) => {
            if (!item['enabled']) {
              item['enabled'] = 0
            }
          })
          return records
        },
      }),
      columns: [
        {
          text: '销售组名',
          datafield: 'group_name',
          align: 'center',
          cellsalign: 'center',
          editable: false,
        },
        {
          text: '授权状态',
          datafield: 'enabled',
          align: 'center',
          cellsalign: 'center',
          columntype: 'checkbox',
        },
      ],
    }
  },
  mounted() {
    this.$bus.$off('sendUser').$on('sendUser', (user) => {
      this.userId = user['user_id']
      this.refresh()
    })
  },
  methods: {
    onCellvaluechanged(event) {
      const newValue = event.args.newvalue
      const rowIndex = event.args.rowindex
      const rowData = this.$refs.myGrid.getrowdata(rowIndex)
      const params = {
        jsonParams: JSON.stringify({
          id: rowData['id'],
          groupId: rowData['group_id'],
          userId: this.userId,
          enabled: newValue,
        }),
      }
      saveUserGroupAuthority(params).then((res) => {
        this.refresh()
      })
    },
    refresh() {
      const params = {
        jsonParams: JSON.stringify({
          userId: this.userId,
        }),
      }
      showUserGroupAuthorityList(params).then((res) => {
        this.source.localdata = res
        this.$refs.myGrid.updatebounddata()
      })
    },
  },
}
</script>

<style scoped>
</style>