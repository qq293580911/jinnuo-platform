<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'760px'"
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
import { getProvince, getCity, getArea } from '@/common/util.js'
import { EDIT_CONTRACT } from '@/common/const'
import {
  checkDuplicate,
  addContract,
  updateContract,
} from '@/network/contract.js'
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
  },
  data() {
    const that = this
    return {
      province: {},
      city: {},
      area: {},
      template: [
        {
          columns: [
            {
              name: 'projectName',
              type: 'text',
              label: '项目名称',
              labelWidth: '100px',
              width: '250px',
              required: true,
              rowHeight: '40px',
              columnWidth: '50%',
            },
            {
              name: 'contractNumber',
              type: 'text',
              label: '合同编号',
              labelWidth: '100px',
              width: '250px',
              required: true,
              rowHeight: '40px',
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'createDate',
              type: 'custom',
              label: '创建日期',
              labelWidth: '100px',
              required: true,
              rowHeight: '40px',
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
            {
              name: 'isRepeat',
              type: 'dropdownlist',
              label: '是否重复',
              labelWidth: '100px',
              width: '250px',
              required: true,
              rowHeight: '40px',
              columnWidth: '50%',
              options: [
                { label: '常规', value: 0 },
                { label: '重复', value: 1 },
              ],
            },
          ],
        },
        {
          columns: [
            {
              name: 'salesman',
              type: 'custom',
              label: '业务员',
              labelWidth: '100px',
              required: true,
              rowHeight: '40px',
              columnWidth: '50%',
              init: (component) => {
                const salesmans = this.$store.state.salesmans
                component.jqxComboBox({
                  source: salesmans,
                  width: 250,
                  height: 30,
                  displayMember: 'emp_name',
                  valueMember: 'emp_id',
                })
              },
            },
            {
              name: 'customerCompany',
              type: 'text',
              label: '客户公司',
              labelWidth: '100px',
              width: '250px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'province',
              type: 'custom',
              label: '省',
              labelWidth: '100px',
              required: true,
              rowHeight: '40px',
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
              name: 'signDate',
              type: 'text',
              label: '签订日期',
              labelWidth: '100px',
              width: '250px',
              required: false,
              rowHeight: '40px',
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
              labelWidth: '100px',
              required: true,
              rowHeight: '40px',
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
                    const cityLabel = event.args.item.value
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
              name: 'signState',
              type: 'dropdownlist',
              label: '签订状态',
              labelWidth: '100px',
              width: '250px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
              options: [
                { value: '未签' },
                { value: '已签' },
                { value: '作废' },
              ],
            },
          ],
        },
        {
          columns: [
            {
              name: 'county',
              type: 'custom',
              label: '县',
              labelWidth: '100px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
              init: (component) => {
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
              name: 'signBackDate',
              type: 'text',
              label: '签回日期',
              labelWidth: '100px',
              width: '250px',
              required: false,
              rowHeight: '40px',
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
              labelWidth: '100px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
              init: (component) => {
                component.jqxNumberInput({
                  width: 250,
                  height: 30,
                  inputMode: 'simple',
                  digits: 11,
                  spinButtons: true,
                  min: 0,
                  decimalDigits: 0,
                })
              },
            },
            {
              name: 'discountPrice',
              type: 'custom',
              label: '优惠价格',
              labelWidth: '100px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
              init: (component) => {
                component.jqxNumberInput({
                  width: 250,
                  height: 30,
                  inputMode: 'simple',
                  digits: 11,
                  spinButtons: true,
                  min: 0,
                  decimalDigits: 0,
                })
              },
            },
          ],
        },
        {
          columns: [
            {
              name: 'originalPrice',
              type: 'custom',
              label: '报价',
              labelWidth: '100px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
              init: (component) => {
                component.jqxNumberInput({
                  width: 250,
                  height: 30,
                  inputMode: 'simple',
                  digits: 11,
                  spinButtons: true,
                  min: 0,
                  decimalDigits: 0,
                })
              },
            },
            {
              name: 'finalPrice',
              type: 'custom',
              label: '成交价',
              labelWidth: '100px',
              required: true,
              rowHeight: '40px',
              columnWidth: '50%',
              init: (component) => {
                component.jqxNumberInput({
                  width: 250,
                  height: 30,
                  inputMode: 'simple',
                  digits: 11,
                  spinButtons: true,
                  min: 0,
                  decimalDigits: 3,
                })
              },
            },
          ],
        },
        {
          columns: [
            {
              name: 'logisticsManagementFee',
              type: 'text',
              label: '物流管理费',
              labelWidth: '100px',
              width: 250,
              height: 30,
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
            },
            {
              name: 'freight',
              type: 'text',
              label: '运费',
              labelWidth: '100px',
              width: 250,
              height: 30,
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'tax',
              type: 'text',
              label: '税金',
              labelWidth: '100px',
              width: 250,
              height: 30,
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
            },
            {
              name: 'warranty',
              type: 'text',
              label: '质保金',
              labelWidth: '100px',
              width: 250,
              height: 30,
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'installFee',
              type: 'custom',
              label: '安装费',
              labelWidth: '100px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
              init(componnet) {
                componnet.jqxNumberInput({
                  width: 250,
                  height: 30,
                  inputMode: 'simple',
                  decimalDigits: 0,
                  digits: 11,
                  spinButtons: true,
                  min: 0,
                })
              },
            },
          ],
        },
        {
          columns: [
            {
              name: 'deductionBonusAmount',
              type: 'custom',
              label: '非3C阀门风口',
              labelWidth: '100px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
              init: (component) => {
                component.jqxNumberInput({
                  width: 250,
                  height: 30,
                  inputMode: 'simple',
                  decimalDigits: 4,
                  digits: 11,
                  spinButtons: true,
                  min: 0,
                })
              },
            },
            {
              name: 'performanceBonusReimbursement',
              type: 'text',
              label: '业绩奖金报销',
              labelWidth: '100px',
              width: '250px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
            },
          ],
        },
        {
          columns: [
            {
              name: 'formulaModel',
              type: 'custom',
              label: '公式类型',
              labelWidth: '100px',
              required: false,
              rowHeight: '40px',
              init: (component) => {
                const pricePlans = this.$store.state.pricePlan
                component.jqxComboBox({
                  source: pricePlans,
                  width: 623,
                  height: 30,
                  displayMember: 'rule',
                  valueMember: 'rule',
                  multiSelect: true,
                })
              },
            },
          ],
        },
        {
          columns: [
            {
              name: 'riseDropPoint',
              type: 'text',
              label: '降点情况',
              labelWidth: '100px',
              width: '250px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
            },
            {
              name: 'overBudgetBear',
              type: 'text',
              label: '超点承担',
              labelWidth: '100px',
              width: '250px',
              required: false,
              rowHeight: '40px',
              columnWidth: '50%',
            },
          ],
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
        {
          name: 'contrDtlId',
          type: 'custom',
          init: function (component) {
            component.append('<input id="contrDtlId" type="hidden"/>')
          },
        },
      ],
    }
  },
  mounted() {
    const $projectName = this.$refs.myForm.getComponentByName('projectName')
    const $contractNumber = this.$refs.myForm.getComponentByName(
      'contractNumber'
    )
    const $createDate = this.$refs.myForm.getComponentByName('createDate')
    const $isRepeat = this.$refs.myForm.getComponentByName('isRepeat')
    const $salesman = this.$refs.myForm.getComponentByName('salesman')
    const $customerCompany = this.$refs.myForm.getComponentByName(
      'customerCompany'
    )
    const $province = this.$refs.myForm.getComponentByName('province')
    const $city = this.$refs.myForm.getComponentByName('city')
    const $county = this.$refs.myForm.getComponentByName('county')
    const $signDate = this.$refs.myForm.getComponentByName('signDate')
    const $signState = this.$refs.myForm.getComponentByName('signState')
    const $signBackDate = this.$refs.myForm.getComponentByName('signBackDate')
    const $reservePrice = this.$refs.myForm.getComponentByName('reservePrice')
    const $originalPrice = this.$refs.myForm.getComponentByName('originalPrice')
    const $discountPrice = this.$refs.myForm.getComponentByName('discountPrice')
    const $finalPrice = this.$refs.myForm.getComponentByName('finalPrice')
    const $logisticsManagementFee = this.$refs.myForm.getComponentByName(
      'logisticsManagementFee'
    )
    const $freight = this.$refs.myForm.getComponentByName('freight')
    const $tax = this.$refs.myForm.getComponentByName('tax')
    const $warranty = this.$refs.myForm.getComponentByName('warranty')
    const $installFee = this.$refs.myForm.getComponentByName('installFee')
    const $deductionBonusAmount = this.$refs.myForm.getComponentByName(
      'deductionBonusAmount'
    )
    const $performanceBonusReimbursement = this.$refs.myForm.getComponentByName(
      'performanceBonusReimbursement'
    )
    const $formulaModel = this.$refs.myForm.getComponentByName('formulaModel')
    const $riseDropPoint = this.$refs.myForm.getComponentByName('riseDropPoint')
    const $overBudgetBear = this.$refs.myForm.getComponentByName(
      'overBudgetBear'
    )

    this.projectNameInstance = $projectName
    this.contractNumberInstance = $contractNumber
    this.createDateInstance = $createDate
    this.isRepeatInstance = $isRepeat
    this.salesmanInstance = $salesman
    this.customerCompanyInstance = $customerCompany
    this.provinceInstance = $province
    this.cityInstance = $city
    this.countyInstance = $county
    this.signDateInstance = $signDate
    this.signStateInstance = $signState
    this.signBackDateInstance = $signBackDate
    this.reservePriceInstance = $reservePrice
    this.originalPriceInstance = $originalPrice
    this.discountPriceInstance = $discountPrice
    this.finalPriceInstance = $finalPrice
    this.logisticsManagementFeeInstance = $logisticsManagementFee
    this.freightInstance = $freight
    this.taxInstance = $tax
    this.warrantyInstance = $warranty
    this.installFeeInstance = $installFee
    this.deductionBonusAmountInstance = $deductionBonusAmount
    this.performanceBonusReimbursementInstance = $performanceBonusReimbursement
    this.formulaModelInstance = $formulaModel
    this.riseDropPointInstance = $riseDropPoint
    this.overBudgetBearInstance = $overBudgetBear

    this.projectNameInstance.on('blur', (event) => {
      const projectName = event.target.value
      const params = {
        jsonParams: JSON.stringify({
          projectName,
        }),
      }
      checkDuplicate(params).then((res) => {
        this.isRepeatInstance.jqxDropDownList('selectItem', res['is_repeat'])
      })
    })

    // 验证规则
    this.$refs.myValidator.rules = [
      {
        input: $projectName,
        message: '不能为空',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $contractNumber,
        message: '不能为空',
        action: 'keyup, blur',
        rule: 'required',
      },
      {
        input: $isRepeat,
        action: 'change',
        message: '该项必选',
        rule: function () {
          const index = $isRepeat.jqxDropDownList('getSelectedIndex')
          return index > -1
        },
      },
      {
        input: $salesman,
        action: 'change',
        message: '该项必选',
        rule: function () {
          const index = $salesman.jqxComboBox('getSelectedIndex')
          return index > -1
        },
      },
      {
        input: $province,
        action: 'change',
        message: '该项必选!',
        rule: function () {
          const index = $province.jqxComboBox('getSelectedIndex')
          return index > -1
        },
      },
      {
        input: $city,
        action: 'change',
        message: '该项必选',
        rule: function () {
          const index = $city.jqxComboBox('getSelectedIndex')
          return index > -1
        },
      },
      {
        input: $signState,
        action: 'change',
        message: '该项必选',
        rule: function () {
          const index = $signState.jqxDropDownList('getSelectedIndex')
          return index > -1
        },
      },
      {
        input: $signDate,
        action: 'keyup, blur',
        message: '不正确的日期格式',
        rule: function () {
          const value = $signDate.val()
          if (value == '' || value == null) {
            return true
          }
          const r = value.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/)
          return r != null
        },
      },
      {
        input: $logisticsManagementFee,
        action: 'keyup,blur',
        message: '不正确的格式',
        rule: function () {
          const value = $logisticsManagementFee.val()
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value)
            return r
          }
          return true
        },
      },
      {
        input: $tax,
        action: 'keyup,blur',
        message: '不正确的格式',
        rule: function () {
          const value = $tax.val()
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value)
            return r
          }
          return true
        },
      },
      {
        input: $warranty,
        action: 'keyup,blur',
        message: '不正确的格式',
        rule: function () {
          const value = $warranty.val()
          if (value.length > 0) {
            const r = /^[0-9]*$|^(100|[1-9]\d|\d)(.\d{1,4})?%$/.test(value)
            return r
          }
          return true
        },
      },
      {
        input: $formulaModel,
        action: 'select',
        message: '该项必选',
        rule: function () {
          const index = $formulaModel.jqxComboBox('getSelectedIndex')
          return index > -1
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
      if (params[0] == EDIT_CONTRACT) {
        const that = this
        const data = params[1]
        this.createDateInstance.jqxDateTimeInput('setDate', data['create_date'])
        this.projectNameInstance.val(data['project_name'])
        this.isRepeatInstance.jqxDropDownList(
          'selectItem',
          data['is_repeat'] == '常规' ? 0 : 1
        )
        this.salesmanInstance.jqxComboBox('selectItem', data['salesman'])
        this.contractNumberInstance.val(data['contract_number'])
        this.customerCompanyInstance.val(data['customer_company'])
        this.provinceInstance.jqxComboBox('selectItem', data['province'])
        this.cityInstance.jqxComboBox('selectItem', data['city'])
        this.countyInstance.jqxComboBox('selectItem', data['county'])
        this.originalPriceInstance.jqxNumberInput(
          'setDecimal',
          data['original_price']
        )
        this.discountPriceInstance.jqxNumberInput(
          'setDecimal',
          data['discount_price']
        )
        this.finalPriceInstance.jqxNumberInput(
          'setDecimal',
          data['final_price']
        )
        this.reservePriceInstance.jqxNumberInput(
          'setDecimal',
          data['reserve_price']
        )
        this.logisticsManagementFeeInstance.val(
          data['logistics_management_fee']
        )
        this.freightInstance.val(data['freight'])
        this.taxInstance.val(data['tax'])
        this.warrantyInstance.val(data['warranty'])
        this.installFeeInstance.jqxNumberInput(
          'setDecimal',
          data['install_fee'] == null ? 0 : data['install_fee']
        )
        this.signStateInstance.jqxDropDownList(
          'selectItem',
          data['sign_status']
        )
        this.signDateInstance.val(data['sign_date'])
        this.signBackDateInstance.val(data['sign_back_date'])
        this.deductionBonusAmountInstance.val('')
        const formulaModel = data['formula_model']
        that.formulaModelInstance.jqxComboBox('clearSelection')
        setTimeout(() => {
          if (formulaModel.split(',').length > 1) {
            formulaModel.split(',').forEach(function (value) {
              that.formulaModelInstance.jqxComboBox('selectItem', value)
            })
          } else {
            that.formulaModelInstance.jqxComboBox('selectItem', formulaModel)
          }
        }, 100)

        this.riseDropPointInstance.val(data['rise_drop_point'])
        this.overBudgetBearInstance.val(data['over_budget_bear'])
        this.id = data['id']
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const that = this
      const formData = {}
      formData['createDate'] = this.createDateInstance.val()
      formData['projectName'] = this.projectNameInstance.val()
      formData['isRepeat'] = this.isRepeatInstance.val()
      formData['salesman'] = this.salesmanInstance.val()
      formData['contractNumber'] = this.contractNumberInstance.val()
      formData['customerCompany'] = this.customerCompanyInstance.val()
      formData['province'] = this.provinceInstance.jqxComboBox(
        'getSelectedItem'
      ).label
      formData['city'] = this.cityInstance.jqxComboBox('getSelectedItem').label
      const countyItem = this.countyInstance.jqxComboBox('getSelectedItem')
      if (countyItem) {
        formData['county'] = countyItem.label
      }
      formData['originalPrice'] = this.originalPriceInstance.val()
      formData['discountPrice'] = this.discountPriceInstance.val()
      formData['finalPrice'] = this.finalPriceInstance.val()
      formData['reservePrice'] = this.reservePriceInstance.val()
      formData[
        'logisticsManagementFee'
      ] = this.logisticsManagementFeeInstance.val()
      formData['freight'] = this.freightInstance.val()
      formData['tax'] = this.taxInstance.val()
      formData['warranty'] = this.warrantyInstance.val()
      formData['installFee'] = this.installFeeInstance.val()
      formData['signStatus'] = this.signStateInstance.val()
      formData['signDate'] = this.signDateInstance.val()
      formData['signBackDate'] = this.signBackDateInstance.val()
      formData['deductionBonusAmount'] = this.deductionBonusAmountInstance.val()
      formData['formulaModel'] = (function () {
        const items = that.formulaModelInstance.jqxComboBox('getSelectedItems')
        let selectedItems = ''
        items.forEach((item, index) => {
          selectedItems += item.label
          if (items.length - 1 != index) {
            selectedItems += ','
          }
        })
        return selectedItems
      })()
      formData[
        'performanceBonusReimbursement'
      ] = this.performanceBonusReimbursementInstance.val()
      formData['riseDropPoint'] = this.riseDropPointInstance.val()
      formData['overBudgetBear'] = this.overBudgetBearInstance.val()
      formData['id'] = this.id
      const title = this.$refs.myWindow.title
      if (title == EDIT_CONTRACT) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addContract(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
        this.clearForm()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateContract(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
        this.clearForm()
      })
    },
    clearForm() {
      this.createDateInstance.jqxDateTimeInput('setDate', new Date())
      this.projectNameInstance.val('')
      this.isRepeatInstance.jqxDropDownList('clearSelection')
      this.salesmanInstance.jqxComboBox('clearSelection')
      this.contractNumberInstance.val('')
      this.customerCompanyInstance.val('')
      this.provinceInstance.jqxComboBox('clearSelection')
      this.cityInstance.jqxComboBox('clearSelection')
      this.countyInstance.jqxComboBox('clearSelection')
      this.originalPriceInstance.jqxNumberInput('setDecimal', 0)
      this.discountPriceInstance.jqxNumberInput('setDecimal', 0)
      this.finalPriceInstance.jqxNumberInput('setDecimal', 0)
      this.reservePriceInstance.jqxNumberInput('setDecimal', 0)
      this.logisticsManagementFeeInstance.val('')
      this.freightInstance.val('')
      this.taxInstance.val('')
      this.warrantyInstance.val('')
      this.installFeeInstance.jqxNumberInput('setDecimal', 0)
      this.signStateInstance.jqxDropDownList('clearSelection')
      this.signDateInstance.val('')
      this.signBackDateInstance.val('')
      this.deductionBonusAmountInstance.val('')
      this.performanceBonusReimbursementInstance.val('')
      this.formulaModelInstance.jqxComboBox('clearSelection')
      this.riseDropPointInstance.val('')
      this.overBudgetBearInstance.val('')
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
}
</script>

<style scoped>
</style>
