<template>
  <div :style="contentStyle">
    <JqxToolbar
      :width="'100%'"
      :height="35"
      :rtl="false"
      :tools="tools"
      :initTools="initTools"
    >
    </JqxToolbar>
    <JqxListBox
      ref="myListbox"
      :style="{
        margin:'5px',
        float:'left'
      }"
      :allowDrag="true"
      @dragStart="onDragStart($event)"
      :source="salesmans"
      :displayMember="'emp_name'"
      :valueMember="'emp_id'"
      :itemHeight="40"
      :width="'10%'"
      :height="'95%'"
    >
    </JqxListBox>
    <JqxPanel
      :style="{
         margin:'5px',
        float:'left'
      }"
      :width="dockWidth"
      :height="'95%'"
    >
      <div>
        <JqxDocking
          ref="myDocking"
          :width="'100%'"
          :orientation="'horizontal'"
          :mode="'default'"
          v-if="groups.length > 0"
        >
          <div
            v-for="(items, index) in groups"
            :key="index"
            style="height: 150px;width:33.5%;"
          >
            <div
              v-for="(item, index) in items"
              :key="index"
              :id="getWindowId(item.groupId)"
            >
              <div>{{ item.name }}</div>
              <div>
                <JqxListBox
                  ref="myListBox"
                  style="float: left"
                  :source="item.group"
                  @dragStart="onDragStart($event,item.groupId)"
                  @change="onChange($event,item.groupId)"
                  :width="'100%'"
                  :height="'100%'"
                  :allowDrop="true"
                  :allowDrag="true"
                  :displayMember="'emp_name'"
                  :valueMember="'emp_id'"
                >
                </JqxListBox>
              </div>
            </div>
          </div>
        </JqxDocking>
      </div>
    </JqxPanel>
    <group-window ref="groupWindow"></group-window>
  </div>
</template>

<script>
import JqxToolbar from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue'
import JqxListBox from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue'
import JqxPanel from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxpanel.vue'
import JqxDocking from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxdocking.vue'

import GroupWindow from './GroupWindow'
import { Message, ADD_GROUP, EDIT_GROUP } from '@/common/const.js'
import { debounce } from '@/common/util.js'
import {
  getSalesGroupList,
  deleteGroup,
  assignGroupSalesman,
} from '@/network/group.js'
export default {
  name: 'Test',
  components: {
    JqxToolbar,
    JqxListBox,
    JqxPanel,
    JqxDocking,
    GroupWindow,
  },
  computed: {
    contentStyle() {
      const style = {}
      if (this.height) {
        style.height = this.height
      } else {
        switch (jqx.theme) {
          case 'ui-smoothness':
            style.height = 'calc(100vh - 145px)'
            break
          default:
            style.height = 'calc(100vh - 140px)'
            break
        }
      }
      return style
    },
    dockWidth() {
      return 'calc(90% - 23px)'
    },
  },
  beforeCreate() {
    this.count = 3
  },
  data() {
    return {
      tools: 'custom',
      salesmans: [],
      groups: [],
      originData: [],
      emp: {},
      sortableCount: 0,
    }
  },
  created() {
    const salesmans = this.$store.state.salesmans
    salesmans.forEach((item) => {
      item.html = `<div><div>${item.emp_name}</div></div>`
      item.group = `参考分组：${item.company}`
      if(item['is_resign']=='离职'){
        item.group = `参考分组：离职人员`
      }
    })
    this.salesmans = salesmans
    this.renderGroups()
  },
  mounted() {
    this.addGroupInstance.addEventHandler('click', () => {
      this.$refs.groupWindow.open(ADD_GROUP)
    })
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      if (menuToolIninitialization == false) {
        switch (index) {
          case 0: {
            const addButtonContainer = document.createElement('div')
            addButtonContainer.id = JQXLite.generateID()
            addButtonContainer.style.cssText =
              'float: left; margin-left: 5px;cursor: pointer;'
            tool[0].appendChild(addButtonContainer)
            this.addGroupInstance = jqwidgets.createInstance(
              addButtonContainer,
              'jqxButton',
              {
                imgSrc: require('@/assets/iconfont/custom/add-circle.svg'),
              }
            )
            jqwidgets.createInstance(addButtonContainer, 'jqxTooltip', {
              content: '添加新团队',
              position: 'mouse',
            })
            break
          }
        }
      }
    },
    onDragStart(event, groupId) {
      const empId = event.args.value
      const emp = this.originData.find((item) => {
        return item['emp_id'] == empId
      })
      this.emp.empId = empId
      if (emp) {
        this.emp.id = emp['id']
      }
    },
    onChange(event, groupId) {
      this.emp.groupId = groupId
      if (this.emp.empId) {
        const instanceID = event.target.id
        const params = {
          jsonParams: JSON.stringify(this.emp),
        }
        // 只执行最后一次事件
        clearTimeout(this.iTime)
        this.iTime = setTimeout(() => {
          //需要执行的事件
          assignGroupSalesman(params).then((res) => {
            // 去重
            let items = $(`#${instanceID}`).jqxListBox('getItems')
            const hash = {}
            items = items
              .filter((item) => {
                return item['value'] != null
              })
              .map((item) => {
                delete item['group']
                delete item['html']
                return item
              })
              .reduce((item, next) => {
                hash[next.value]
                  ? ''
                  : (hash[next.value] = true && item.push(next))
                return item
              }, [])

            $(`#${instanceID}`).jqxListBox({ source: items })
            this.emp = {}
          })
        }, 500)
      }
    },
    getWindowId(windowID) {
      const that = this
      this.$nextTick(() => {
        $(`#${windowID}`).on('close', (event) => {
          this.$confirm({
            title: `${Message.CONFIRM_DELETE}`,
            okText: '确认',
            cancelText: '取消',
            centered: true,
            okType: 'danger',
            content: (h) => <div style="color:red;"></div>,
            onOk() {
              that.delete(windowID)
            },
            onCancel() {
              that.renderGroups()
            },
            class: 'test',
          })
        })
        this.$refs.myDocking.pinWindow(windowID)
      })
      return windowID
    },
    renderGroups() {
      this.groups = []
      this.originData = []
      getSalesGroupList(null).then((res) => {
        for (let key in res) {
          const group = res[key]
          group.forEach((item, index) => {
            this.originData.push(item)
          })
        }
        const list = []
        for (const key in res) {
          const map = {}
          map.name = key
          map.group = res[key]
          map.groupId = res[key][0]['group_id']
          list.push(map)
        }
        for (let i = 0; i < this.count; i++) {
          const docks = list.filter((item, index) => {
            if (index % this.count == i) {
              return item
            }
          })
          this.groups.push(docks)
        }
      })
    },
    delete(groupId) {
      const params = {
        jsonParams: JSON.stringify({
          groupId,
        }),
      }
      deleteGroup(params).then((res) => {})
    },
  },
}
</script>

<style scoped>
</style>
