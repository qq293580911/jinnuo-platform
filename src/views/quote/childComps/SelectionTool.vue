<template>
  <div class="container">
    <JqxSwitchButton
      ref="mySwitchButton"
      v-model="state"
      :width="50"
      :height="23"
      :onLabel="'开'"
      :offLabel="'关'"
      :thumbSize="'50%'"
      :checked="true"
      v-if="showSwitchButton"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxSwitchButton>
    <JqxInput
      :width="50"
      :height="25"
      :minLength="1"
      :placeHolder="'型号#'"
      v-if="showMachineNumber"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxInput>
    <JqxComboBox
      :width="70"
      :height="25"
      :source="types"
      v-if="showMachineType"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxComboBox>
    <JqxComboBox
      :width="70"
      :height="25"
      :source="speeds"
      v-if="showSpeedType"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxComboBox>
    <JqxInput
      :width="80"
      :height="25"
      :minLength="1"
      :placeHolder="'风量：m³/h'"
      v-if="showAirVolume"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxInput>
    <JqxComboBox
      :width="70"
      :height="25"
      :source="powerSupply"
      v-if="showPowerSupply"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxComboBox>
    <JqxInput
      :width="80"
      :height="25"
      :minLength="1"
      :placeHolder="'功率：kw'"
      v-if="showPower"
      :style="{
        marginRight: '5px',
      }"
    >
    </JqxInput>
    <JqxButton
      ref="myButton"
      :imgSrc="imgSrc"
      @click="buttonClick"
      :style="{
        cursor: 'pointer',
      }"
    >
    </JqxButton>
  </div>
</template>

<script>
import JqxSwitchButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxswitchbutton.vue";
import JqxInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxinput.vue";
import JqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";
import JqxNumberInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxnumberinput.vue";
import JqxButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue";
export default {
  components: {
    JqxSwitchButton,
    JqxInput,
    JqxComboBox,
    JqxNumberInput,
    JqxButton,
  },
  props: {
    selectionType: {
      type: String,
      default: "常规风机",
    },
  },
  data() {
    return {
      state: false,
      types: ["圆机", "柜机"],
      speeds: ["单速", "双速"],
      powerSupply: ["单电源", "双电源"],
      imgSrc: require("@/assets/iconfont/custom/confirm.svg"),
      showSwitchButton: true,
      showMachineNumber: true,
      showMachineType: true,
      showSpeedType: true,
      showAirVolume: true,
      showPowerSupply: false,
      showPower: true,
    };
  },
  watch: {
    selectionType() {
      const that = this;
      switch (that.selectionType) {
        case "常规风机":
          that.showSwitchButton = true;
          that.showMachineNumber = true;
          that.showMachineType = true;
          that.showSpeedType = true;
          that.showAirVolume = true;
          that.showPowerSupply = false;
          that.showPower = true;
          break;
        case "控制箱":
          that.showSwitchButton = false;
          that.showMachineNumber = false;
          that.showMachineType = false;
          that.showSpeedType = false;
          that.showAirVolume = false;
          that.showPowerSupply = true;
          that.showPower = true;
          break;
        case "换气扇":
          that.showSwitchButton = false;
          that.showMachineNumber = false;
          that.showMachineType = false;
          that.showSpeedType = false;
          that.showAirVolume = true;
          that.showPowerSupply = false;
          that.showPower = false;
          break;
        case "方形壁式风机":
          that.showSwitchButton = false;
          that.showMachineNumber = false;
          that.showMachineType = false;
          that.showSpeedType = false;
          that.showAirVolume = true;
          that.showPowerSupply = false;
          that.showPower = true;
          break;
        case "GDF管道离心风机":
          that.showSwitchButton = false;
          that.showMachineNumber = false;
          that.showMachineType = false;
          that.showSpeedType = false;
          that.showAirVolume = true;
          that.showPowerSupply = false;
          that.showPower = true;
          break;
        case "超静音送风机":
          that.showSwitchButton = false;
          that.showMachineNumber = false;
          that.showMachineType = false;
          that.showSpeedType = false;
          that.showAirVolume = true;
          that.showPowerSupply = false;
          that.showPower = true;
          break;
        case "边墙风机":
          that.showSwitchButton = false;
          that.showMachineNumber = false;
          that.showMachineType = false;
          that.showSpeedType = false;
          that.showAirVolume = true;
          that.showPowerSupply = false;
          that.showPower = true;
          break;
        case "边墙风机（防爆）":
          that.showSwitchButton = false;
          that.showMachineNumber = false;
          that.showMachineType = false;
          that.showSpeedType = false;
          that.showAirVolume = true;
          that.showPowerSupply = false;
          that.showPower = true;
          break;
        default:
          break;
      }
    },
  },
  methods: {
    buttonClick() {},
  },
};
</script>

<style scoped>
.container {
  float: right;
  overflow: hidden;
  position: relative;
  display: flex;
}
</style>