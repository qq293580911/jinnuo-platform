<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :autoOpen="false"
      :position="{ x: '40%', y: '30%' }"
    >
      <div>
        <JqxForm
          ref="myForm"
          :template="template"
        > </JqxForm>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue'
import JqxForm from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue'

import { getEmployeePosition, assignPosition } from '@/network/employee.js'
export default {
  components: {
    JqxWindow,
    JqxForm,
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: 'id', type: 'number' },
        { name: 'posId', map: 'pos_id', type: 'number' },
        { name: 'posName', map: 'pos_name', type: 'string' },
        { name: 'empId', map: 'emp_id', type: 'number' },
        { name: 'enable', type: 'number' },
      ],
      url: '/emp/getEmployeePositionList.do',
      type: 'get',
      dataType: 'json',
    }
  },
  data() {
    const that = this
    return {
      template: [
        {
          name: 'position',
          type: 'custom',
          init(component) {
            that.listBoxInstance = jqwidgets.createInstance(
              component,
              'jqxListBox',
              {
                source: [],
                checkboxes: true,
                width: '100%',
                height: 200,
                displayMember: 'pos_name',
                valueMember: 'pos_id',
              }
            )
          },
        },
        {
          name: 'submitButton',
          type: 'button',
          text: '提交',
          width: '60px',
          rowHeight: '50px',
          align: 'center',
        },
      ],
    }
  },
  mounted() {
    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName('submitButton')
    confirmBtn[0].addEventListener('click', (event) => {
      const items = this.listBoxInstance.getItems()
      const arr = items.map((item) => {
        const map = {}
        map['id'] = item['originalItem']['id']
        map['posId'] = item['originalItem']['pos_id']
        if (item['checked'] == true) {
          map['enable'] = 1
        } else {
          map['enable'] = 0
        }
        return map
      })
      const params = {
        jsonParams: JSON.stringify({
          items: arr,
          empId: this.empId,
        }),
      }
      assignPosition(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    })
  },
  methods: {
    open(...param) {
      const that = this
      this.$refs.myWindow.setTitle(param[0])
      const empId = param[1]
      this.empId = empId
      const params = {
        jsonParams: JSON.stringify({
          empId,
        }),
      }
      getEmployeePosition(params).then((res) => {
        this.listBoxInstance.source = res
        this.listBoxInstance.refresh()
        res
          .filter((item, index) => {
            item['index'] = index
            return item['enable'] == 1
          })
          .map((item) => {
            this.listBoxInstance.checkIndex(item['index'])
          })
      })
      this.$refs.myWindow.open()
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style>
</style>
