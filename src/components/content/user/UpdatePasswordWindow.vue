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

import { getCookie, setCookie } from '@/common/util.js'
import { Base64 } from 'js-base64'
import { updateUserPassword } from '@/network/user.js'
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
  },
  data() {
    const that = this
    return {
      template: [
        {
          name: 'account',
          type: 'text',
          labelWidth: '80px',
          label: '用户账号',
          required: true,
          info: '输入账号',
          init(component) {
            component.jqxInput({
              width: 250,
              height: 30,
              disabled: true,
            })
          },
        },
        {
          name: 'oldPassword',
          type: 'password',
          labelWidth: '80px',
          label: '旧密码',
          required: true,
          rowHeight: '40px',
          init: (component) => {
            component.jqxPasswordInput({
              width: '250px',
              height: '30px',
            })
          },
        },
        {
          name: 'newPassword',
          type: 'password',
          labelWidth: '80px',
          label: '新密码',
          required: true,
          rowHeight: '40px',
          init: function (component) {
            component.jqxPasswordInput({
              width: '250px',
              height: '30px',
              showStrength: true,
              strengthTypeRenderer: function (
                password,
                characters,
                defaultStrength
              ) {
                let length = password.length
                let letters = characters.letters
                let numbers = characters.numbers
                let specialKeys = characters.specialKeys
                let strengthCoefficient =
                  letters +
                  numbers +
                  2 * specialKeys +
                  (letters * numbers) / 2 +
                  length
                let strengthValue
                let color
                if (length < 6) {
                  strengthValue = '太短'
                  color = 'rgb(170, 0, 51)'
                } else if (strengthCoefficient < 20) {
                  strengthValue = '弱'
                  color = 'rgb(170, 0, 51)'
                } else if (strengthCoefficient < 26) {
                  strengthValue = '一般'
                  color = 'rgb(255, 204, 51)'
                } else if (strengthCoefficient < 32) {
                  strengthValue = '好'
                  color = 'rgb(45, 152, 243)'
                } else {
                  strengthValue = '强'
                  color = 'rgb(118, 194, 97)'
                }
                return `<div style='color: ${color};'>${strengthValue}</div>`
              },
            })
          },
        },
        {
          name: 'confirmPassword',
          type: 'password',
          labelWidth: '80px',
          label: '确认密码',
          required: true,
          rowHeight: '40px',
          init: function (component) {
            component.jqxPasswordInput({
              width: '250px',
              height: '30px',
            })
          },
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
    const that = this
    this.accountInstance = this.$refs.myForm.getComponentByName('account')
    this.oldPasswordInstance = this.$refs.myForm.getComponentByName(
      'oldPassword'
    )
    this.newPasswordInstance = this.$refs.myForm.getComponentByName(
      'newPassword'
    )
    this.confirmPasswordInstance = this.$refs.myForm.getComponentByName(
      'confirmPassword'
    )

    // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: this.accountInstance,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: this.oldPasswordInstance,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: this.oldPasswordInstance,
        message: '旧密码错误!',
        action: 'keyup, blur',
        rule: (input) => {
          const password = input.val()
          return Base64.encode(password) == that.password
        },
      },
      {
        input: this.newPasswordInstance,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: this.newPasswordInstance,
        message: '新密码不能等于旧密码!',
        action: 'keyup, blur',
        rule: function (input) {
          return input.val() != that.oldPasswordInstance.val()
        },
      },
      {
        input: this.confirmPasswordInstance,
        message: '两次密码不一致！',
        action: 'keyup, blur',
        rule: function (input) {
          return input.val() == that.newPasswordInstance.val()
        },
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
    open(title) {
      this.$refs.myWindow.setTitle(title)
      // ID
      this.id = JSON.parse(window.sessionStorage.getItem('user')).id
      // 账号
      const account = JSON.parse(window.sessionStorage.getItem('user')).account
      this.accountInstance.val(account)
      // 密码
      this.password = JSON.parse(window.sessionStorage.getItem('user')).password
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title
      const formData = {}
      formData['userId'] = this.id
      formData['account'] = this.accountInstance.val()
      formData['password'] = this.newPasswordInstance.val()
      this.update(formData)
    },
    update(formData) {
      updateUserPassword({ JSONParams: JSON.stringify(formData) }).then((res) => {})
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style scoped>
</style>