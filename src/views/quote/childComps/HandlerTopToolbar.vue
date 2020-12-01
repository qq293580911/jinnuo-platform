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
  </div>
</template>

<script>
import Vue from "vue";
import JqxToolbar from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue";

import CustomUploader from "@/components/common/CustomUploader";
export default {
  components: {
    JqxToolbar,
  },
  data() {
    return {
      tools: "custom | custom | custom | custom | custom",
      toolsIndex: -1,
    };
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      if (index != this.toolsIndex) {
        switch (index) {
          case 0:
            let container = document.createElement("div");
            container.id = "container";
            container.style.cssText =
              "overflow: hidden; position: relative;margin-top:1px";
            tool[0].appendChild(container);
            let uploaderComponent = Vue.extend(CustomUploader);
            let uploaderInstance = new uploaderComponent({
              propsData: {
                width: 190,
                height: 25,
                type: "jqxInput",
                showUploadButton: true,
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

            jqwidgets.createInstance("#importButton", "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/import.svg"),
            });
            jqwidgets.createInstance("#importButton", "jqxTooltip", {
              content: "导入数据",
              position: "mouse",
            });

            jqwidgets.createInstance("#proccessButton", "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/process.svg"),
            });
            jqwidgets.createInstance("#proccessButton", "jqxTooltip", {
              content: "匹配价格",
              position: "mouse",
            });

            jqwidgets.createInstance("#exportButton", "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/export.svg"),
            });
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
            jqwidgets.createInstance("#addControlBox", "jqxTooltip", {
              content: "添加控制箱",
              position: "mouse",
            });
            break;
          case 3:
            tool[0].style.cssText = "margin-left:5%;";
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
              height: 25,
              inputMode: "simple",
              spinButtons: true,
            });

            // 加点按钮
            const addPointBtnContainer = document.createElement("div");
            addPointBtnContainer.style.cssText = "margin-right:5px;cursor: pointer;";
            addPointBtnContainer.id = "addPointBtn";
            container.appendChild(addPointBtnContainer);
            jqwidgets.createInstance("#addPointBtn", "jqxButton", {
              width: 25,
              height: 25,
              imgSrc: require("@/assets/iconfont/custom/rate.svg"),
            });
            break;
            break;
          case 4:
            tool[0].style.cssText = "float:right;";
            const planContainer = document.createElement("div");
            planContainer.style.cssText =
              "overflow: hidden; position: relative;display:flex;";
            tool[0].appendChild(planContainer);

            let pricePlanSelector = document.createElement("div");
            pricePlanSelector.id = "pricePlan";
            pricePlanSelector.style.cssText = "margin-right:5px;";

            let splitPlanSelector = document.createElement("div");
            splitPlanSelector.id = "splitPlan";

            planContainer.appendChild(pricePlanSelector);
            planContainer.appendChild(splitPlanSelector);

            jqwidgets.createInstance("#pricePlan", "jqxComboBox", {
              source: ["价格1", "价格2"],
              width: 100,
            });

            jqwidgets.createInstance("#splitPlan", "jqxComboBox", {
              source: ["拆分1", "拆分2"],
              width: 100,
            });
            break;
        }
        this.toolsIndex = index;
      }
    },
  },
};
</script>

<style>
</style>