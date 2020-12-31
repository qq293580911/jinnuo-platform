<template>
  <div>
    <JqxToolbar
      :width="'100%'"
      :height="35"
      :rtl="false"
      :tools="tools"
      :initTools="initTools"
    >
    </JqxToolbar>
    <add-control-box-window ref="addControlBoxWindow"></add-control-box-window>
  </div>
</template>

<script>
import Vue from 'vue'
import JqxToolbar from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue'
import AddControlBoxWindow from './AddControlBoxWindow'
import CustomUploader from '@/components/common/CustomUploader'
export default {
  components: {
    JqxToolbar,
    AddControlBoxWindow,
  },
  data() {
    return {
      tools: 'custom | custom | custom | custom | custom',
      showAddControlBox: false,
    }
  },
  watch: {
    showAddControlBox() {
      if (this.showAddControlBox) {
        const offset = $(`#${this.addControlBoxID}`).offset()
        const clientX = offset.left + 12
        const clientY = offset.top + 14
        this.$refs.addControlBoxWindow.open(clientX, clientY)
      } else {
        this.$refs.addControlBoxWindow.close()
      }
    },
  },
  mounted() {
    const that = this
    // 上传器监听文件读取内容
    this.uploaderInstance.$on('changed', (data) => {
      const sheetName = Object.keys(data[0])[0]
      const fileName = that.uploaderInstance.inputValue
      const fileContent = data[0][sheetName]
      this.$store.dispatch('saveCurrentQuoteName', fileName)
      this.$store.dispatch('saveCurrentQuoteContent', fileContent)
    })
    // 导入
    this.importInstance.addEventHandler('click', () => {
      const priceRule = that.$store.state.currentQuote.pricePlan.rule
      const splitRule = that.$store.state.currentQuote.splitPlan
      this.$confirm({
        title: `导入内容`,
        okText: '确认',
        cancelText: '取消',
        centered: true,
        content: (h) => (
          <div style="color:red;">
            你现在选择的是<span style="color:green;">{priceRule}</span>的价格，
            <span style="color:green;">{splitRule}</span>
            的拆分，确认导入数据吗？?
          </div>
        ),
        onOk() {
          that.$bus.$emit('import')
        },
        onCancel() {},
        class: 'test',
      })
    })
    // 匹配阀门风口
    this.handlerInstance.addEventHandler('click', () => {
      that.$bus.$emit('handler')
    })
    // 数据导出
    this.exportInstance.addEventHandler('click', () => {
      that.$bus.$emit('export')
    })
    // 批量添加控制箱
    this.addControlBoxInstance.addEventHandler('click', () => {
      this.showAddControlBox = !this.showAddControlBox
    })
    // 加点
    this.addPointInstance.addEventHandler('click', () => {
      const point = this.addPointNumberInsatnce.val()
      const rowsData = this.$store.state.currentQuote.content
      rowsData.forEach((rowData) => {
        let unitPrice = rowData['unitPrice']
        const unit = rowData['unit']
        if (isNaN(unitPrice) || unitPrice == 0) {
          rowData['transfer'] = ''
        } else if (point < 0) {
          // 如果是降点
          unitPrice = unitPrice * (1 + point / 100)
        } else {
          // 如果是加点
          unitPrice = unitPrice / (1 - point / 100)
        }
        switch (unit) {
          case '个':
            unitPrice = Math.ceil(unitPrice)
            break
          case '台': {
            let _unit = unitPrice % 10
            if (_unit > 0 && _unit < 5) {
              _unit = 5
            }
            if (_unit > 5 && _unit < 10) {
              _unit = 10
            }
            unitPrice = unitPrice - (unitPrice % 10) + _unit
            break
          }
          default:
            break
        }
        if (unitPrice) {
          rowData['unitPrice'] = unitPrice
          rowData['transfer'] = point
        }
      })
      this.$store.dispatch('saveCurrentQuoteContent', rowsData)
      this.$bus.$emit('refresh')
      this.$message.success('加点完成')
    })
    // 价格方案选择
    this.priceRuleInstance.addEventHandler('select', (event) => {
      const pricePlan = {
        rule: event.args.item.label,
        id: event.args.item.value,
      }
      this.$store.dispatch('saveCurrentQuotePricePlan', pricePlan)
    })
    this.priceRuleInstance.selectIndex(0)
    // 拆分方案选择
    this.splitRuleInstance.addEventHandler('select', (event) => {
      const rule = event.args.item.label
      this.$store.dispatch('saveCurrentQuoteSplitPlan', rule)
    })
    this.splitRuleInstance.selectIndex(0)
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      if (menuToolIninitialization == false) {
        const that = this
        switch (index) {
          // 文件上传选择器
          case 0: {
            const container = document.createElement('div')
            const containerID = JQXLite.generateID()
            container.id = containerID
            container.style.cssText =
              'overflow: hidden; position: relative;margin-top:1px'
            tool[0].appendChild(container)
            const uploaderComponent = Vue.extend(CustomUploader)
            that.uploaderInstance = new uploaderComponent({
              propsData: {
                width: 190,
                height: 25,
                type: 'jqxInput',
                showUploadButton: true,
                fieldsCofig: {
                  fields: {
                    serialNumber: 'A',
                    productName: 'B',
                    specModel: 'C',
                    unit: 'D',
                    quantity: 'E',
                    unitPrice: 'F',
                    totalPrice: 'G',
                    remark: 'H',
                    selection: 'I',
                    transfer: 'J',
                    formula: 'K',
                    designateType: 'L',
                  },
                },
              },
            }).$mount(`#${containerID}`)
            break
          }
          // 上传，导入，处理，导出
          case 1: {
            const buttonGroup = document.createElement('div')
            buttonGroup.style.cssText =
              'overflow: hidden; position: relative;display:flex'
            tool[0].appendChild(buttonGroup)
            const importButton = document.createElement('div')
            const importButtonID = JQXLite.generateID()
            importButton.id = importButtonID
            importButton.style.cssText = 'margin-right:5px;cursor: pointer;'

            const proccessButton = document.createElement('div')
            const proccessButtonID = JQXLite.generateID()
            proccessButton.id = proccessButtonID
            proccessButton.style.cssText = 'margin-right:5px;cursor: pointer;'

            const exportButton = document.createElement('div')
            const exportButtonID = JQXLite.generateID()
            exportButton.id = exportButtonID
            exportButton.style.cssText = 'margin-right:5px;cursor: pointer;'

            buttonGroup.appendChild(importButton)
            buttonGroup.appendChild(proccessButton)
            buttonGroup.appendChild(exportButton)

            that.importInstance = jqwidgets.createInstance(
              `#${importButtonID}`,
              'jqxButton',
              {
                imgSrc: require('@/assets/iconfont/custom/import.svg'),
              }
            )
            jqwidgets.createInstance(`#${importButtonID}`, 'jqxTooltip', {
              content: '导入数据',
              position: 'mouse',
            })

            that.handlerInstance = jqwidgets.createInstance(
              `#${proccessButtonID}`,
              'jqxButton',
              {
                imgSrc: require('@/assets/iconfont/custom/process.svg'),
              }
            )
            jqwidgets.createInstance(`#${proccessButtonID}`, 'jqxTooltip', {
              content: '匹配价格',
              position: 'mouse',
            })

            that.exportInstance = jqwidgets.createInstance(
              `#${exportButtonID}`,
              'jqxButton',
              {
                imgSrc: require('@/assets/iconfont/custom/export.svg'),
              }
            )
            jqwidgets.createInstance(`#${exportButtonID}`, 'jqxTooltip', {
              content: '导出数据',
              position: 'mouse',
            })
            break
          }
          // 批量添加控制箱
          case 2: {
            tool[0].style.cssText = 'margin-left:10%;'
            const container = document.createElement('div')
            container.style.cssText =
              'display:inline-block;vertical-align: middle;cursor: pointer;'
            this.addControlBoxID = JQXLite.generateID()
            container.id = this.addControlBoxID
            tool[0].appendChild(container)
            jqwidgets.createInstance(`#${this.addControlBoxID}`, 'jqxButton', {
              imgSrc: require('@/assets/iconfont/custom/box.svg'),
            })
            that.addControlBoxInstance = jqwidgets.createInstance(
              `#${this.addControlBoxID}`,
              'jqxTooltip',
              {
                content: '添加控制箱',
                position: 'mouse',
              }
            )
            break
          }
          // 加点
          case 3: {
            tool[0].style.cssText = 'margin-left:10%;'
            const container = document.createElement('div')
            container.style.cssText =
              'overflow: hidden; position: relative;display:flex'
            tool[0].appendChild(container)
            // 加点
            const addPointNumberContainer = document.createElement('div')
            addPointNumberContainer.style.cssText = 'margin-right:5px;overflow:hidden;'
            const addPointNumberID = JQXLite.generateID()
            addPointNumberContainer.id = addPointNumberID
            container.appendChild(addPointNumberContainer)
            that.addPointNumberInsatnce = jqwidgets.createInstance(
              `#${addPointNumberID}`,
              'jqxNumberInput',
              {
                width: 80,
                inputMode: 'simple',
                spinButtons: true,
              }
            )
            // 加点按钮
            const addPointBtnContainer = document.createElement('div')
            addPointBtnContainer.style.cssText =
              'margin-right:5px;cursor: pointer;'
            const addPointButtonID = JQXLite.generateID()
            addPointBtnContainer.id = addPointButtonID
            container.appendChild(addPointBtnContainer)
            that.addPointInstance = jqwidgets.createInstance(
              `#${addPointButtonID}`,
              'jqxButton',
              {
                width: 25,
                height: 25,
                imgSrc: require('@/assets/iconfont/custom/rate.svg'),
              }
            )
            break
          }
          // 价格方案，拆分方案
          case 4: {
            tool[0].style.cssText = 'float:right;'
            const planContainer = document.createElement('div')
            planContainer.style.cssText =
              'overflow: hidden; position: relative;display:flex;'
            tool[0].appendChild(planContainer)

            const pricePlanSelector = document.createElement('div')
            const pricePlanID = JQXLite.generateID()
            pricePlanSelector.id = pricePlanID
            pricePlanSelector.style.cssText = 'margin-right:5px;cursor:pointer;'

            const splitPlanSelector = document.createElement('div')
            const splitPlanID = JQXLite.generateID()
            splitPlanSelector.id = splitPlanID
            splitPlanSelector.style.cssText = 'margin-right:5px;cursor:pointer;'

            planContainer.appendChild(pricePlanSelector)
            planContainer.appendChild(splitPlanSelector)

            that.priceRuleInstance = jqwidgets.createInstance(
              `#${pricePlanID}`,
              'jqxComboBox',
              {
                source: that.$store.state.pricePlan,
                width: 150,
                displayMember: 'rule',
                valueMember: 'id',
              }
            )
            jqwidgets.createInstance(`#${pricePlanID}`, 'jqxTooltip', {
              content: '价格方案',
              position: 'bottom',
            })

            that.splitRuleInstance = jqwidgets.createInstance(
              `#${splitPlanID}`,
              'jqxComboBox',
              {
                source: that.$store.state.splitPlan,
                width: 150,
                displayMember: 'rule',
                valueMember: 'rule',
              }
            )
            jqwidgets.createInstance(`#${splitPlanID}`, 'jqxTooltip', {
              content: '拆分方案',
              position: 'bottom',
            })
            break
          }
        }
      }
    },
  },
}
</script>

<style scoped>
::v-deep .jqx-widget-content {
  overflow: hidden;
}
</style>
