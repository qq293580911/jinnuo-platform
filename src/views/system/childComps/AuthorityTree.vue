<template>
  <div>
    <JqxTree
      style="margin-left: 5px; float: left; margin-top: 5px"
      ref="myTree"
      :width="300"
      :height="650"
      :source="records"
    ></JqxTree>
  </div>
</template>

<script>
import JqxTree from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue'

import { Message } from '@/common/const.js'
import { showPermissionTree } from '@/network/system.js'
export default {
  components: {
    JqxTree,
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: 'id', type: 'number' },
        { name: 'parentid', map: 'parentId', type: 'number' },
        { name: 'text', map: 'name', type: 'string' },
        { name: 'value', map: 'id', type: 'string' },
      ],
      datatype: 'json',
      id: 'id',
      type: 'get',
      url: '/permission/showPermissionTree.do',
    }
  },
  created() {
    const that = this
    const dataAdapter = new jqx.dataAdapter(this.source, {
      loadServerData(serverdata, source, callback) {
        showPermissionTree(source).then((res) => {
          callback({
            records: res.records,
          })
        })
      },
      beforeLoadComplete(records) {
        that.records = dataAdapter.getRecordsHierarchy(
          'id',
          'parentid',
          'items',
          [{ name: 'text', map: 'label' }]
        )
        that.$refs.myTree.source = that.records
      },
    })
    dataAdapter.dataBind()
  },
  data() {
    return {
       records: [],
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped>
</style>