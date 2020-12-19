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
import JqxValidator from "jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue";
import JqxForm from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue'

import { EDIT_CUSTOMER } from '@/common/const.js'
export default {
  name: 'CustomerWindow',
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
          options: ['个体', '公司'],
        },
        {
          name: 'gender',
          type: 'custom',
          width: '250px',
          label: '客户性别',
          required: false,
          labelWidth: '80px',
          init: function (component) {
            var div = `<div id="male" style="float: left;margin-left:50px;"><span>男</span></div>
                                        <div id="female" style="float: left;margin-left:10px;"><span>女</span></div>`
            component.append(div)
            jqwidgets.createInstance('#male', 'jqxRadioButton', {
              width: '30%',
              height: 30,
              checked: true,
            })
            jqwidgets.createInstance('#female', 'jqxRadioButton', {
              width: '30%',
              height: 30,
              checked: true,
            })
            $('#male').jqxRadioButton({
              width: '30%',
              height: 30,
            })
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
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      if (params[0] == EDIT_CUSTOMER) {
        const rowData = params[1]
        console.log(rowData)
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title
      const formData = {}
      if (title == EDIT_CUSTOMER) {
        this.update(formData)
      } else {
        this.add(formData)
      }
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
}
</script>

<style scoped>
</style>
