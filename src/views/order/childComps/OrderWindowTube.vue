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

import { EDIT_ORDER } from '@/common/const'
import { addOrder, updateOrder } from '@/network/order'
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
  },
  created() {
    this.salesmans = this.$store.state.salesmans
  },
  data() {
    return {
      template: [
        {
          name: 'productType',
          type: 'dropdownlist',
          label: '产品类型',
          labelWidth: '100px',
          width: '250px',
          required: true,
          rowHeight: '40px',
          options: [{ value: '风管' }, { value: '风管辅材' }],
        },
        {
          name: 'orderDate',
          type: 'date',
          label: '下单日期',
          formatString: 'yyyy-MM-dd',
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
          name: 'salesman',
          type: 'custom',
          label: '业务员',
          labelWidth: '100px',
          required: true,
          rowHeight: '40px',
          init: (component) => {
            component.jqxComboBox({
              source: this.salesmans,
              width: 250,
              height: 30,
              animationType: 'slide',
              displayMember: 'emp_name',
              valueMember: 'emp_id',
            })
          },
        },
        {
          name: 'contractNumber',
          type: 'text',
          label: '合同编号',
          labelWidth: '100px',
          width: '250px',
          required: true,
          rowHeight: '40px',
        },
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
          name: 'orderAmount',
          type: 'custom',
          label: '下单金额',
          labelWidth: '100px',
          required: true,
          rowHeight: '40px',
          init: function (component) {
            component.jqxNumberInput({
              width: 250,
              height: 30,
              inputMode: 'simple',
              digits: 11,
              spinButtons: true,
              decimalDigits: 0,
            })
          },
        },
        {
          name: 'orderArea',
          type: 'custom',
          label: '下单面积',
          labelWidth: '100px',
          required: false,
          rowHeight: '40px',
          init: function (component) {
            component.jqxNumberInput({
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
          name: 'considerationCommissionStatus',
          type: 'custom',
          label: '计提成状态',
          labelWidth: '100px',
          required: false,
          rowHeight: '40px',
          init: function (component) {
            component.jqxDropDownList({
              source: ['进行中', '已终止'],
              width: 250,
              height: 30,
            })
          },
        },
        {
          name: 'actualFreight',
          type: 'custom',
          label: '实际运费',
          labelWidth: '100px',
          required: false,
          rowHeight: '40px',
          init: function (component) {
            jqwidgets.createInstance(component, 'jqxNumberInput', {
              width: 250,
              height: 30,
              inputMode: 'simple',
              digits: 11,
              spinButtons: true,
              decimalDigits: 0,
              disabled: false,
            })
          },
        },
        {
          name: 'remark',
          type: 'text',
          label: '备注',
          labelWidth: '100px',
          width: '250px',
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
              height: '30px',
              rowHeight: '50px',
              align: 'right',
              columnWidth: '50%',
            },
            {
              name: 'cancelButton',
              type: 'button',
              text: '取消',
              width: '60px',
              height: '30px',
              rowHeight: '50px',
              columnWidth: '50%',
            },
          ],
        },
      ],
      id: null,
    }
  },
  mounted() {
    const $productType = this.$refs.myForm.getComponentByName('productType')
    const $orderDate = this.$refs.myForm.getComponentByName('orderDate')
    const $projectName = this.$refs.myForm.getComponentByName('projectName')
    const $salesman = this.$refs.myForm.getComponentByName('salesman')
    const $contractNumber = this.$refs.myForm.getComponentByName(
      'contractNumber'
    )
    const $orderNumber = this.$refs.myForm.getComponentByName('orderNumber')
    const $orderAmount = this.$refs.myForm.getComponentByName('orderAmount')
    const $orderArea = this.$refs.myForm.getComponentByName('orderArea')
    const $actualFreight = this.$refs.myForm.getComponentByName('actualFreight')
    const $remark = this.$refs.myForm.getComponentByName('remark')
    const $considerationCommissionStatus = this.$refs.myForm.getComponentByName(
      'considerationCommissionStatus'
    )
    this.productTypeInstance = $productType
    this.orderDateInstance = $orderDate
    this.projectNameInstance = $projectName
    this.salesmanInstance = $salesman
    this.contractNumberInstance = $contractNumber
    this.orderNumberInstance = $orderNumber
    this.orderAmountInstance = $orderAmount
    this.orderAreaInstance = $orderArea
    this.actualFreightInstance = $actualFreight
    this.remarkInstance = $remark
    this.considerationCommissionStatusInstance = $considerationCommissionStatus

    // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: $productType,
        message: '此项必选!',
        action: 'change',
        rule: () => {
          const index = $productType.jqxDropDownList('getSelectedIndex')
          return index > -1
        },
      },
      {
        input: $projectName,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $salesman,
        message: '此项必选!',
        action: 'change',
        rule: () => {
          const index = $salesman.jqxComboBox('getSelectedIndex')
          return index > -1
        },
      },
      {
        input: $contractNumber,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $orderNumber,
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
    const cancelBtn = this.$refs.myForm.getComponentByName('cancelButton')
    cancelBtn[0].addEventListener('click', (event) => {
      this.$refs.myWindow.close()
    })
  },
  methods: {
    onValidationSuccess(event) {
      const formData = {}
      formData['productType'] = this.productTypeInstance.val()
      formData['orderDate'] = this.orderDateInstance.val()
      formData['projectName'] = this.projectNameInstance.val()
      formData['salesman'] = this.salesmanInstance.val()
      formData['contractNumber'] = this.contractNumberInstance.val()
      formData['orderNumber'] = this.orderNumberInstance.val()
      formData['orderAmount'] = this.orderAmountInstance.val()
      formData['orderArea'] = this.orderAreaInstance.val()
      formData['actualFreight'] = this.actualFreightInstance.val()
      formData['remark'] = this.remarkInstance.val()
      formData[
        'considerationCommissionStatus'
      ] = this.considerationCommissionStatusInstance.val()
      formData['id'] = this.id
      const title = this.$refs.myWindow.title
      if (title == EDIT_ORDER) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      if (params[0] == EDIT_ORDER) {
        const rowData = params[1]
        this.$nextTick(() => {
          this.productTypeInstance.jqxDropDownList('selectIndex', 0)
          this.orderDateInstance.jqxDateTimeInput(
            'setDate',
            new Date(rowData['order_date'])
          )
          this.projectNameInstance.val(rowData['project_name'])
          this.salesmanInstance.jqxComboBox('selectItem', rowData['salesman'])
          this.contractNumberInstance.val(rowData['contract_number'])
          this.orderNumberInstance.val(rowData['order_number'])
          this.orderAmountInstance.jqxNumberInput(
            'setDecimal',
            rowData['order_amount']
          )
          this.orderAreaInstance.jqxNumberInput(
            'setDecimal',
            rowData['order_area']
          )
          this.actualFreightInstance.jqxNumberInput(
            'setDecimal',
            rowData['actual_freight']
          )
          this.remarkInstance.val(rowData['remark'])
          this.considerationCommissionStatusInstance.jqxDropDownList(
            'selectItem',
            rowData['consideration_commission_status']
          )
          this.id = rowData['id']
        })
      }
      this.$refs.myWindow.open()
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addOrder(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
        this.clearForm()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateOrder(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
        this.clearForm()
      })
    },
    clearForm() {
      // 重置部件设置
      this.productTypeInstance.jqxDropDownList('clearSelection')
      this.orderDateInstance.val(new Date())
      this.projectNameInstance.val('')
      this.salesmanInstance.jqxComboBox('clearSelection')
      this.contractNumberInstance.val('')
      this.orderNumberInstance.val('')
      this.orderAmountInstance.jqxNumberInput('setDecimal', 0)
      this.orderAreaInstance.jqxNumberInput('setDecimal', 0)
      this.considerationCommissionStatusInstance.jqxDropDownList('clearSelection')
      this.actualFreightInstance.jqxNumberInput('setDecimal', 0)
      this.remarkInstance.val('')
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style>
</style>
