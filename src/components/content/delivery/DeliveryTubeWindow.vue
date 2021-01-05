<template>
  <div>
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
  </div>
</template>

<script>
import JqxWindow from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue'
import JqxValidator from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue'
import JqxForm from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue'
import { ADD_DELIVERY, EDIT_DELIVERY } from '@/common/const.js'
import { addDelivery, updateDelivery } from '@/network/delivery'
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
  },
  props: {
    orderNumberDisabled: {
      type: Boolean,
      default: false,
    },
    projectNameDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      template: [
        {
          name: 'orderNumber',
          type: 'text',
          label: '下单编号',
          labelWidth: '100px',
          width: '250px',
          required: true,
          rowHeight: '40px',
        },
        {
          name: 'projectName',
          type: 'text',
          label: '项目名称',
          labelWidth: '100px',
          width: '250px',
          required: true,
          rowHeight: '40px',
        },
        {
          name: 'deliveryAmount',
          type: 'custom',
          label: '送货金额',
          labelWidth: '100px',
          required: true,
          rowHeight: '40px',
          init: (component) => {
            jqwidgets.createInstance(component, 'jqxNumberInput', {
              width: 250,
              height: 30,
              inputMode: 'simple',
              digits: 11,
              spinButtons: true,
              decimalDigits: 2,
            })
          },
        },
        {
          name: 'deliveryDate',
          type: 'date',
          label: '送货日期',
          labelWidth: '100px',
          width: '250px',
          required: true,
          rowHeight: '40px',
          formatString: 'yyyy-MM-dd',
        },
        {
          name: 'deliveryArea',
          type: 'custom',
          label: '送货面积',
          labelWidth: '100px',
          required: false,
          rowHeight: '40px',
          init: (component) => {
            jqwidgets.createInstance(component, 'jqxNumberInput', {
              width: 250,
              height: 30,
              inputMode: 'simple',
              digits: 11,
              spinButtons: true,
              decimalDigits: 2,
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
    const $orderNumber = this.$refs.myForm.getComponentByName('orderNumber')
    $orderNumber.jqxInput({ disabled: this.orderNumberDisabled })
    this.orderNumberInstance = $orderNumber

    const $projectName = this.$refs.myForm.getComponentByName('projectName')
    $projectName.jqxInput({ disabled: this.projectNameDisabled })
    this.projectNameInstance = $projectName

    const $deliveryAmount = this.$refs.myForm.getComponentByName(
      'deliveryAmount'
    )
    this.deliveryAmountInstance = $deliveryAmount

    const $deliveryDate = this.$refs.myForm.getComponentByName('deliveryDate')
    this.deliveryDateInstance = $deliveryDate

    const $deliveryArea = this.$refs.myForm.getComponentByName('deliveryArea')
    this.deliveryAreaInstance = $deliveryArea
    this.$refs.myForm.hideComponent('deliveryArea')

    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName('submitButton')
    confirmBtn[0].addEventListener('click', (event) => {
      this.$refs.myValidator.validate(document.getElementById('myForm'))
    })

    const cancelBtn = this.$refs.myForm.getComponentByName('cancelButton')
    cancelBtn[0].addEventListener('click', (event) => {
      this.$refs.myWindow.close()
    })
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      const rowData = params[1]
      if (rowData && rowData['order_number']) {
        this.orderNumberInstance.val(rowData['order_number'])
      }
      if (rowData && rowData['project_name']) {
        this.projectNameInstance.val(rowData['project_name'])
      }
      if (params[0] == EDIT_DELIVERY) {
        this.deliveryAmountInstance.jqxNumberInput(
          'setDecimal',
          rowData['delivery_amount']
        )
        this.deliveryDateInstance.jqxDateTimeInput(
          'setDate',
          new Date(rowData['delivery_date'])
        )
        this.deliveryAreaInstance.jqxNumberInput('setDecimal',rowData['delivery_area'])
        this.id = rowData['id']
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const formData = {}
      formData['orderNumber'] = this.orderNumberInstance.val()
      formData['deliveryAmount'] = this.deliveryAmountInstance.val()
      formData['deliveryDate'] = this.deliveryDateInstance.val()
      formData['deliveryArea'] = this.deliveryAreaInstance.val()
      formData['id'] = this.id
      const title = this.$refs.myWindow.title
      if (title == EDIT_DELIVERY) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addDelivery(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateDelivery(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    clearForm() {
      this.orderNumberInstance.val('')
      this.projectNameInstance.val('')
      this.deliveryAmountInstance.jqxNumberInput('setDecimal', 0)
      this.deliveryDateInstance.val(new Date())
      this.deliveryAreaInstance.jqxNumberInput('setDecimal', 0)
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style scoped>
</style>