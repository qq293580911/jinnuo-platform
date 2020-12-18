<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :autoOpen="false"
      :position="{ x: '30%', y: '20%' }"
    >
      <div>
        <JqxValidator
          ref="myValidator"
          @validationSuccess="onValidationSuccess($event)"
        >
          <JqxForm
            ref="myForm"
            :template="template"
          > </JqxForm>
        </JqxValidator>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue'
import JqxValidator from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue'
import JqxForm from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue'

import { Message, EDIT_ROLE } from '@/common/const.js'
import { addRole, updateRole } from '@/network/user.js'
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
  },
  data() {
    return {
      template: [
        {
          name: 'roleName',
          type: 'text',
          labelWidth: '80px',
          width: '250px',
          label: '角色名称',
          required: true,
          rowHeight: '40px',
        },
        {
          name: 'roleDesc',
          type: 'text',
          labelWidth: '80px',
          width: '250px',
          label: '角色描述',
          required: false,
          rowHeight: '40px',
        },
        {
          columns: [
            {
              name: 'submitButton',
              type: 'button',
              text: '提交',
              width: '60px',
              rowHeight: '50px',
              columnWidth: '50%',
              align: 'right',
            },
            {
              name: 'cancelButton',
              type: 'button',
              text: '取消',
              width: '60px',
              rowHeight: '50px',
              columnWidth: '50%',
            },
          ],
        },
      ],
    }
  },
  mounted() {
    const $roleName = this.$refs.myForm.getComponentByName('roleName')
    const $roleDesc = this.$refs.myForm.getComponentByName('roleDesc')

    this.roleNameInstance = $roleName
    this.roleDescInstance = $roleDesc
    
     // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: $roleName,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      }
    ]

    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName('submitButton')
    confirmBtn[0].addEventListener('click', (event) => {
      this.$refs.myValidator.validate(document.getElementById('myForm'))
    })

    const cancelButton = this.$refs.myForm.getComponentByName('cancelButton')
    cancelButton[0].addEventListener('click', () => {
      this.$refs.myWindow.close()
    })
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      if(params[0] == EDIT_ROLE){
        const rowData = params[1]
        this.id = rowData['role_id']
        this.roleNameInstance.val(rowData['role_name'])
        this.roleDescInstance.val(rowData['role_desc'])
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const formData = {
        roleName:this.roleNameInstance.val(),
        roleDesc:this.roleDescInstance.val(),
        roleId:this.id
      }
      const title = this.$refs.myWindow.title
      if(title == EDIT_ROLE){
        this.update(formData)
      }else{
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addRole(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateRole(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style scoped>
</style>