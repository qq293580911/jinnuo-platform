<template>
  <div class="container">
    <JqxSwitchButton
      ref="mySwitchButton"
      :width="50"
      :height="23"
      :onLabel="'开'"
      :offLabel="'关'"
      :thumbSize="'50%'"
      :checked="state"
      v-show="showSwitchButton"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxSwitchButton>
    <JqxInput
      ref="machineNumber"
      :width="50"
      :height="25"
      :minLength="1"
      :placeHolder="'型号#'"
      v-show="showMachineNumber"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxInput>
    <JqxComboBox
      ref="machineType"
      :width="70"
      :height="25"
      :source="types"
      v-show="showMachineType"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxComboBox>
    <JqxComboBox
      ref="speedType"
      :width="70"
      :height="25"
      :source="speeds"
      v-show="showSpeedType"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxComboBox>
    <JqxInput
      ref="airVolume"
      :width="120"
      :height="25"
      :minLength="1"
      :placeHolder="'风量：m³/h'"
      v-show="showAirVolume"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxInput>
    <JqxComboBox
      ref="powerSupply"
      :width="70"
      :height="25"
      :source="powerSupply"
      v-show="showPowerSupply"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxComboBox>
    <JqxInput
      ref="power"
      :width="100"
      :height="25"
      :minLength="1"
      :placeHolder="'功率：kw'"
      v-show="showPower"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxInput>
    <JqxButton
      ref="confirmButton"
      :imgSrc="imgSrc"
      @click="buttonClick"
      v-show="showConfirm"
      :style="{
        cursor: 'pointer',
      }"
    >
    </JqxButton>
  </div>
</template>

