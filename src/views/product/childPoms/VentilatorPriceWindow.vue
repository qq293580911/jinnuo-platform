<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :autoOpen="false"
      :position="{ x: '40%', y: '30%' }"
    >
      <div style="overflow: hidden;">
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

import { Message, EDIT_PRODUCT_PRICE } from 'common/const.js'
import {
  getAllVentilator,
  addVentilatorPrice,
  updateVentilatorPrice,
} from '@/network/product.js'
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
          name: 'product',
          type: 'custom',
          label: '产品',
          labelWidth: '80px',
          width: '250px',
          required: true,
          rowHeight: '40px',
          init(component) {
            getAllVentilator().then((res) => {
              res.map((item) => {
                item['html'] =
                  `<div tabIndex=0 style='padding: 1px;'>` +
                  `<div>名称：${item['name']}</div>` +
                  `<div>规格：${item['specification']}</div>` +
                  `<div>面板材质：${item['panel_material']}</div>` +
                  `<div>开孔尺寸：${item['hole_size']}</div><div>`
                item['group'] = item['pc_name']
                return item
              })
              jqwidgets.createInstance(component, 'jqxComboBox', {
                width: 250,
                height: 30,
                source: res,
                displayMember: 'name',
                valueMember: 'id',
                animationType: 'none',
              })
            })
          },
        },
        {
          name: 'pricePlan',
          type: 'custom',
          label: '价格方案',
          labelWidth: '80px',
          width: '250px',
          required: true,
          rowHeight: '40px',
          init(component) {
            const pricePlan = that.$store.state.pricePlan
            jqwidgets.createInstance(component, 'jqxComboBox', {
              width: 250,
              height: 30,
              source: pricePlan,
              displayMember: 'rule',
              valueMember: 'id',
            })
          },
        },
        {
          name: 'price',
          label: '价格',
          type: 'custom',
          labelWidth: '80px',
          required: false,
          rowHeight: '40px',
          init: function (component) {
            that.priceInstance = jqwidgets.createInstance(
              component,
              'jqxNumberInput',
              {
                width: 250,
                height: 30,
                inputMode: 'simple',
                decimalDigits: 0,
                spinButtons: true,
              }
            )
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
    const that = this
    // 获取组件对象
    const $product = this.$refs.myForm.getComponentByName('product')
    const $pricePlan = this.$refs.myForm.getComponentByName('pricePlan')
    const $price = this.$refs.myForm.getComponentByName('price')

    this.productInstance = $product
    this.pricePlanInstance = $pricePlan
    this.priceInstance = $price

    this.$refs.myValidator.rules = [
      {
        input: $product,
        message: '该项必选',
        action: 'select',
        rule: function () {
          var index = $product.jqxComboBox('getSelectedIndex')
          return index > -1
        },
      },
      {
        input: $pricePlan,
        message: '该项必选',
        action: 'select',
        rule: function () {
          var index = $pricePlan.jqxComboBox('getSelectedIndex')
          return index > -1
        },
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
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      if (params[0] == EDIT_PRODUCT_PRICE) {
        const rowData = params[1]
        console.log(rowData)
        this.productInstance.jqxComboBox('selectItem', rowData['vent_id'])
        this.pricePlanInstance.jqxComboBox('selectItem',rowData['plan_id'])
        this.priceInstance.jqxNumberInput('setDecimal', rowData['price'])
        this.id = rowData['id']
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const formData = {
        ventId: this.productInstance.jqxComboBox('getSelectedItem').value,
        planId: this.pricePlanInstance.val(),
        price: this.priceInstance.val(),
        id: this.id,
      }
      const title = this.$refs.myWindow.title
      if (title == EDIT_PRODUCT_PRICE) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams:JSON.stringify(formData)
      }
      addVentilatorPrice(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    update(formData) {
       const params = {
        jsonParams:JSON.stringify(formData)
      }
      updateVentilatorPrice(params).then((res) => {
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