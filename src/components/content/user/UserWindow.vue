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

import { EDIT_USER } from '@/common/const.js'
import { addUser, updateUserInfo } from '@/network/user.js'
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
              disabled: that.accountDisabled,
            })
          },
        },
        {
          name: 'password',
          type: 'password',
          labelWidth: '80px',
          label: '用户密码',
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
          name: 'userName',
          type: 'text',
          labelWidth: '80px',
          width: '250px',
          label: '用户姓名',
          required: true,
          rowHeight: '40px',
        },
        {
          name: 'gender',
          type: 'custom',
          labelWidth: '80px',
          align: 'center',
          label: '用户性别',
          rowHeight: '40px',
          init: function (component) {
            const div = `<div id="male" style="float: left;margin-left:50px;"><span>男</span></div>
                                        <div id="female" style="float: left;margin-left:10px;"><span>女</span></div>`
            component.append(div)
            $('#male').jqxRadioButton({
              width: '30%',
              height: 30,
              checked: true,
            })
            $('#female').jqxRadioButton({ width: '30%', height: 30 })
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
      accountDisabled: false,
      passwordDisabled: false,
    }
  },
  mounted() {
    const that = this
    const $account = this.$refs.myForm.getComponentByName('account')
    const $password = this.$refs.myForm.getComponentByName('password')
    const $confirmPassword = this.$refs.myForm.getComponentByName(
      'confirmPassword'
    )
    const $userName = this.$refs.myForm.getComponentByName('userName')
    const $gender = this.$refs.myForm.getComponentByName('gender')

    this.accountInstance = $account
    this.passwordInstance = $password
    this.confirmPasswordInstance = $confirmPassword
    this.userNameInstance = $userName
    this.genderInstance = $gender

    // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: $account,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $account,
        message: '账号必须在2-12个字符之间',
        action: 'keyup, blur',
        rule: 'length=2,12',
      },
      {
        input: $userName,
        message: '该项必填!',
        action: 'keyup',
        rule: 'required',
      },
      {
        input: $userName,
        message: '该项不能包含数字!',
        action: 'keyup',
        rule: 'notNumber',
      },
      {
        input: $userName,
        message: '姓名必须在2-12个字符之间',
        action: 'keyup, blur',
        rule: 'length=2,12',
      },
      {
        input: $password,
        message: '该项必填！',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $password,
        message: '密码必须在3-16个字符之间！',
        action: 'keyup, blur',
        rule: 'length=3,16',
      },
      {
        input: $confirmPassword,
        message: '该项必填！',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $confirmPassword,
        message: '两次密码不一致！',
        action: 'keyup, blur',
        rule: function (input) {
          return input.val() === $password.val()
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
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      if (params[0] == EDIT_USER) {
        const rowData = params[1]
        this.accountInstance.val(rowData['account'])
        this.accountInstance.jqxInput({ disabled: true })
        this.passwordInstance.jqxPasswordInput({ disabled: true })
        this.passwordInstance.val('0000000000000000')
        this.confirmPasswordInstance.jqxPasswordInput({ disabled: true })
        this.confirmPasswordInstance.val('0000000000000000')
        this.userNameInstance.val(rowData['user_name'])
        this.id = rowData['user_id']
      }

      if (params[0] == '修改密码') {
        console.log(window.sessionStorage)
      }

      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title
      const formData = {}
      formData['userName'] = this.userNameInstance.val()
      formData['gender'] = $('#male').val() == true ? '男' : '女'
      if (title == EDIT_USER) {
        formData['userId'] = this.id
        this.update(formData)
      } else {
        formData['account'] = this.accountInstance.val()
        formData['password'] = this.passwordInstance.val()
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addUser(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateUserInfo(params).then((res) => {
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