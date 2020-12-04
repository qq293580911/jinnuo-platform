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
      :width="80"
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
      ref="normalButton"
      :imgSrc="imgSrc"
      @click="normalButtonClick"
      :style="{
        cursor: 'pointer',
      }"
    >
    </JqxButton>
    <JqxButton
      ref="outsideButton"
      :imgSrc="imgSrc"
      @click="outsideButtonClick"
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

import { filterSelectionParams } from "@/network/quote.js";
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
  mounted() {
    const that = this;
    this.$bus
      .$off("setSelectionParams")
      .$on("setSelectionParams", (rowData) => {
        // 先清理工具栏
        this.$refs.machineNumber.val("");
        this.$refs.machineType.clearSelection();
        this.$refs.speedType.clearSelection();
        this.$refs.airVolume.val("");
        this.$refs.powerSupply.clearSelection();
        this.$refs.power.val("");
        // 获得梳理的后的选型参数
        const params = {
          jsonParams: JSON.stringify(rowData),
        };
        filterSelectionParams(params).then((res) => {
          console.log(res);
          this.$refs.machineType.selectItem(res["machineType"]);
          this.$refs.speedType.selectItem(res["speedType"]);
          this.$refs.airVolume.val(res["airVolume"]);
          this.$refs.power.val(res["power"]);
        });
      });
  },
  methods: {
    // 获得选型结果
    normalButtonClick() {
      
    },
    // 获得外购选型结果
    outsideButtonClick(){

    }
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