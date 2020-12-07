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
import Vue from "vue";
import JqxToolbar from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue";
import AddControlBoxWindow from "./AddControlBoxWindow";
import CustomUploader from "@/components/common/CustomUploader";
export default {
  components: {
    JqxToolbar,
    AddControlBoxWindow,
  },
  data() {
    return {
      tools: "custom | custom | custom | custom | custom",
      toolsIndex: -1,
      showAddControlBox: false,
    };
  },
  watch: {
    showAddControlBox() {
      if (this.showAddControlBox) {
        const offset = $("#addControlBox").offset();
        const clientX = offset.left + 12;
        const clientY = offset.top + 14;
        this.$refs.addControlBoxWindow.open(clientX, clientY);
      } else {
        this.$refs.addControlBoxWindow.close();
      }
    },
  },
  mounted() {
    const that = this;
    // 上传器监听文件读取内容
    this.uploaderInstance.$on("changed", (data) => {
      let sheetName = Object.keys(data[0])[0];
      const fileName = that.uploaderInstance.inputValue;
      const fileContent = data[0][sheetName];
      this.$store.dispatch("saveCurrentQuoteName", fileName);
      this.$store.dispatch("saveCurrentQuoteContent", fileContent);
    });

    // 导入
    this.importInstance.addEventHandler("click", () => {
      const priceRule = that.$store.state.currentQuote.pricePlan.rule;
      const splitRule = that.$store.state.currentQuote.splitPlan;
      this.$confirm({
        title: `导入内容`,
        okText: "确认",
        cancelText: "取消",
        centered: true,
        content: (h) => (
          <div style="color:red;">
            你现在选择的是<span style="color:green;">{priceRule}</span>的价格，
            <span style="color:green;">{splitRule}</span>
            的拆分，确认导入数据吗？?
          </div>
        ),
        onOk() {
          that.$bus.$emit("import");
        },
        onCancel() {},
        class: "test",
      });
    });
    // 匹配阀门风口
    this.handlerInstance.addEventHandler("click", () => {
      that.$bus.$emit("handler");
    });
    // 数据导出
    this.exportInstance.addEventHandler("click", () => {
      that.$bus.$emit("export");
    });
    // 批量添加控制箱
    this.addControlBoxInstance.addEventHandler("click", () => {
      this.showAddControlBox = !this.showAddControlBox;
    });
    // 价格方案选择
    this.priceRuleInstance.addEventHandler("select", (event) => {
      const pricePlan = {
        rule: event.args.item.label,
        id: event.args.item.value,
      };
      this.$store.dispatch("saveCurrentQuotePricePlan", pricePlan);
    });
    this.priceRuleInstance.selectIndex(0);
    // 拆分方案选择
    this.splitRuleInstance.addEventHandler("select", (event) => {
      const rule = event.args.item.label;
      this.$store.dispatch("saveCurrentQuoteSplitPlan", rule);
    });
    this.splitRuleInstance.selectIndex(0);
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      if (index != this.toolsIndex) {
        const that = this;
        switch (index) {
          case 0:
            let container = document.createElement("div");
            container.id = "container";
            container.style.cssText =
              "overflow: hidden; position: relative;margin-top:1px";
            tool[0].appendChild(container);
            let uploaderComponent = Vue.extend(CustomUploader);
            that.uploaderInstance = new uploaderComponent({
              propsData: {
                width: 190,
                height: 25,
                type: "jqxInput",
                showUploadButton: true,
                fieldsCofig: {
                  fields: {
                    serialNumber: "A",
                    productName: "B",
                    specModel: "C",
                    unit: "D",
                    quantity: "E",
                    unitPrice: "F",
                    totalPrice: "G",
                    remark: "H",
                    selection: "I",
                    transfer: "J",
                    formula: "K",
                    designateType: "L",
                  },
                },
              },
            }).$mount("#container");
            break;
          case 1:
            const buttonGroup = document.createElement("div");
            buttonGroup.style.cssText =
              "overflow: hidden; position: relative;display:flex";
            tool[0].appendChild(buttonGroup);
            const importButton = document.createElement("div");
            importButton.id = "importButton";
            importButton.style.cssText = "margin-right:5px;cursor: pointer;";

            const proccessButton = document.createElement("div");
            proccessButton.id = "proccessButton";
            proccessButton.style.cssText = "margin-right:5px;cursor: pointer;";

            const exportButton = document.createElement("div");
            exportButton.id = "exportButton";
            exportButton.style.cssText = "margin-right:5px;cursor: pointer;";

            buttonGroup.appendChild(importButton);
            buttonGroup.appendChild(proccessButton);
            buttonGroup.appendChild(exportButton);

            that.importInstance = jqwidgets.createInstance(
              "#importButton",
              "jqxButton",
              {
                imgSrc: require("@/assets/iconfont/custom/import.svg"),
              }
            );
            jqwidgets.createInstance("#importButton", "jqxTooltip", {
              content: "导入数据",
              position: "mouse",
            });

            that.handlerInstance = jqwidgets.createInstance(
              "#proccessButton",
              "jqxButton",
              {
                imgSrc: require("@/assets/iconfont/custom/process.svg"),
              }
            );
            jqwidgets.createInstance("#proccessButton", "jqxTooltip", {
              content: "匹配价格",
              position: "mouse",
            });

            that.exportInstance = jqwidgets.createInstance(
              "#exportButton",
              "jqxButton",
              {
                imgSrc: require("@/assets/iconfont/custom/export.svg"),
              }
            );
            jqwidgets.createInstance("#exportButton", "jqxTooltip", {
              content: "导出数据",
              position: "mouse",
            });
            break;
          case 2:
            tool[0].style.cssText = "margin-left:10%;";

            const addControlBoxContainer = document.createElement("div");
            addControlBoxContainer.style.cssText =
              "display:inline-block;vertical-align: middle;cursor: pointer;";
            addControlBoxContainer.id = "addControlBox";
            tool[0].appendChild(addControlBoxContainer);
            jqwidgets.createInstance("#addControlBox", "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/box.svg"),
            });
            that.addControlBoxInstance = jqwidgets.createInstance(
              "#addControlBox",
              "jqxTooltip",
              {
                content: "添加控制箱",
                position: "mouse",
              }
            );
            break;
          case 3:
            tool[0].style.cssText = "margin-left:10%;";
            container = document.createElement("div");
            container.style.cssText =
              "overflow: hidden; position: relative;display:flex";
            tool[0].appendChild(container);
            // 固定金额浮动
            const fixedFloatContainer = document.createElement("input");
            fixedFloatContainer.style.cssText = "margin-right:5px;";
            fixedFloatContainer.id = "fixedFloat";
            container.appendChild(fixedFloatContainer);
            jqwidgets.createInstance("#fixedFloat", "jqxInput", {
              width: 80,
              height: 25,
              placeHolder: "输入金额",
            });
            // 固定金额浮动按钮
            const fixedFloatBtnContainer = document.createElement("div");
            fixedFloatBtnContainer.style.cssText =
              "cursor: pointer;margin-right:5px;";
            fixedFloatBtnContainer.id = "fixedFloatBtn";
            container.appendChild(fixedFloatBtnContainer);

            jqwidgets.createInstance("#fixedFloatBtn", "jqxButton", {
              width: 25,
              height: 25,
              imgSrc: require("@/assets/iconfont/custom/digital.svg"),
            });

            jqwidgets.createInstance("#fixedFloatBtn", "jqxTooltip", {
              content: "固定金额比例浮动",
              position: "mouse",
            });
            // 加点
            const addPointNumberContainer = document.createElement("div");
            addPointNumberContainer.style.cssText = "margin-right:5px;";
            addPointNumberContainer.id = "addPointNumber";
            container.appendChild(addPointNumberContainer);
            jqwidgets.createInstance("#addPointNumber", "jqxNumberInput", {
              width: 80,
              inputMode: "simple",
              spinButtons: true,
            });

            // 加点按钮
            const addPointBtnContainer = document.createElement("div");
            addPointBtnContainer.style.cssText =
              "margin-right:5px;cursor: pointer;";
            addPointBtnContainer.id = "addPointBtn";
            container.appendChild(addPointBtnContainer);
            jqwidgets.createInstance("#addPointBtn", "jqxButton", {
              width: 25,
              height: 25,
              imgSrc: require("@/assets/iconfont/custom/rate.svg"),
            });
            break;
          case 4:
            tool[0].style.cssText = "float:right;";
            const planContainer = document.createElement("div");
            planContainer.style.cssText =
              "overflow: hidden; position: relative;display:flex;";
            tool[0].appendChild(planContainer);

            let pricePlanSelector = document.createElement("div");
            pricePlanSelector.id = "pricePlan";
            pricePlanSelector.style.cssText =
              "margin-right:5px;cursor:pointer;";

            let splitPlanSelector = document.createElement("div");
            splitPlanSelector.id = "splitPlan";
            splitPlanSelector.style.cssText =
              "margin-right:5px;cursor:pointer;";

            planContainer.appendChild(pricePlanSelector);
            planContainer.appendChild(splitPlanSelector);

            that.priceRuleInstance = jqwidgets.createInstance(
              "#pricePlan",
              "jqxComboBox",
              {
                source: that.$store.state.pricePlan,
                width: 150,
                displayMember: "rule",
                valueMember: "id",
              }
            );
            jqwidgets.createInstance("#pricePlan", "jqxTooltip", {
              content: "价格方案",
              position: "bottom",
            });

            that.splitRuleInstance = jqwidgets.createInstance(
              "#splitPlan",
              "jqxComboBox",
              {
                source: that.$store.state.splitPlan,
                width: 150,
                displayMember: "rule",
                valueMember: "rule",
              }
            );
            jqwidgets.createInstance("#splitPlan", "jqxTooltip", {
              content: "拆分方案",
              position: "bottom",
            });
            break;
        }
        this.toolsIndex = index;
      }
    },
  }
};
</script>

<style scoped>
::v-deep [data-v-21b000b6] .jqx-widget-content {
  overflow: hidden;
}
</style>