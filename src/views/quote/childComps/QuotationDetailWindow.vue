<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'750px'"
      :height="'610px'"
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

import { debounce, getProvince, getCity, getArea } from '@/common/util.js'

import { ADD_QUOTATION } from '@/common/const.js'
import { queryDuplicate, addQuotationAndDetail } from '@/network/quote.js'
export default {
  name: 'QuotationDetailWindow',
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
          type: 'label',
          label: '基本信息',
        },
        {
          columns: [
            {
              name: 'projectName',
              type: 'text',
              label: '项目名称',
              labelWidth: '110px',
              width: '250px',
              required: true,
              columnWidth: '50%',
            },
            {
              name: 'projectAddress',
              type: 'text',
              label: '项目地址',
              labelWidth: '110px',
              width: '250px',
              required: true,
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'quoter',
              type: 'custom',
              label: '报价人',
              labelWidth: '110px',
              required: true,
              columnWidth: '50%',
              init: (component) => {
                const quoters = that.$store.state.quoters
                jqwidgets.createInstance(component, 'jqxComboBox', {
                  source: quoters,
                  width: 250,
                  height: 30,
                  displayMember: 'emp_name',
                  valueMember: 'emp_id',
                })
              },
            },
            {
              name: 'salesman',
              type: 'custom',
              label: '业务员',
              labelWidth: '110px',
              required: true,
              columnWidth: '50%',
              init: (component) => {
                const salesmans = that.$store.state.salesmans
                jqwidgets.createInstance(component, 'jqxComboBox', {
                  source: salesmans,
                  width: 250,
                  height: 30,
                  displayMember: 'emp_name',
                  valueMember: 'emp_id',
                })
              },
            },
          ],
        },
        {
          columns: [
            {
              name: 'province',
              type: 'custom',
              label: '省',
              labelWidth: '110px',
              required: true,
              columnWidth: '50%',
              init: (component) => {
                const provinceSelector = jqwidgets.createInstance(
                  component,
                  'jqxComboBox',
                  {
                    source: getProvince(),
                    width: 250,
                    height: 30,
                    displayMember: 'name',
                    valueMember: 'name',
                  }
                )
                // 省份绑定选择事件
                provinceSelector.addEventHandler('select', (event) => {
                  if (event.args.item) {
                    const provinceValue = event.args.item.originalItem.province
                    // 当选择省份的时候，更新城市的数据
                    const $city = that.$refs.myForm.getComponentByName('city')
                    jqwidgets.createInstance($city, 'jqxComboBox', {
                      source: getCity(provinceValue),
                    })
                    // 重置县/区为空
                    const $county = that.$refs.myForm.getComponentByName(
                      'county'
                    )
                    jqwidgets.createInstance($county, 'jqxComboBox', {
                      source: [],
                    })
                  }
                })
              },
            },
            {
              name: 'customer',
              type: 'text',
              label: '客户名称',
              labelWidth: '110px',
              width: '250px',
              required: false,
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'city',
              type: 'custom',
              label: '市',
              labelWidth: '110px',
              required: true,
              columnWidth: '50%',
              init: (component) => {
                const citySelector = jqwidgets.createInstance(
                  component,
                  'jqxComboBox',
                  {
                    source: [],
                    width: 250,
                    height: 30,
                    displayMember: 'name',
                    valueMember: 'name',
                  }
                )
                const $province = that.$refs.myForm.getComponentByName(
                  'province'
                )
                citySelector.addEventHandler('select', (event) => {
                  if (event.args.item) {
                    const provinceValue = $province.jqxComboBox(
                      'getSelectedItem'
                    ).originalItem.province
                    const cityValue = event.args.item.originalItem.city
                    const cityLabel = event.args.value
                    // 更新县镇的数据
                    const $county = that.$refs.myForm.getComponentByName(
                      'county'
                    )
                    jqwidgets.createInstance($county, 'jqxComboBox', {
                      source: getArea(provinceValue, cityValue,cityLabel),
                    })
                  }
                })
              },
            },
            {
              name: 'customerPhone',
              type: 'text',
              label: '客户电话',
              labelWidth: '110px',
              width: '250px',
              required: false,
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'county',
              type: 'custom',
              label: '县',
              labelWidth: '110px',
              required: false,
              columnWidth: '50%',
              init: function (component) {
                jqwidgets.createInstance(component, 'jqxComboBox', {
                  width: 250,
                  height: 30,
                  source: [],
                  displayMember: 'name',
                  valueMember: 'name',
                })
              },
            },
            {
              name: 'customerCompany',
              type: 'text',
              label: '客户公司',
              labelWidth: '110px',
              width: '250px',
              required: false,
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'priceModel',
              type: 'custom',
              label: '价格体系',
              labelWidth: '110px',
              required: true,
              columnWidth: '50%',
              init: (component) => {
                const pricePlan = that.$store.state.pricePlan
                jqwidgets.createInstance(component, 'jqxComboBox', {
                  source: pricePlan,
                  displayMember: 'rule',
                  valueMember: 'id',
                  width: 250,
                  height: 30,
                })
              },
            },
            {
              name: 'isRepeat',
              type: 'dropdownlist',
              label: '是否重复',
              labelWidth: '110px',
              width: 250,
              required: true,
              columnWidth: '50%',
              options: ['常规', '重复'],
            },
          ],
        },
        {
          columns: [
            {
              name: 'regionTax',
              type: 'text',
              label: '地区点',
              labelWidth: '110px',
              width: '250px',
              required: false,
              columnWidth: '50%',
            },
            {
              name: 'brokerage',
              type: 'text',
              label: '佣金',
              labelWidth: '110px',
              width: '250px',
              required: false,
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'freight',
              type: 'text',
              label: '运费',
              labelWidth: '110px',
              width: '250px',
              required: false,
              columnWidth: '50%',
            },
            {
              name: 'tax',
              type: 'text',
              label: '税金',
              labelWidth: '110px',
              width: '250px',
              required: false,
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'reservePrice',
              type: 'custom',
              label: '底价',
              labelWidth: '110px',
              required: false,
              columnWidth: '50%',
              init: function (component) {
                jqwidgets.createInstance(component, 'jqxNumberInput', {
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
              name: 'quotePrice',
              type: 'custom',
              label: '报价',
              labelWidth: '110px',
              required: false,
              columnWidth: '50%',
              init: function (component) {
                jqwidgets.createInstance(component, 'jqxNumberInput', {
                  width: 250,
                  height: 30,
                  inputMode: 'simple',
                  digits: 11,
                  spinButtons: true,
                  decimalDigits: 0,
                })
              },
            },
          ],
        },
        {
          columns: [
            {
              name: 'remark',
              type: 'text',
              label: '备注',
              labelWidth: '110px',
              width: '250px',
              required: false,
              columnWidth: '50%',
            },
            {
              name: 'quoteDate',
              type: 'custom',
              label: '报价日期',
              labelWidth: '110px',
              required: false,
              columnWidth: '50%',
              init: function (component) {
                jqwidgets.createInstance(component, 'jqxDateTimeInput', {
                  width: 250,
                  height: 30,
                  culture: 'zh-CN',
                  formatString: 'yyyy-MM-dd',
                })
              },
            },
          ],
        },
        {
          type: 'blank',
          height: '20px',
        },
        {
          type: 'label',
          label: '控制箱信息',
        },
        {
          columns: [
            {
              name: 'controlBoxReservePrice',
              type: 'custom',
              label: '控制箱底价',
              labelWidth: '110px',
              required: false,
              columnWidth: '50%',
              init: function (component) {
                jqwidgets.createInstance(component, 'jqxNumberInput', {
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
              name: 'controlBoxQuotePrice',
              type: 'custom',
              label: '控制箱报价',
              labelWidth: '110px',
              required: false,
              columnWidth: '50%',
              init: function (component) {
                jqwidgets.createInstance(component, 'jqxNumberInput', {
                  width: 250,
                  height: 30,
                  inputMode: 'simple',
                  digits: 11,
                  spinButtons: true,
                  decimalDigits: 0,
                })
              },
            },
          ],
        },
        {
          columns: [
            {
              name: 'submitButton',
              type: 'custom',
              rowHeight: '50px',
              align: 'right',
              columnWidth: '50%',
              init: function (component) {
                jqwidgets.createInstance(component[0], 'jqxButton', {
                  width: 60,
                  height: 30,
                  value: '提交',
                })
              },
            },
            {
              name: 'cancelButton',
              type: 'custom',
              rowHeight: '50px',
              columnWidth: '50%',
              init: function (component) {
                jqwidgets.createInstance(component[0], 'jqxButton', {
                  width: 60,
                  height: 30,
                  value: '取消',
                })
              },
            },
          ],
        },
      ],
    }
  },
  mounted() {
    const that = this
    const $projectName = this.$refs.myForm.getComponentByName('projectName')
    const $projectAddress = this.$refs.myForm.getComponentByName(
      'projectAddress'
    )
    const $quoter = this.$refs.myForm.getComponentByName('quoter')
    const $salesman = this.$refs.myForm.getComponentByName('salesman')
    const $province = this.$refs.myForm.getComponentByName('province')
    const $city = this.$refs.myForm.getComponentByName('city')
    const $county = this.$refs.myForm.getComponentByName('county')
    const $customer = this.$refs.myForm.getComponentByName('customer')
    const $customerPhone = this.$refs.myForm.getComponentByName('customerPhone')
    const $customerCompany = this.$refs.myForm.getComponentByName(
      'customerCompany'
    )
    const $priceModel = this.$refs.myForm.getComponentByName('priceModel')
    const $isRepeat = this.$refs.myForm.getComponentByName('isRepeat')
    const $regionTax = this.$refs.myForm.getComponentByName('regionTax')
    const $brokerage = this.$refs.myForm.getComponentByName('brokerage')
    const $freight = this.$refs.myForm.getComponentByName('freight')
    const $tax = this.$refs.myForm.getComponentByName('tax')
    const $reservePrice = this.$refs.myForm.getComponentByName('reservePrice')
    const $quotePrice = this.$refs.myForm.getComponentByName('quotePrice')
    const $remark = this.$refs.myForm.getComponentByName('remark')
    const $quoteDate = this.$refs.myForm.getComponentByName('quoteDate')
    const $controlBoxReservePrice = this.$refs.myForm.getComponentByName(
      'controlBoxReservePrice'
    )
    const $controlBoxQuotePrice = this.$refs.myForm.getComponentByName(
      'controlBoxQuotePrice'
    )

    // 根据项目名称和业务员判断报价是否重复
    $projectName.on(
      'input',
      debounce((event) => {
        that.queryDuplicate()
      }, 1000)
    )

    $salesman.on('select', (event) => {
      that.queryDuplicate()
    })

    this.projectNameInstance = $projectName
    this.projectAddressInstance = $projectAddress
    this.quoterInstance = $quoter
    this.salesmanInstance = $salesman
    this.provinceInstance = $province
    this.cityInstance = $city
    this.countyInstance = $county
    this.customerInstance = $customer
    this.customerPhoneInstance = $customerPhone
    this.customerCompanyInstance = $customerCompany
    this.priceModelInstance = $priceModel
    this.isRepeatInstance = $isRepeat
    this.regionTaxInstance = $regionTax
    this.brokerageInstance = $brokerage
    this.freightInstance = $freight
    this.taxInstance = $tax
    this.reservePriceInstance = $reservePrice
    this.quotePriceInstance = $quotePrice
    this.remarkInstance = $remark
    this.quoteDateInstance = $quoteDate
    this.controlBoxReservePriceInstance = $controlBoxReservePrice
    this.controlBoxQuotePriceInstance = $controlBoxQuotePrice

    this.$refs.myValidator.rules = [
      {
        input: $projectName,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $quoter,
        message: '该项必选',
        action: 'select',
        rule: () => {
          const selectIndex = $quoter.jqxComboBox('getSelectedIndex')
          return selectIndex > -1
        },
      },
      {
        input: $salesman,
        message: '该项必选!',
        action: 'change',
        rule: () => {
          const selectIndex = $salesman.jqxComboBox('getSelectedIndex')
          return selectIndex > -1
        },
      },
      {
        input: $priceModel,
        action: 'select',
        message: '该项必选!',
        rule: () => {
          const selectIndex = $priceModel.jqxComboBox('getSelectedIndex')
          return selectIndex > -1
        },
      },
      {
        input: $isRepeat,
        message: '该项必选!',
        rule: () => {
          const selectIndex = $isRepeat.jqxDropDownList('getSelectedIndex')
          return selectIndex > -1
        },
      },
      {
        input: $province,
        action: 'change',
        message: '该项必选!',
        rule: () => {
          const selectIndex = $province.jqxComboBox('getSelectedIndex')
          return selectIndex > -1
        },
      },
      {
        input: $city,
        action: 'change',
        message: '该项必选!',
        rule: () => {
          const selectIndex = $city.jqxComboBox('getSelectedIndex')
          return selectIndex > -1
        },
      },
      {
        input: $customer,
        message: '不能为空!',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $customer,
        message: '只能为中文!',
        action: 'keyup, blur',
        rule: 'notNumber',
      },
      {
        input: $customerPhone,
        message: '不正确的手机格式!',
        action: 'keyup, blur',
        rule: () => {
          const phone = $customerPhone.val()
          const reg = /^(1[3456789]\d{9})?$/
          return reg.test(phone)
        },
      },
      {
        input: $quoteDate,
        message: '你选择的日期不合理',
        action: 'valueChanged',
        rule: () => {
          const quoteDate = $quoteDate.val()
          return new Date(quoteDate) <= new Date()
        },
      },
    ]

    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName('submitButton')
    confirmBtn[0].addEventListener('click', (event) => {
      this.$refs.myValidator.validate(document.getElementById('myForm'))
    })

    this.$bus.$off('openDetailWindow').$on('openDetailWindow', (...params) => {
      this.$refs.myWindow.setTitle(ADD_QUOTATION)
      const data = params[0]
      $projectName.val(data['projectName'])
      $projectAddress.val(data['projectAddress'])
      $quoter.jqxComboBox('selectItem', data['quotor'])
      $salesman.jqxComboBox('selectItem', data['salesman'])
      $customerCompany.val(data['customerCompany'])
      $customer.val(data['customer'])
      $customerPhone.val(data['customerPhone'])
      $isRepeat.jqxDropDownList('selectItem', data['isRepeat'])
      $reservePrice.jqxNumberInput('setDecimal', data['reservePrice'])
      $quotePrice.jqxNumberInput('setDecimal', data['quotePrice'])
      $quoteDate.jqxDateTimeInput('setDate', new Date(data['quoteDate']))
      $controlBoxReservePrice.jqxNumberInput(
        'setDecimal',
        data['controlBoxReservePrice']
      )
      $controlBoxQuotePrice.jqxNumberInput(
        'setDecimal',
        data['controlBoxQuotePrice']
      )
      // 文件
      this.reservePriceFile = params[1]
      this.quotePriceFile = params[2]
      this.$refs.myWindow.open()
    })
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0])
      this.$refs.myWindow.open()
    },
    onValidationSuccess() {
      const that = this
      const formData = {}
      formData.projectName = this.projectNameInstance.val()
      formData.projectAddress = this.projectAddressInstance.val()
      formData.quoter = this.quoterInstance.val()
      formData.salesman = this.salesmanInstance.val()
      formData.province = this.provinceInstance.val()
      formData.city = this.cityInstance.val()
      formData.county = this.countyInstance.val()
      formData.customerName = this.customerInstance.val()
      formData.customerPhone = this.customerPhoneInstance.val()
      formData.customerCompany = this.customerCompanyInstance.val()
      formData.formulaModel = this.priceModelInstance.jqxComboBox(
        'getSelectedItem'
      ).label
      formData.isRepeat = this.isRepeatInstance.jqxDropDownList(
        'getSelectedItem'
      ).label
      formData.regionTax = this.regionTaxInstance.val()
      formData.brokerage = this.brokerageInstance.val()
      formData.freight = this.freightInstance.val()
      formData.tax = this.taxInstance.val()
      formData.reservePrice = this.reservePriceInstance.val()
      formData.quotePrice = this.quotePriceInstance.val()
      formData.remark = this.remarkInstance.val()
      formData.quoteDate = this.quoteDateInstance.val()
      formData.controlBoxReservePrice = this.controlBoxReservePriceInstance.val()
      formData.controlBoxQuotePrice = this.controlBoxQuotePriceInstance.val()

      const form = new FormData()
      form.append('jsonParams', JSON.stringify(formData))
      form.append('files', that.reservePriceFile)
      form.append('files', that.quotePriceFile)
      // 执行添加
      this.add(form)
    },
    add(form) {
      addQuotationAndDetail(form).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.render()
        this.clearForm()
      })
    },
    clearForm() {
      this.projectNameInstance.val('')
      this.projectAddressInstance.val('')
      this.quoterInstance.jqxComboBox('clearSelection')
      this.salesmanInstance.jqxComboBox('clearSelection')
      this.provinceInstance.jqxComboBox('clearSelection')
      this.cityInstance.jqxComboBox('clearSelection')
      this.countyInstance.jqxComboBox('clearSelection')
      this.customerInstance.val('')
      this.customerPhoneInstance.val('')
      this.customerCompanyInstance.val('')
      this.priceModelInstance.jqxComboBox('clearSelection')
      this.isRepeatInstance.jqxComboBox('clearSelection')
      this.regionTaxInstance.val('')
      this.brokerageInstance.val('')
      this.freightInstance.val('')
      this.taxInstance.val('')
      this.reservePriceInstance.jqxNumberInput('setDecimal', 0)
      this.quotePriceInstance.jqxNumberInput('setDecimal', 0)
      this.remarkInstance.val('')
      this.quoteDateInstance.jqxDateTimeInput('setDate', new Date())
      this.controlBoxReservePriceInstance.jqxNumberInput('setDecimal', 0)
      this.controlBoxQuotePriceInstance.jqxNumberInput('setDecimal', 0)
    },
    queryDuplicate() {
      const projectName = this.projectNameInstance.val()
      const salesman = this.salesmanInstance.val()
      const params = {
        jsonParams: JSON.stringify({
          projectName,
          salesman,
        }),
      }
      queryDuplicate(params).then((res) => {
        this.isRepeatInstance.jqxDropDownList('selectItem', res['repeat'])
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
