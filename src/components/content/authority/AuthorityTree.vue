<template>
  <div>
    <JqxTree
      style="margin-left: 5px; float: left; margin-top: 5px"
      ref="myTree"
      :width="300"
      :height="650"
      :source="records"
      :checkboxes="showCheckbox"
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
        { name: 'checked', type: 'boolean' },
        { name: 'expanded', type: 'boolean' },
        { name: 'value', type: 'string' },
      ],
      datatype: 'json',
      id: 'id',
      type: 'get',
      url: '/permission/showPermissionTree.do',
    }
  },
  props: {
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    roleAuthority: {
      type: Array,
      default() {
        return []
      },
    },
  },
  watch: {
    roleAuthority(data) {
      delete this.source['url']
      this.source.localdata = data
      const dataAdapter = new jqx.dataAdapter(this.source, { autoBind: true })
      const records = dataAdapter.getRecordsHierarchy(
        'id',
        'parentid',
        'items',
        [{ name: 'text', map: 'label' }]
      )
      this.$refs.myTree.source = records
    },
  },
  data() {
    return {
      records: [],
    }
  },
  created() {
    const that = this
    this.dataAdapter = new jqx.dataAdapter(this.source, {
      loadServerData(serverdata, source, callback) {
        showPermissionTree(source).then((res) => {
          callback({
            records: res.records,
          })
        })
      },
      beforeLoadComplete(records) {
        that.records = that.dataAdapter.getRecordsHierarchy(
          'id',
          'parentid',
          'items',
          [{ name: 'text', map: 'label' }]
        )
        that.$refs.myTree.source = that.records
      },
    })
    that.dataAdapter.dataBind()
  },
  mounted() {},
  methods: {
    checkAll() {
      this.$refs.myTree.checkAll()
    },
    uncheckAll() {
      this.$refs.myTree.uncheckAll()
    },
    expandAll() {
      this.$refs.myTree.expandAll()
    },
    collapseAll() {
      this.$refs.myTree.collapseAll()
    },
    getItems(){
      const items = this.$refs.myTree.getItems()
      return items
    }
  },
}
</script>

<style scoped>
</style>