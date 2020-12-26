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
      @rowselect="onRowSelect($event)"
    >
    </JqxGrid>
    <user-window ref="userWindow"></user-window>
  </div>
</template>

<script>
import JqxGrid from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxgrid.vue'
import { formatFilter } from '@/common/util.js'
import { Message, ADD_GROUP, EDIT_GROUP } from '@/common/const.js'
import { getLocalization } from '@/common/localization.js'
export default {
  components: {
    JqxGrid,
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
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped>
</style>