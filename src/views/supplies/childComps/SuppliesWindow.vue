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
import JqxColorPicker from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxcolorpicker.vue'

import { Message, EDIT_SUPPLIES } from '@/common/const.js'
import {
  getAllSuppliesType,
  addSupplies,
  updateSupplies,
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
          name: 'suppliesName',
          type: 'text',
          labelWidth: '80px',
          label: '用品名称',
          width: '250px',
          rowHeight: '40px',
          required: true,
        },
        {
          name: 'suppliesType',
          type: 'custom',
          labelWidth: '80px',
          label: '用品类型',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            // 按钮
            const dropDownButtonContainer = document.createElement('div')
            dropDownButtonContainer.id = JQXLite.generateID()
            component[0].appendChild(dropDownButtonContainer)

            // 树
            const treeContainer = document.createElement('div')
            treeContainer.id = JQXLite.generateID()
            treeContainer.style.cssText = 'border: none;'
            dropDownButtonContainer.appendChild(treeContainer)

            that.treeButtonInstance = jqwidgets.createInstance(
              `#${dropDownButtonContainer.id}`,
              'jqxDropDownButton',
              {
                width: 250,
                height: 30,
              }
            )

            getAllSuppliesType().then((res) => {
              const source = {
                datafields: [
                  { name: 'id', type: 'number' },
                  { name: 'name', map: 'type_name', type: 'string' },
                  { name: 'parentId', map: 'parent_id', type: 'string' },
                ],
                localdata: res,
              }
              const dataAdapter = new jqx.dataAdapter(source)
              dataAdapter.dataBind()
              const records = dataAdapter.getRecordsHierarchy(
                'id',
                'parentId',
                'items',
                [
                  {
                    name: 'name',
                    map: 'label',
                  },
                ]
              )

              that.treeInstance = jqwidgets.createInstance(
                `#${treeContainer.id}`,
                'jqxTree',
                {
                  width: 250,
                  height: 300,
                  source: records,
                }
              )

              // 树绑定选择事件
              that.treeInstance.addEventHandler('select', (event) => {
                const selectedItem = that.treeInstance.getSelectedItem()
                // 不能选择包含儿子的节点
                if (selectedItem.hasItems) {
                  that.$message.warning(Message.UNSELECTABLE_NODE)
                  return false
                }
                // 设置文本内容到dorpDownButton
                const dropDownContent =
                  '<div style="position: relative; margin-left: 3px; line-height: 30px;">' +
                  selectedItem.label +
                  '</div>'
                that.treeButtonInstance.setContent(dropDownContent)
                that.treeButtonInstance.close()
              })
            })
          },
        },
        {
          name: 'specModel',
          type: 'text',
          labelWidth: '80px',
          label: '规格型号',
          width: '250px',
          rowHeight: '40px',
          required: false,
        },
        {
          name: 'unit',
          type: 'custom',
          labelWidth: '80px',
          label: '用品单位',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            component.jqxComboBox({
              source: [
                'KG',
                '把',
                '包',
                '本',
                '次',
                '袋',
                '顶',
                '对',
                '吨',
                '份',
                '付',
                '个',
                '根',
                '公斤',
                '盒件',
                '斤',
                '具',
                '卷',
                '块',
                '捆',
                '粒',
                '米',
                '盘',
                '批',
                '片',
                '平方米',
                '瓶',
                '其它',
                '升',
                '双',
                '台',
                '套',
                '条',
                '桶',
                '筒',
                '箱',
                '盏',
                '张',
                '支',
                '只',
                '组',
              ],
              width: 250,
              height: 30,
            })
          },
        },
        {
          name: 'color',
          type: 'custom',
          labelWidth: '80px',
          label: '用品颜色',
          rowHeight: '40px',
          required: false,
          init: function (component) {
            // 按钮
            const dropDownButtonContainer = document.createElement('div')
            dropDownButtonContainer.id = JQXLite.generateID()
            component[0].appendChild(dropDownButtonContainer)

            // 颜色
            const colorContainer = document.createElement('div')
            colorContainer.id = JQXLite.generateID()
            dropDownButtonContainer.appendChild(colorContainer)

            that.colorButtonInstance = jqwidgets.createInstance(
              `#${dropDownButtonContainer.id}`,
              'jqxDropDownButton',
              {
                width: 250,
                height: 30,
              }
            )

            that.colorInstance = jqwidgets.createInstance(
              `#${colorContainer.id}`,
              `jqxColorPicker`,
              {
                color: 'ffaabb',
                colorMode: 'hue',
                width: 250,
                height: 270,
              }
            )

            that.colorInstance.addEventHandler('colorchange', (event) => {
              const color = that.getTextElementByColor(event.args.color)
              that.colorButtonInstance.setContent(color)
              that.colorButtonInstance.close()
            })
          },
        },
        {
          name: 'dealer',
          type: 'text',
          labelWidth: '80px',
          label: '运营商',
          width: '250px',
          rowHeight: '40px',
          required: false,
        },
        {
          name: 'address',
          type: 'text',
          labelWidth: '80px',
          label: '地址/网址',
          width: '250px',
          rowHeight: '40px',
          required: false,
        },
        {
          name: 'remark',
          type: 'text',
          labelWidth: '80px',
          label: '备注',
          width: '250px',
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
    const that = this
    // 获取组件对象
    const $name = this.$refs.myForm.getComponentByName('suppliesName')
    that.nameInstance = $name

    const $type = this.$refs.myForm.getComponentByName('suppliesType')
    const $specModel = this.$refs.myForm.getComponentByName('specModel')
    that.specModelInstance = $specModel

    const $unit = this.$refs.myForm.getComponentByName('unit')
    that.unitInstance = $unit

    const $dealer = this.$refs.myForm.getComponentByName('dealer')
    that.dealerInstance = $dealer

    const $address = this.$refs.myForm.getComponentByName('address')
    that.addressInstance = $address

    const $remark = this.$refs.myForm.getComponentByName('remark')
    that.remarkInstance = $remark

    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $name,
        message: '该项必填',
        action: 'input,blur',
        rule: 'required',
      },
      {
        input: `#${that.treeButtonInstance.element.id}`,
        message: '该项必选',
        action: 'close',
        rule: function (input) {
          return input[0].textContent != ''
        },
      },
      {
        input: $unit,
        message: '该项必选',
        action: 'select',
        rule: function (input) {
          return input.val() != ''
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
      if (EDIT_SUPPLIES == params[0]) {
        const rowData = params[1]
        console.log(rowData)
        this.nameInstance.val(rowData['supplies_name'])
        const items = this.treeInstance.getItems()
        for (let i = 0; i < items.length; i++) {
          if (items[i].id == rowData['st_id']) {
            const element = items[i].element
            this.treeInstance.selectItem(element)
            this.treeInstance.expandItem(element)
            break
          }
        }
        this.specModelInstance.val(rowData['specification_model'])
        this.unitInstance.jqxComboBox('selectItem',rowData['supplies_unit'])
        this.colorInstance.setColor(rowData['supplies_color'])
        this.dealerInstance.val(rowData['dealer'])
        this.addressInstance.val(rowData['address'])
        this.remarkInstance.val(rowData['remark'])
        this.id = rowData['id']
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title
      const formData = {}
      formData['suppliesName'] = this.nameInstance.val()
      const treeItem = this.treeInstance.getSelectedItem()
      formData['suppliesType'] = treeItem['id']
      formData['specificationModel'] = this.specModelInstance.val()
      formData['suppliesUnit'] = this.unitInstance.val()
      const color = this.colorInstance.getColor()
      formData['suppliesColor'] = `#${color.hex}`
      formData['dealer'] = this.dealerInstance.val()
      formData['address'] = this.addressInstance.val()
      formData['remark'] = this.remarkInstance.val()
      formData['id'] = this.id

      if (EDIT_SUPPLIES == title) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    getTextElementByColor(color) {
      if (color == 'transparent' || color.hex == '') {
        return $(
          "<div style='text-shadow: none; position: relative; padding-bottom: 4px; margin-top: 5px;'>transparent</div>"
        )
      }
      let element = $(
        "<div style='text-shadow: none; position: relative; padding-bottom: 4px; margin-top: 5px;'>#" +
          color.hex +
          '</div>'
      )
      let nThreshold = 105
      let bgDelta = color.r * 0.299 + color.g * 0.587 + color.b * 0.114
      let foreColor = 255 - bgDelta < nThreshold ? 'Black' : 'White'
      element.css('color', foreColor)
      element.css('background', '#' + color.hex)
      element.addClass('jqx-rc-all')
      return element
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addSupplies(params).then((res) => {
        this.$refs.myWindow.close()
        // 提醒父组件刷新网格
        this.$parent.refresh()
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateSupplies(params).then((res) => {
        this.$refs.myWindow.close()
        // 提醒父组件刷新网格
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