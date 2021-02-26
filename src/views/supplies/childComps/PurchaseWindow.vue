<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :height="'325px'"
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

import { EDIT_SUPPLIES_PURCHASE } from '@/common/const.js'
import {
  getAllSupplies,
  addPurchase,
  updatePurchase,
} from '@/network/supplies.js'
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
          name: 'supplies',
          type: 'custom',
          labelWidth: '80px',
          label: '选择用品',
          width: '250px',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            getAllSupplies().then((res) => {
              res = res.map((item) => {
                const map = {}
                map['html'] =
                  "<div tabIndex=0 style='padding: 1px;'><div>名称:" +
                  item['supplies_name'] +
                  '</div><div>规格: ' +
                  item['specification_model'] +
                  '</div></div>'
                map['label'] = item.supplies_name
                map['value'] = item.supplies_id
                return map
              })
              jqwidgets.createInstance(component, `jqxComboBox`, {
                width: 250,
                height: 30,
                animationType: 'fade',
                displayMember: 'label',
                valueMember: 'value',
                source: res,
              })
            })
          },
        },
        {
          name: 'date',
          type: 'custom',
          labelWidth: '80px',
          label: '采购日期',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            jqwidgets.createInstance(component, 'jqxDateTimeInput', {
              width: 250,
              height: 30,
              culture: 'zh-CN',
              formatString: 'yyyy-MM-dd',
            })
          },
        },
        {
          name: 'quantity',
          type: 'custom',
          labelWidth: '80px',
          label: '采购数量',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            jqwidgets.createInstance(component, `jqxNumberInput`, {
              width: 250,
              height: 30,
              inputMode: 'simple',
              decimalDigits: 0,
              digits: 11,
              spinButtons: true,
            })
          },
        },
        {
          name: 'unitPrice',
          type: 'custom',
          labelWidth: '80px',
          label: '采购单价',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            jqwidgets.createInstance(component, `jqxNumberInput`, {
              width: 250,
              height: 30,
              inputMode: 'simple',
              decimalDigits: 2,
              digits: 11,
              spinButtons: true,
            })
          },
        },
        {
          name: 'purchaser',
          type: 'custom',
          labelWidth: '80px',
          label: '采购人',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            jqwidgets.createInstance(component, `jqxComboBox`, {
              source: that.$store.state.purchasers,
              animationType: 'fade',
              width: 250,
              height: 30,
              displayMember: 'emp_name',
              valueMember: 'emp_id',
            })
          },
        },
        {
          name: 'remark',
          type: 'text',
          labelWidth: '80px',
          width: '250px',
          label: '备注',
          rowHeight: '40px',
          required: false,
        },
        {
          columns: [
            {
              name: 'submitButton',
              type: 'button',
              text: '提交',
              width: '60px',
              columnWidth: '50%',
              align: 'right',
            },
            {
              name: 'cancelButton',
              type: 'button',
              text: '取消',
              width: '60px',
              columnWidth: '50%',
            },
          ],
        },
      ],
    }
  },
  mounted() {
    const suppliesInstance = this.$refs.myForm.getComponentByName('supplies')
    this.suppliesInstance = suppliesInstance

    const dateInstance = this.$refs.myForm.getComponentByName('date')
    this.dateInstance = dateInstance

    const quantityInstance = this.$refs.myForm.getComponentByName('quantity')
    this.quantityInstance = quantityInstance

    const unitPriceInstance = this.$refs.myForm.getComponentByName('unitPrice')
    this.unitPriceInstance = unitPriceInstance

    const purchaserInstance = this.$refs.myForm.getComponentByName('purchaser')
    this.purchaserInstance = purchaserInstance

    const remarkInstance = this.$refs.myForm.getComponentByName('remark')
    this.remarkInstance = remarkInstance

    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: suppliesInstance,
        message: '该项必选',
        action: 'select',
        rule: function () {
          const selectedIndex = suppliesInstance.jqxComboBox('getSelectedIndex')
          return selectedIndex > -1
        },
      },
      {
        input: purchaserInstance,
        message: '该项必选',
        action: 'select',
        rule: function () {
          const selectedIndex = purchaserInstance.jqxComboBox(
            'getSelectedIndex'
          )
          return selectedIndex > -1
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
      this.$refs.myWindow.setTitle(params[0])
      if (EDIT_SUPPLIES_PURCHASE == params[0]) {
        const rowData = params[1]
        this.suppliesInstance.jqxComboBox(`selectItem`, rowData['supplies_id'])
        this.dateInstance.jqxDateTimeInput(
          `setDate`,
          new Date(rowData['purchase_date'])
        )
        this.quantityInstance.jqxNumberInput(
          `setDecimal`,
          rowData['purchase_quantity']
        )
        this.unitPriceInstance.jqxNumberInput(
          `setDecimal`,
          rowData['purchase_unit_price']
        )
        this.purchaserInstance.jqxComboBox(`selectItem`, rowData['purchaser'])
        this.remarkInstance.val(rowData['remark'])
        this.id = rowData['id']
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess() {
      const title = this.$refs.myWindow.title
      const formData = {}
      formData['suppliesId'] = this.suppliesInstance.val()
      formData['purchaseDate'] = this.dateInstance.val()
      formData['purchaseQuantity'] = this.quantityInstance.val()
      formData['purchaseUnitPrice'] = this.unitPriceInstance.val()
      formData['purchaser'] = this.purchaserInstance.val()
      formData['remark'] = this.remarkInstance.val()
      formData['purchaseId'] = this.id

      console.log(formData)

      if (EDIT_SUPPLIES_PURCHASE == title) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addPurchase(params).then(() => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updatePurchase(params).then(() => {
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