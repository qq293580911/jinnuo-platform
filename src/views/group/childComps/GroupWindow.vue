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
import { EDIT_GROUP } from '@/common/const.js'
import { addGroup,updateGroup } from '@/network/group.js'
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
          name: 'name',
          type: 'text',
          labelWidth: '80px',
          width: 250,
          label: '组名称',
          required: true,
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
    const $name = this.$refs.myForm.getComponentByName('name')
    this.nameInstance = $name

    this.$refs.myValidator.rules = [
      {
        input: $name,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
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
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const formData = {
        groupName: this.nameInstance.val(),
        groupId: this.id,
      }
      const title = this.$refs.myWindow.title
      if (title == EDIT_GROUP) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addGroup(params).then((res) => {
        this.$parent.renderGroups()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateGroup(params).then((res) => {
        this.$parent.renderGroups()
      })
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style scoped>
::v-deep .jqx-window {
  z-index: 99999;
}
</style>