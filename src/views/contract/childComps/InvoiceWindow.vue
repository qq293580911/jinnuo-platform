<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'350px'"
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

import { EDIT_CONTRACT_INVOICE } from '@/common/const'
import { checkContractNumberExist } from '@/network/contract'
import { addContractInvoice, updateContractInvoice } from '@/network/invoice'
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
          name: 'applyDate',
          type: 'custom',
          label: '申请日期',
          labelWidth: '110px',
          rowHeight: '40px',
          init: function (component) {
            component.jqxDateTimeInput({
              width: 250,
              height: 30,
              culture: 'zh-CN',
              formatString: 'yyyy-MM-dd',
            })
          },
        },
        {
          name: 'contractNumber',
          type: 'text',
          label: '合同编号',
          labelWidth: '110px',
          width: '250px',
          rowHeight: '40px',
        },
        {
          name: 'invoiceAmount',
          type: 'text',
          label: '发票金额',
          labelWidth: '110px',
          required: false,
          rowHeight: '40px',
          init: function (component) {
            component.jqxNumberInput({
              width: '250px',
              height: '30px',
              digits: 11,
              decimalDigits: 2,
              inputMode: 'simple',
              spinButtons: true,
            })
          },
        },
        {
          name: 'sendDate',
          type: 'text',
          label: '寄出日期',
          labelWidth: '110px',
          width: '250px',
          required: false,
          rowHeight: '40px',
        },
        {
          name: 'trackNumber',
          type: 'text',
          label: '快递单号',
          labelWidth: '110px',
          width: '250px',
          required: false,
          rowHeight: '40px',
        },
        {
          name: 'sendAddress',
          type: 'text',
          label: '寄出地址',
          labelWidth: '110px',
          width: '250px',
          required: false,
          rowHeight: '40px',
        },
        {
          name: 'remark',
          type: 'text',
          label: '备注',
          labelWidth: '110px',
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
      id: null,
    }
  },
  mounted() {
    const $contractNumber = this.$refs.myForm.getComponentByName(
      'contractNumber'
    )
    const $applyDate = this.$refs.myForm.getComponentByName('applyDate')
    const $invoiceAmount = this.$refs.myForm.getComponentByName('invoiceAmount')
    const $sendDate = this.$refs.myForm.getComponentByName('sendDate')
    const $trackNumber = this.$refs.myForm.getComponentByName('trackNumber')
    const $sendAddress = this.$refs.myForm.getComponentByName('sendAddress')
    const $remark = this.$refs.myForm.getComponentByName('remark')

    this.contractNumberInstance = $contractNumber
    this.applyDateInstance = $applyDate
    this.invoiceAmountInstance = $invoiceAmount
    this.sendDateInstance = $sendDate
    this.trackNumberInstance = $trackNumber
    this.sendAddressInstance = $sendAddress
    this.remarkInstance = $remark
    // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: $contractNumber,
        message: '该项必填',
        action: 'keyup,blur',
        rule: 'required',
      },
      {
        input: $contractNumber,
        message: '该项必填',
        action: 'input,blur',
        rule: 'required',
      },
      {
        input: $contractNumber,
        message: '未找到此合同编号',
        action: 'blur',
        rule: function (input) {
          let isExists = false
          const contractNumber = input.val()
          const jsonParams = {
            contractNumber,
          }
          const xhr = new XMLHttpRequest()
          xhr.open(
            'Get',
            `/api/contrDtl/checkContractNumberExists.do?jsonParams=${encodeURIComponent(
              JSON.stringify(jsonParams)
            )}`,
            false
          ) // false表示同步请求
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              const res = JSON.parse(xhr.responseText)
              isExists = res
            } else {
              console.log(xhr)
            }
          }
          xhr.send(null)
          return isExists
        },
      },
      {
        input: $sendDate,
        message: '日期格式不正确',
        action: 'keyup',
        rule: function () {
          const value = $sendDate.val()
          if (value == '' || value == null) {
            return true
          }
          const r = value.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/)
          return r != null
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
      this.clearForm()
      this.$refs.myWindow.setTitle(params[0])
      if (params[0] == EDIT_CONTRACT_INVOICE) {
        const data = params[1]
        console.log(data)
        this.applyDateInstance.jqxDateTimeInput('setDate', data['apply_date'])
        this.contractNumberInstance.val(data['contract_number'])
        this.invoiceAmountInstance.jqxNumberInput(
          'setDecimal',
          data['invoice_amount']
        )
        this.sendDateInstance.val(data['send_date'])
        this.trackNumberInstance.val(data['track_number'])
        this.sendAddressInstance.val(data['send_address'])
        this.remarkInstance.val(data['remark'])
        this.id = data['id']
      }
      this.$refs.myWindow.open()
    },
    checkNumberExist: async function (contractNumber) {
      const params = {
        jsonParams: JSON.stringify({ contractNumber }),
      }
      await checkContractNumberExist(params).then((res) => {})
    },
    onValidationSuccess(event) {
      const formData = {}
      formData['applyDate'] = this.applyDateInstance.val()
      formData['contractNumber'] = this.contractNumberInstance.val()
      formData['invoiceAmount'] = this.invoiceAmountInstance.val()
      formData['sendDate'] = this.sendDateInstance.val()
      formData['trackNumber'] = this.trackNumberInstance.val()
      formData['sendAddress'] = this.sendAddressInstance.val()
      formData['remark'] = this.remarkInstance.val()
      formData['contrInvId'] = this.id
      const title = this.$refs.myWindow.title
      if (title == EDIT_CONTRACT_INVOICE) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addContractInvoice(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateContractInvoice(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    clearForm() {
      this.contractNumberInstance.val('')
      this.applyDateInstance.jqxDateTimeInput('setDate', new Date())
      this.invoiceAmountInstance.jqxNumberInput('setDecimal', 0)
      this.sendDateInstance.val('')
      this.trackNumberInstance.val('')
      this.sendAddressInstance.val('')
      this.remarkInstance.val('')
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style scoped>
</style>
