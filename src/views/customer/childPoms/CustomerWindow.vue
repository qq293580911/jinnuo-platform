<template>
  <JqxWindow
    ref="myWindow"
    :width="'400px'"
    :autoOpen="false"
    :position="{ x: '40%', y: '30%' }"
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
</template>

<script>
import JqxWindow from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue'
import JqxValidator from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue'
import JqxForm from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue'

import { EDIT_CUSTOMER } from '@/common/const.js'
import { addCustomer, updateCustomer } from '@/network/customer.js'
export default {
  name: 'CustomerWindow',
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
          name: 'name',
          type: 'text',
          label: '客户姓名',
          labelWidth: '80px',
          width: '250px',
          required: true,
          rowHeight: '40px',
        },
        {
          name: 'type',
          type: 'dropdownlist',
          label: '客户类别',
          labelWidth: '80px',
          width: '250px',
          required: false,
          options: ['个体', '企业'],
        },
        {
          name: 'gender',
          type: 'custom',
          width: '250px',
          label: '客户性别',
          required: false,
          labelWidth: '80px',
          init: function (component) {
            // 男
            const maleContainer = document.createElement('div')
            const maleContainerID = JQXLite.generateID()
            maleContainer.id = maleContainerID
            maleContainer.style.cssText = 'float: left;margin-left:50px;'
            let span = document.createElement('span')
            span.innerHTML = '男'
            maleContainer.appendChild(span)
            component[0].appendChild(maleContainer)
            // 女
            const femaleContainer = document.createElement('div')
            const femaleContainerID = JQXLite.generateID()
            femaleContainer.id = femaleContainerID
            femaleContainer.style.cssText = 'float: left;margin-left:50px;'
            span = document.createElement('span')
            span.innerHTML = '女'
            femaleContainer.appendChild(span)
            component[0].appendChild(femaleContainer)

            that.maleInstance = jqwidgets.createInstance(
              `#${maleContainerID}`,
              'jqxRadioButton',
              {
                width: '30%',
                height: 30,
                checked: true,
              }
            )
            that.femaleInstance = jqwidgets.createInstance(
              `#${femaleContainerID}`,
              'jqxRadioButton',
              {
                width: '30%',
                height: 30,
              }
            )
          },
        },
        {
          name: 'phone',
          type: 'text',
          labelWidth: '80px',
          width: '250px',
          label: '客户电话',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
          labelWidth: '80px',
          width: '250px',
          label: '客户公司',
          required: false,
        },
        {
          name: 'position',
          type: 'text',
          labelWidth: '80px',
          width: '250px',
          label: '客户职位',
          required: false,
        },
        {
          columns: [
            {
              name: 'submitButton',
              type: 'button',
              text: '提交',
              width: '60px',
              rowHeight: '50px',
              align: 'right',
              columnWidth: '50%',
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
    const $type = this.$refs.myForm.getComponentByName('type')
    const $phone = this.$refs.myForm.getComponentByName('phone')
    const $company = this.$refs.myForm.getComponentByName('company')
    const $position = this.$refs.myForm.getComponentByName('position')

    this.nameInstance = $name
    this.typeInstance = $type
    this.phoneInstance = $phone
    this.companyInstance = $company
    this.positionInstance = $position

    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $name,
        message: '该项必填',
        action: 'input,blur',
        rule: 'required',
      },
      {
        input: $phone,
        message: '该项必填',
        action: 'input,blur',
        rule: () => {
          const phone = $phone.val()
          const reg = /^(1[3456789]\d{9})?$/
          return reg.test(phone)
        },
      },
    ]
    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName('submitButton')
    confirmBtn[0].addEventListener('click', (event) => {
      this.$refs.myValidator.validate(document.getElementById('myForm'))
    })
  },
  methods: {
    open(...params) {
      this.clearForm()
      this.$refs.myWindow.setTitle(params[0])
      if (params[0] == EDIT_CUSTOMER) {
        const rowData = params[1]
        this.id = rowData['id']
        this.nameInstance.val(rowData['name'])
        this.typeInstance.jqxDropDownList('selectItem', rowData['type'])
        if (rowData['gender'] == '男') {
          this.maleInstance.check()
        } else {
          this.femaleInstance.check()
        }
        this.phoneInstance.val(rowData['phone'])
        this.companyInstance.val(rowData['company'])
        this.positionInstance.val(rowData['position'])
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title
      const formData = {}
      formData['customerName'] = this.nameInstance.val()
      formData['customerType'] = this.typeInstance.val()
      formData['customerGender'] = this.maleInstance.val() == true ? '男' : '女'
      formData['customerPhone'] = this.phoneInstance.val()
      formData['customerCompany'] = this.companyInstance.val()
      formData['customerPosition'] = this.positionInstance.val()
      if (title == EDIT_CUSTOMER) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    clearForm() {
      this.nameInstance.val('')
      this.maleInstance.check()
      this.phoneInstance.val('')
      this.companyInstance.val('')
      this.positionInstance.val('')
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addCustomer(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateCustomer(params).then((res) => {
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
