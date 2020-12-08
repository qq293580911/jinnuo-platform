<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="180"
      :height="165"
      :maxHeight="500"
      :animationType="'none'"
      :autoOpen="false"
      :resizable="false"
      :draggable="false"
      :showCloseButton="true"
      :showCollapseButton="false"
      :position="position"
      @closed="closed($event)"
    >
      <div>批量添加控制箱</div>
      <div>
        <JqxComboBox
          ref="powerSupply"
          :autoDropDownHeight="true"
          :selectedIndex="0"
          :promptText="'请选择..'"
          :animationType="'fade'"
          :width="'100%'"
          :height="25"
          :source="['单电源', '双电源']"
        >
        </JqxComboBox>
        <JqxComboBox
          ref="certificateType"
          :autoDropDownHeight="true"
          :selectedIndex="0"
          :promptText="'请选择..'"
          :animationType="'fade'"
          :width="'100%'"
          :height="25"
          :source="['非3C', '3C']"
          :style="{
            marginTop: '5px',
          }"
        >
        </JqxComboBox>
        <JqxComboBox
          ref="type"
          :autoDropDownHeight="true"
          :selectedIndex="0"
          :promptText="'请选择..'"
          :animationType="'fade'"
          :width="'100%'"
          :height="25"
          :source="['常规型', '简易型']"
          :style="{
            marginTop: '5px',
          }"
        >
        </JqxComboBox>

        <div style="margin-top: 10px">
          <JqxButton ref="cancelButton" :width="50" :style="{ float: 'right' }">
            取消
          </JqxButton>
          <JqxButton
            ref="confirmButton"
            :width="50"
            @click="confirmClick"
            :style="{ float: 'right', marginRight: '5px' }"
          >
            确认
          </JqxButton>
        </div>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";
import JqxButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue";

import { getAddControlBoxList } from "@/network/quote.js";
export default {
  components: {
    JqxWindow,
    JqxComboBox,
    JqxButton,
  },
  data() {
    return {
      position: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.position = {
        x: params[0] - 12,
        y: params[1] + 10,
      };
      this.$refs.myWindow.open();
    },
    close() {
      this.$refs.myWindow.close();
    },
    confirmClick() {
      const that = this
      this.$refs.myWindow.close();
      const powerSupplyType = this.$refs.powerSupply.val();
      const certificateType = this.$refs.certificateType.val();
      const type = this.$refs.type.val();
      const rowsData = this.$store.state.currentQuote.content;
      // 可加控制箱的
      let eligibles = rowsData
        .filter((rowData) => {
          const remark = rowData["remark"];
          return /[圆|柜]机/.test(remark);
        })
        .map((rowData, index) => {
          const map = {
            uid: index,
            serialNumber: rowData["serialNumber"],
            productName:
              type == "常规型"
                ? "风机控制箱" + "（" + powerSupplyType + "）"
                : "简易型控制箱" + "（" + powerSupplyType + "）",
            specModel: rowData["selection"],
            unit: rowData["unit"],
            quantity: rowData["quantity"],
            remark: certificateType,
            selection: rowData["selection"],
          };
          return map;
        });
      // 可添加的台数
      let machineCount = eligibles
        .map((rowData) => {
          return rowData["quantity"];
        })
        .reduce((prev, curr, idx, arr) => {
          return prev + curr;
        });
      if (eligibles.length < 1) {
        return;
      }
      this.$confirm({
        title: `批量添加控制箱`,
        okText: "确认",
        cancelText: "取消",
        centered: true,
        content: (h) => (
          <div style="color:red;">
            检测到符合添加控制箱条件的风机台数有
            <span style="color:green;">{machineCount}</span>
            台，是否要为其添加控制箱？
          </div>
        ),
        onOk() {
          const jsonParams = {
            powerSupply: powerSupplyType,
            certification: certificateType,
            productName:
              type == "常规型"
                ? "风机控制箱" + "（" + powerSupplyType + "）"
                : "简易型控制箱" + "（" + powerSupplyType + "）",
            priceSchemeId: that.$store.state.currentQuote.pricePlan.id,
            items: eligibles,
          };
          getAddControlBoxList({
            jsonParams: JSON.stringify(jsonParams),
          }).then((res) => {
            that.$store.dispatch('appendCurrentQuoteContent',res)
            that.$bus.$emit('refresh')
            that.$message.success(`添加完毕，检查末尾`)
          });
        },
        onCancel() {},
        class: "test",
      });
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close();
  },
};
</script>

<style>
</style>