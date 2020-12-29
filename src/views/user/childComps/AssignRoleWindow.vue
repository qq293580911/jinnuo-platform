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

import { getAllRoleListByUserId, assignRole } from '@/network/user.js'
export default {
  components: {
    JqxWindow,
    JqxForm,
  },
  data() {
    const that = this
    return {
      template: [
        {
          name: 'role',
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
                displayMember: 'role_name',
                valueMember: 'role_id',
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
        map['roleId'] = item['originalItem']['role_id']
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
          userId: this.userId,
        }),
      }
      assignRole(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    })
  },
  methods: {
    open(...params) {
      const that = this
      this.$refs.myWindow.setTitle(params[0])
      const userId = params[1]
      this.userId = userId
      const jsonParams = {
        jsonParams: JSON.stringify({
          userId,
        }),
      }
      getAllRoleListByUserId(jsonParams).then((res) => {
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

<style scoped>
</style>