<script>
import JqxSwitchButton from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxswitchbutton.vue'
import JqxInput from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxinput.vue'
import JqxComboBox from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue'
import JqxButton from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue'
import {
  GENERAL_BLOWER,
  OUTSIDE_BUY,
  VENTILATOR,
  CONTROL_BOX,
  WALL_BLOWER,
  DUCT_BLOWER,
  MUTE_BLOWER,
  SIDE_WALL_BLOWER,
  SIDE_WALL_BLOWER_EP,
} from '@/common/const.js'
import {
  filterSelectionParams,
  getGeneralBlowerList,
  getOutsideBuyList,
  getVentilatorList,
  getControlBoxList,
  getSmallBlowerList,
} from '@/network/quote.js'
export default {
  components: {
    JqxSwitchButton,
    JqxInput,
    JqxComboBox,
    JqxButton,
  },
  props: {
    selectionType: {
      type: String,
      default: '常规风机',
    },
  },
  data() {
    return {
      state: false,
      types: ['圆机', '柜机'],
      speeds: ['单速', '双速'],
      powerSupply: ['单电源', '双电源'],
      imgSrc: require('@/assets/iconfont/custom/confirm.svg'),
      certificate: false,
      showSwitchButton: true,
      showMachineNumber: true,
      showMachineType: true,
      showSpeedType: true,
      showAirVolume: true,
      showPowerSupply: false,
      showPower: true,
      showConfirm: true,
    }
  },
  watch: {
    selectionType() {
      const that = this
      switch (that.selectionType) {
        case GENERAL_BLOWER:
          that.showSwitchButton = true
          that.showMachineNumber = true
          that.showMachineType = true
          that.showSpeedType = true
          that.showAirVolume = true
          that.showPowerSupply = false
          that.showPower = true
          that.showConfirm = true
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/confirm.svg')
          break
        case OUTSIDE_BUY:
          that.showSwitchButton = false
          that.showMachineNumber = true
          that.showMachineType = true
          that.showSpeedType = true
          that.showAirVolume = true
          that.showPowerSupply = false
          that.showPower = true
          that.showConfirm = false
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/outside.svg')
          break
        case CONTROL_BOX:
          that.showSwitchButton = false
          that.showMachineNumber = false
          that.showMachineType = false
          that.showSpeedType = false
          that.showAirVolume = false
          that.showPowerSupply = true
          that.showPower = true
          that.showConfirm = true
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/confirm.svg')
          break
        case VENTILATOR:
          that.showSwitchButton = false
          that.showMachineNumber = false
          that.showMachineType = false
          that.showSpeedType = false
          that.showAirVolume = true
          that.showPowerSupply = false
          that.showPower = false
          that.showConfirm = true
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/confirm.svg')
          break
        case WALL_BLOWER:
          that.showSwitchButton = false
          that.showMachineNumber = false
          that.showMachineType = false
          that.showSpeedType = false
          that.showAirVolume = true
          that.showPowerSupply = false
          that.showPower = true
          that.showConfirm = true
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/confirm.svg')
          break
        case DUCT_BLOWER:
          that.showSwitchButton = false
          that.showMachineNumber = false
          that.showMachineType = false
          that.showSpeedType = false
          that.showAirVolume = true
          that.showPowerSupply = false
          that.showPower = true
          that.showConfirm = true
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/confirm.svg')
          break
        case MUTE_BLOWER:
          that.showSwitchButton = false
          that.showMachineNumber = false
          that.showMachineType = false
          that.showSpeedType = false
          that.showAirVolume = true
          that.showPowerSupply = false
          that.showPower = true
          that.showConfirm = true
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/confirm.svg')
          break
        case SIDE_WALL_BLOWER:
          that.showSwitchButton = false
          that.showMachineNumber = false
          that.showMachineType = false
          that.showSpeedType = false
          that.showAirVolume = true
          that.showPowerSupply = false
          that.showPower = true
          that.showConfirm = true
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/confirm.svg')
          break
        case SIDE_WALL_BLOWER_EP:
          that.showSwitchButton = false
          that.showMachineNumber = false
          that.showMachineType = false
          that.showSpeedType = false
          that.showAirVolume = true
          that.showPowerSupply = false
          that.showPower = true
          that.showConfirm = true
          that.$refs.confirmButton.imgSrc = require('@/assets/iconfont/custom/confirm.svg')
          break
        default:
          break
      }
      that.$refs.confirmButton.render()
    },
  },
  mounted() {
    this.$bus
      .$off('setSelectionParams')
      .$on('setSelectionParams', (rowData) => {
        this.rowData = rowData
        // 先清理工具栏
        this.$refs.machineNumber.val('')
        this.$refs.machineType.clearSelection()
        this.$refs.speedType.clearSelection()
        this.$refs.airVolume.val('')
        // this.$refs.powerSupply.selectItem('单电源')
        this.$refs.power.val('')
        // 获得梳理的后的选型参数
        const res = filterSelectionParams(rowData)
        switch (this.selectionType) {
          case GENERAL_BLOWER:
            this.certificate = res['certificate']
            break
          default:
            this.certificate = false
            break
        }
        this.$refs.machineType.selectItem(res['machineType'])
        this.$refs.speedType.selectItem(res['speedType'])
        this.$refs.airVolume.val(res['airVolume'])
        this.$refs.power.val(res['power'])
      })
  },
  methods: {
    // 获得选型结果
    buttonClick() {
      const rowData = this.rowData
      const jsonParams = {}
      jsonParams['priceSchemeId'] = this.$store.state.currentQuote.pricePlan.id
      const existParams = {
        selectionType: this.selectionType,
        certificate: this.certificate,
      }
      switch (this.selectionType) {
        case GENERAL_BLOWER:
          jsonParams['isOutsideBuy'] = false
          jsonParams['isStandard'] = this.$refs.mySwitchButton.val()
          jsonParams['productName'] = rowData['productName']
          jsonParams['machineNumber'] = this.$refs.machineNumber.val()
          jsonParams['machineType'] = this.$refs.machineType.val()
          jsonParams['speedType'] = this.$refs.speedType.val()
          jsonParams['airVolume'] = this.$refs.airVolume.val()
          jsonParams['machinePower'] = this.$refs.power.val()
          getGeneralBlowerList({ jsonParams: JSON.stringify(jsonParams) }).then(
            (res) => {
              if (res.length > 0) {
                // 防爆风机的价格要在原有的基础上乘以1.5
                const productName = rowData['productName']
                if (/防[爆,暴]/.test(productName)) {
                  res.forEach((item) => {
                    let unitPriceN3C = Math.round(
                      parseInt(item['price_non_ccc']) * 1.5
                    )
                    let _unitPriceN3C = unitPriceN3C % 10
                    if (_unitPriceN3C > 0 && _unitPriceN3C < 5) {
                      _unitPriceN3C = 5
                    }
                    if (_unitPriceN3C > 5 && _unitPriceN3C < 10) {
                      _unitPriceN3C = 10
                    }
                    unitPriceN3C =
                      unitPriceN3C - (unitPriceN3C % 10) + _unitPriceN3C

                    let unitPrice3C = Math.round(
                      parseInt(item['price_ccc']) * 1.5
                    )
                    let _unitPrice3C = unitPriceN3C % 10
                    if (_unitPrice3C > 0 && _unitPrice3C < 5) {
                      _unitPrice3C = 5
                    }
                    if (_unitPrice3C > 5 && _unitPrice3C < 10) {
                      _unitPrice3C = 10
                    }
                    unitPrice3C =
                      unitPrice3C - (unitPrice3C % 10) + _unitPrice3C

                    item['price_non_ccc'] = unitPriceN3C
                    item['price_ccc'] = unitPrice3C
                  })
                }
                this.$bus.$emit('renderSelectionList', existParams, res)
              }
            }
          )
          break
        case OUTSIDE_BUY:
          jsonParams['isOutsideBuy'] = true
          jsonParams['productName'] = rowData['productName']
          jsonParams['machineNumber'] = this.$refs.machineNumber.val()
          jsonParams['machineType'] = this.$refs.machineType.val()
          jsonParams['speedType'] = this.$refs.speedType.val()
          jsonParams['airVolume'] = this.$refs.airVolume.val()
          jsonParams['machinePower'] = this.$refs.power.val()
          getOutsideBuyList({ jsonParams: JSON.stringify(jsonParams) }).then(
            (res) => {
              if (res.length > 0) {
                this.$bus.$emit('renderSelectionList', existParams, res)
              }
            }
          )
          break
        case CONTROL_BOX:
          jsonParams['powerSupply'] = this.$refs.powerSupply.val()
          jsonParams['machinePower'] = this.$refs.power.val()
          getControlBoxList({ jsonParams: JSON.stringify(jsonParams) }).then(
            (res) => {
              if (res.length > 0) {
                this.$bus.$emit('renderSelectionList', existParams, res)
              }
            }
          )
          break
        case VENTILATOR:
          jsonParams['airVolume'] = this.$refs.airVolume.val()
          jsonParams[
            'pricePlan'
          ] = this.$store.state.currentQuote.pricePlan.rule
          getVentilatorList({
            jsonParams: JSON.stringify(jsonParams),
          }).then((res) => {
            if (res.length > 0) {
              this.$bus.$emit('renderSelectionList', existParams, res)
            }
          })
          break
        default:
          // jsonParams['isOutsideBuy'] = false
          jsonParams['isStandard'] = false
          jsonParams['productName'] = rowData['productName']
          // jsonParams['machineNumber'] = this.$refs.machineNumber.val()
          jsonParams['machineType'] = this.selectionType
          // jsonParams['speedType'] = this.$refs.speedType.val()
          jsonParams['airVolume'] = this.$refs.airVolume.val()
          jsonParams['machinePower'] = this.$refs.power.val()
          getSmallBlowerList({ jsonParams: JSON.stringify(jsonParams) }).then(
            (res) => {
              if (res.length > 0) {
                this.$bus.$emit('renderSelectionList', existParams, res)
              }
            }
          )
          break
      }
    },
  },
  destroyed() {},
}
</script>

<style scoped>
.container {
  float: right;
  overflow: hidden;
  position: relative;
  display: flex;
}
</style>
