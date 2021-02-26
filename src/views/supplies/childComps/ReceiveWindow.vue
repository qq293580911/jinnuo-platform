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
import jqxSlider from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxslider.vue'

import { EDIT_SUPPLIES_RECEIVE } from '@/common/const.js'
import {
  getAllSupplies,
  addReceive,
  updateReceive,
  getStockQuantity,
} from '@/network/supplies.js'
import { getAllDepartment } from '@/network/department.js'
import { getEmployeeByDeptId } from '@/network/employee.js'
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
    jqxSlider,
  },
  beforeCreate() {},
  data() {
    const that = this
    return {
      template: [
        {
          name: 'supplies',
          type: 'custom',
          labelWidth: '80px',
          label: '选择用品',
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
              that.suppliesInstance = jqwidgets.createInstance(
                component,
                `jqxComboBox`,
                {
                  width: 250,
                  height: 30,
                  animationType: 'fade',
                  displayMember: 'label',
                  valueMember: 'value',
                  source: res,
                }
              )
              // 选择用品时，查找库存
              that.suppliesInstance.addEventHandler('select', (event) => {
                const suppliesId = event.args.item.value
                const params = {
                  jsonParams: JSON.stringify({ suppliesId }),
                }
                getStockQuantity(params).then((res) => {
                  if (res != null) {
                    let $receiveQuantity = that.$refs.myForm.getComponentByName(
                      'quantity'
                    )
                    that.quantityInstance = jqwidgets.createInstance(
                      $receiveQuantity,
                      `jqxSlider`,
                      {
                        max: res['stock_quantity'],
                      }
                    )
                  }
                })
              })
            })
          },
        },
        {
          name: 'date',
          type: 'custom',
          labelWidth: '80px',
          label: '领用日期',
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
          label: '领用数量',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            jqwidgets.createInstance(component, `jqxSlider`, {
              tooltip: true,
              mode: 'fixed',
              width: 250,
              height: 30,
              max: 0,
            })
          },
        },
        {
          name: 'receiveDepartment',
          type: 'custom',
          labelWidth: '80px',
          label: '领用部门',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            const buttonContainer = document.createElement('div')
            buttonContainer.id = JQXLite.generateID()
            component[0].appendChild(buttonContainer)

            const treeContainer = document.createElement('div')
            treeContainer.id = JQXLite.generateID()
            treeContainer.style.css = `border: none;`
            buttonContainer.appendChild(treeContainer)

            const buttonInstance = jqwidgets.createInstance(
              `#${buttonContainer.id}`,
              `jqxDropDownButton`,
              {
                width: 250,
                height: 30,
              }
            )

            getAllDepartment().then((res) => {
              const source = {
                datafields: [
                  { name: 'name', map: 'deptName', type: 'string' },
                  { name: 'id', map: 'deptId', type: 'number' },
                  { name: 'parentId', map: 'parentId', type: 'number' },
                ],
                dataType: 'json',
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
                `jqxTree`,
                {
                  source: records,
                  width: 250,
                  height: 250,
                }
              )

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
                buttonInstance.setContent(dropDownContent)
                buttonInstance.close()

                //查询所在部门的所有员工
                const params = {
                  jsonParams: JSON.stringify({ dept_id: selectedItem.id }),
                }
                getEmployeeByDeptId(params).then((res) => {
                  let $recipient = that.$refs.myForm.getComponentByName(
                    'recipient'
                  )
                  that.recipientInstance = jqwidgets.createInstance(
                    $recipient,
                    `jqxComboBox`,
                    {
                      source: res,
                      displayMember: 'empName',
                      valueMember: 'empId',
                    }
                  )
                })
              })
            })
          },
        },
        {
          name: 'recipient',
          type: 'custom',
          labelWidth: '80px',
          label: '领用人',
          rowHeight: '40px',
          required: true,
          init: function (component) {
            component.jqxComboBox({
              width: 250,
              height: 30,
              animationType: 'fade',
            })
          },
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
    const suppliesInstance = this.$refs.myForm.getComponentByName('supplies')
    this.suppliesInstance = suppliesInstance

    const dateInstance = this.$refs.myForm.getComponentByName('date')
    this.dateInstance = dateInstance

    const quantityInstance = this.$refs.myForm.getComponentByName('quantity')
    this.quantityInstance = quantityInstance

    const recipientInstance = this.$refs.myForm.getComponentByName('recipient')
    this.recipientInstance = recipientInstance

    const remarkInstance = this.$refs.myForm.getComponentByName('remark')
    this.remarkInstance = remarkInstance
  },
  methods: {
    open(...params) {
      console.log(1)
      this.$refs.myWindow.setTitle(params[0])
      if (EDIT_SUPPLIES_RECEIVE == params[0]) {
      }
      this.$refs.myWindow.open()
    },
    onValidationSuccess(event) {
      const formData = {}
      formData['suppliesId'] = this.suppliesInstance.val()
      formData['receiveDate'] = this.dateInstance.val()
      formData['receiveQuantity'] = this.quantityInstance.val()
      let item = this.treeInstance.getSelectedItem()
      formData['receiveDepartment'] = item.id
      formData['recipient'] = $recipient.val()
      formData['remark'] = $remark.val()
      formData['receiveId'] = this.id
      let title = this.$refs.myWindow.title
      if (EDIT_SUPPLIES_RECEIVE == title) {
        this.update(formData)
      } else {
        this.add(formData)
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      addReceive(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh()
      })
    },
    update() {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateReceive(params).then((res) => {
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
