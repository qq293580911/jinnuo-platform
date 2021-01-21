<template>
  <div>
    <JqxToolbar
      :width="'100%'"
      :height="35"
      :rtl="false"
      :tools="tools"
      :initTools="initTools"
    >
    </JqxToolbar>
  </div>
</template>

<script>
import Vue from 'vue'
import JqxToolbar from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue'
import SelectionTool from './SelectionTool'
import store from '@/store'
import {
  Message,
  GENERAL_BLOWER,
  OUTSIDE_BUY,
  VENTILATOR,
  CONTROL_BOX,
  WALL_BLOWER,
  DUCT_BLOWER,
  MUTE_BLOWER,
  SIDE_WALL_BLOWER,
  SIDE_WALL_BLOWER_EP,
} from '@/common/const.js'
export default {
  components: {
    JqxToolbar,
  },
  data() {
    return {
      tools: 'custom | custom | custom | custom | custom | custom',
      comps: {},
    }
  },
  created() {},
  mounted() {
    const that = this
    // 指派类型树绑定选择事件
    this.treeInstance.addEventHandler('select', (e) => {
      const item = that.treeInstance.getSelectedItem()
      if (item['hasItems']) {
        that.$message.warning(Message.UNSELECTABLE_NODE)
        return false
      }
      const dropDownContent = `<div style="position: relative; margin: 5px;">
        ${item.label}</div>`
      that.dropdownButtonInstance.setContent(dropDownContent)
    })
    // 筛选绑定点击事件
    this.filterInstance.addEventHandler('click', () => {
      this.$bus.$emit('filter')
    })
    // 指派类型绑定的点击事件
    this.assignButtonInstance.addEventHandler('click', () => {
      const dropdownButtonCotent = this.dropdownButtonInstance.getContent()
      let assignType = dropdownButtonCotent[0]['textContent']
      assignType = assignType.replace(/(^\s*)|(\s*$)/g, '')
      this.$bus.$emit('assign', assignType)
    })
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      const that = this
      if (menuToolIninitialization == false) {
        switch (index) {
          case 0: {
            const dropDownButton = document.createElement('div')
            const dropdownButtonID = JQXLite.generateID()
            dropDownButton.id = dropdownButtonID
            tool[0].appendChild(dropDownButton)

            const tree = document.createElement('div')
            tree.style.cssText = 'border: none;'
            const treeID = JQXLite.generateID()
            tree.id = treeID
            dropDownButton.appendChild(tree)

            that.dropdownButtonInstance = jqwidgets.createInstance(
              `#${dropdownButtonID}`,
              'jqxDropDownButton',
              {
                width: 161,
              }
            )
            // 树
            const source = {
              datatype: 'json',
              datafields: [
                { name: 'id' },
                { name: 'parentid' },
                { name: 'text' },
                { name: 'value' },
              ],
              id: 'id',
              localdata: that.$store.state.assignType,
            }
            const dataAdapter = new jqx.dataAdapter(source)
            dataAdapter.dataBind()
            const records = dataAdapter.getRecordsHierarchy(
              'id',
              'parentid',
              'items',
              [
                {
                  name: 'text',
                  map: 'label',
                },
              ]
            )
            that.treeInstance = jqwidgets.createInstance(
              `#${treeID}`,
              'jqxTree',
              {
                source: records,
                width: 158,
                height: 300,
              }
            )
            break
          }
          case 1: {
            const assignContainer = document.createElement('div')
            assignContainer.style.cssText = 'cursor: pointer;'
            const assignButtonID = JQXLite.generateID()
            assignContainer.id = assignButtonID
            tool[0].appendChild(assignContainer)
            jqwidgets.createInstance(`#${assignButtonID}`, 'jqxButton', {
              imgSrc: require('@/assets/iconfont/custom/specify.svg'),
            })
            that.assignButtonInstance = jqwidgets.createInstance(
              `#${assignButtonID}`,
              'jqxTooltip',
              {
                content: '指派类型',
                position: 'mouse',
              }
            )
            break
          }
          case 2: {
            const filterContainer = document.createElement('div')
            filterContainer.style.cssText = 'cursor: pointer;'
            const filterButtonID = JQXLite.generateID()
            filterContainer.id = filterButtonID
            tool[0].appendChild(filterContainer)
            jqwidgets.createInstance(`#${filterButtonID}`, 'jqxButton', {
              imgSrc: require('@/assets/iconfont/custom/filter.svg'),
            })
            that.filterInstance = jqwidgets.createInstance(
              `#${filterButtonID}`,
              'jqxTooltip',
              {
                content: '筛选',
                position: 'mouse',
              }
            )
            break
          }
          case 3: {
            tool[0].style.cssText = 'float:right;'
            // 选型工具栏
            const container = document.createElement('div')
            const containerID = JQXLite.generateID()
            container.id = containerID
            container.style.cssText =
              'overflow: hidden; position: relative;margin-top:1px'
            tool[0].appendChild(container)

            const SelectionToolComponent = Vue.extend(SelectionTool)
            that.selectionToolInstance = new SelectionToolComponent({
              store,
              propsData: {
                selectionType: '常规风机',
              },
            }).$mount(`#${containerID}`)
            break
          }
          case 4: {
            tool[0].style.cssText = 'float:right;'
            // 选型类型开关
            const selectionSwitch = document.createElement('div')
            const switchID = JQXLite.generateID()
            selectionSwitch.id = switchID
            tool[0].appendChild(selectionSwitch)
            const selectionType = jqwidgets.createInstance(
              `#${switchID}`,
              'jqxDropDownList',
              {
                source: [
                  GENERAL_BLOWER,
                  OUTSIDE_BUY,
                  CONTROL_BOX,
                  VENTILATOR,
                  WALL_BLOWER,
                  DUCT_BLOWER,
                  MUTE_BLOWER,
                  SIDE_WALL_BLOWER,
                  SIDE_WALL_BLOWER_EP,
                ],
                width: 130,
                height: 25,
                selectedIndex: 0,
              }
            )
            selectionType.addEventHandler('select', (event) => {
              const value = event.args.item.value
              that.selectionToolInstance.selectionType = value
              that.$bus.$emit('changeSelectionType',value)
              this.$parent.selectRibbon(value)
            })
            break
          }
          default:
            break
        }
      }
    },
  },
  destroyed() {},
}
</script>

<style scoped>
</style>
