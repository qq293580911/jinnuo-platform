<template>
  <div :style="contentStyle">
    <JqxLayout
      ref="myLayout"
      :width="'100%'"
      :height="'100%'"
      :layout="layout"
      :resizable="false"
    >
      <!-- 左 -->
      <div data-container="LeftPanel">
        <div class="userGrid"></div>
      </div>
      <!-- 右 -->
      <div data-container="RightPanel">
        <div class="authorityAssign"></div>
      </div>
    </JqxLayout>
  </div>
</template>

<script>
import Vue from 'vue'
import JqxLayout from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxlayout.vue'

import UserGrid from '../User'
import AuthorityAssign from './GroupAuthorityAssign'
export default {
  components: {
    JqxLayout,
    UserGrid,
  },
  computed: {
    contentStyle() {
      const style = {}
      switch (jqx.theme) {
        case 'ui-smoothness':
          style.height = 'calc(100vh - 132px)'
          break
        default:
          style.height = 'calc(100vh - 130px)'
          break
      }
      return style
    },
  },
  data() {
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
              width: '50%',
              items: [
                {
                  type: 'tabbedGroup',
                  height: '100%',
                  items: [
                    {
                      type: 'layoutPanel',
                      title: '用户选择',
                      contentContainer: 'LeftPanel',
                      initContent: function () {
                        const Component = Vue.extend(UserGrid)
                        const instance = new Component({
                          propsData:{
                            height:'100%'
                          }
                        }).$mount(
                          document.getElementsByClassName('userGrid')[0]
                        )
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'layoutGroup',
              orientation: 'vertical',
              width: '50%',
              items: [
                {
                  type: 'tabbedGroup',
                  height: '100%',
                  items: [
                    {
                      type: 'layoutPanel',
                      title: '分配权限',
                      contentContainer: 'RightPanel',
                      initContent: function () {
                        const Component = Vue.extend(AuthorityAssign)
                        const instance = new Component({}).$mount(
                          document.getElementsByClassName('authorityAssign')[0]
                        )
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
}
</script>

<style scoped>
::v-deep .jqx-widget-content {
  overflow:initial;
}
</style>