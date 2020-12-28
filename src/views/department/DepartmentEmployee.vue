<template>
  <div :style="contentStyle">
    <JqxLayout
      ref="myLayout"
      :width="'100%'"
      :height="'100%'"
      class="layout"
      :layout="layout"
      :resizable="false"
    >
      <!-- 左 -->
      <div data-container="LeftPanel">
        <div id="department"></div>
      </div>
      <!-- 右 -->
      <div data-container="RightPanel">
        <div id="employee"></div>
      </div>
    </JqxLayout>
  </div>
</template>

<script>
import Vue from 'vue'
import JqxLayout from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxlayout.vue'

import Department from './Department'
import Employee from '@/views/employee/Employee/'
export default {
  components: {
    JqxLayout,
    Department,
    Employee,
  },
  computed: {
    contentStyle() {
      const style = {}
      switch (jqx.theme) {
        case 'ui-smoothness':
          style.height = 'calc(100vh - 102px)'
          break
        default:
          style.height = 'calc(100vh - 98px)'
          break
      }
      return style
    },
  },
  data() {
    const that = this
    return {
      // 布局
      layout: [
        {
          type: 'layoutGroup',
          orientation: 'horizontal',
          items: [
            {
              type: 'layoutGroup',
              orientation: 'vertical',
              width: '30%',
              items: [
                {
                  type: 'tabbedGroup',
                  height: '100%',
                  items: [
                    {
                      type: 'layoutPanel',
                      title: '部门管理',
                      contentContainer: 'LeftPanel',
                      initContent: function () {
                        const Component = Vue.extend(Department)
                        const instance = new Component({
                          // store,
                        }).$mount('#department')
                        that.$refs.departmentInstance = instance
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'layoutGroup',
              orientation: 'vertical',
              width: '70%',
              items: [
                {
                  type: 'tabbedGroup',
                  height: '100%',
                  items: [
                    {
                      type: 'layoutPanel',
                      title: '员工管理',
                      contentContainer: 'RightPanel',
                      initContent: function () {
                        const Component = Vue.extend(Employee)
                        const instance = new Component({
                          // store,
                          propsData:{
                            height:'100%'
                          }
                        }).$mount('#employee')
                        that.$refs.employeeInstance = instance
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped>
::v-deep .jqx-widget-content {
  overflow: hidden;
}
</style>