<template>
  <div class="base-tab-content-element">
    <JqxToolbar
      :width="'100%'"
      :height="35"
      :rtl="false"
      :tools="topTools"
      :initTools="initTopTools"
    >
    </JqxToolbar>
    <JqxToolbar
      :width="'100%'"
      :height="35"
      :rtl="false"
      :tools="bottomTools"
      :initTools="initBottomTools"
    >
    </JqxToolbar>
    <JqxLayout :width="'100%'" class="layout" :layout="layout">
      <!-- 左 -->
      <div data-container="LeftPanel">左</div>
      <!-- 中 -->
      <div data-container="CenterPanel"  style=" overflow: hidden;">
        <div id="mainGrid"></div>
      </div>
      <!-- 右 -->
      <div data-container="RightPanel">
        <!-- 风机选型 -->
        <div data-container="machineSelectionPanel">
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="machineSelectionGridTop"></div>
          </JqxPanel>
          <JqxPanel :width="'100%'" :height="'50%'" style="border-style: none">
            <div id="machineSelectionGridBottom"></div>
          </JqxPanel>
        </div>
        <!-- 控制箱选型 -->
        <div data-container="controlBoxSelectionPanel">
          <!-- <div id="controlBoxSelectionPanelTop">
            <div id="controlBoxSelectionGridTop"></div>
          </div>
          <div id="controlBoxSelectionPanelBottom">
            <div id="controlBoxSelectionGridBottom"></div>
          </div> -->
        </div>
      </div>
    </JqxLayout>
  </div>
</template>

<script>
import Vue from "vue";
import JqxToolbar from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue";
import JqxSwitchButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxswitchbutton.vue";
import JqxLayout from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlayout.vue";
import JqxPanel from "jqwidgets-scripts/jqwidgets-vue/vue_jqxpanel.vue";

import CustomUploader from "@/components/common/CustomUploader";
import MainGrid from "./childComps/HandleMainGrid";
import MachineSelectionGridTop from "./childComps/MachineSelectionGridTop";
import MachineSelectionGridBottom from "./childComps/MachineSelectionGridBottom";
// import ControlBoxTopGrid from "./childComps/HandleSelectionGrid";
// import ControlBoxBottomGrid from "./childComps/HandleSelectionGrid";

import { getAssignType } from "@/network/product.js";
import { debounce } from "@/common/util.js";
export default {
  name: "QuoteHandle",
  components: {
    JqxToolbar,
    JqxSwitchButton,
    JqxLayout,
    JqxPanel,
  },
  data: function () {
    const that = this;
    return {
      // 工具栏
      topToolsIndex: -1,
      bottomToolsIndex: -1,
      topTools: "custom | custom | custom | custom",
      bottomTools: "custom | custom | custom | custom | custom | custom",
      toolsDataSource: {},
      // 布局
      layout: [
        {
          type: "layoutGroup",
          orientation: "horizontal",
          height: "100%",
          items: [
            {
              type: "autoHideGroup",
              alignment: "left",
              width: "5%",
              unpinnedWidth: "10%",
              items: [
                {
                  type: "layoutPanel",
                  title: "历史报价",
                  contentContainer: "LeftPanel",
                },
              ],
            },
            {
              type: "documentGroup",
              width: "75%",
              items: [
                {
                  type: "documentPanel",
                  title: "当前模板",
                  contentContainer: "CenterPanel",
                  initContent: function () {
                    let maiGridComponent = Vue.extend(MainGrid);
                    let maiGridInstance = new maiGridComponent({
                      // propsData: {
                      //   width: 190,
                      //   height: 25,
                      //   type: "jqxInput",
                      //   showUploadButton: true,
                      // },
                    }).$mount("#mainGrid");
                  },
                },
              ],
            },
            {
              type: "layoutGroup",
              orientation: "vertical",
              width: "20%",
              items: [
                {
                  type: "tabbedGroup",
                  height: "100%",
                  items: [
                    {
                      type: "layoutPanel",
                      title: "风机选型",
                      contentContainer: "machineSelectionPanel",
                      initContent: function () {

                        let TopComponent = Vue.extend(MachineSelectionGridTop);
                        new TopComponent(
                          {}
                        ).$mount("#machineSelectionGridTop");

                        let BottomComponent = Vue.extend(MachineSelectionGridBottom);
                        new BottomComponent(
                          {}
                        ).$mount("#machineSelectionGridBottom");
                        
                      },
                    },
                    {
                      type: "layoutPanel",
                      title: "控制箱选型",
                      contentContainer: "controlBoxSelectionPanel",
                      initContent: function () {
                        // layoutSource.controlBoxSelectionSource = {
                        //   dataFields: [
                        //     {
                        //       name: "machineName",
                        //       map: "pm_name",
                        //       type: "string",
                        //     },
                        //     {
                        //       name: "priceNonCcc",
                        //       map: "price_non_ccc",
                        //       type: "number",
                        //     },
                        //     {
                        //       name: "priceCcc",
                        //       map: "price_ccc",
                        //       type: "number",
                        //     },
                        //     { name: "power", map: "power", type: "string" },
                        //   ],
                        //   async: false,
                        //   type: "get",
                        //   dataType: "json",
                        // };
                        // var dataAdapter = new $.jqx.dataAdapter(
                        //   layoutSource.controlBoxSelectionSource
                        // );
                        // initElement.initControlBoxGrids.initTopGrid(
                        //   dataAdapter
                        // );
                        // initElement.initControlBoxGrids.initBottomGrid(
                        //   dataAdapter
                        // );
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    const atTree = document.getElementById("assignTypeTree");

    let tree = jqwidgets.createInstance(atTree, "jqxTree", {
      source: [
        {
          id: 1,
          parentid: 0,
          text: "节点1",
          items: [
            {
              id: 2,
              parentid: 1,
              text: "节点2",
            },
          ],
        },
      ],
      width: 158,
      height: 300,
    });

    // const source = {
    //   datatype: "json",
    //   datafields: [
    //     { name: "id", map: "at_id", type: "number" },
    //     { name: "parentid", map: "at_pid", type: "number" },
    //     { name: "text", map: "at_name", type: "string" },
    //     { name: "value", map: "at_id", type: "string" },
    //   ],
    //   id: "id",
    //   type: "json",
    //   url: "/productCateg/getAssignTypeData.do",
    // };
    // const dataAdapter = new jqx.dataAdapter(source, {
    //   loadServerData(serverdata, source, callback) {
    //     getAssignType(source.url, source, serverdata).then((res) => {
    //       callback({
    //         records: res.records,
    //       });
    //     });
    //   },
    //   beforeLoadComplete(records) {
    //     console.log(records);
    //     records = dataAdapter.getRecordsHierarchy("id", "parentid", "items", [
    //       { name: "text", map: "label" },
    //     ]);
    //     let tree = jqwidgets.createInstance("#assignTypeTree", "jqxTree", {
    //       source: records,
    //       width: 158,
    //       height: 300,
    //     });
    //   },
    // });
    // dataAdapter.dataBind();
  },
  methods: {
    initTopTools: function (type, index, tool, menuToolIninitialization) {
      if (index != this.topToolsIndex) {
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
            break;
          case 3:
            const planContainer = document.createElement("div");
            planContainer.style.cssText =
              "overflow: hidden; position: relative;display:flex;";
            tool[0].appendChild(planContainer);
            tool[0].style.cssText = "float:right;";
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
        this.topToolsIndex = index;
      }
    },
    initBottomTools: function (type, index, tool, menuToolIninitialization) {
      if (index != this.bottomToolsIndex) {
        switch (index) {
          case 0:
            const dropDownButton = document.createElement("div");
            tool[0].appendChild(dropDownButton);

            const tree = document.createElement("div");
            tree.style.cssText = "border: none;";
            tree.id = "assignTypeTree";
            dropDownButton.appendChild(tree);

            jqwidgets.createInstance(dropDownButton, "jqxDropDownButton", {
              width: 161,
            });
            break;
          case 1:
            const assignContainer = document.createElement("div");
            assignContainer.style.cssText = "cursor: pointer;";
            assignContainer.id = "assign";
            tool[0].appendChild(assignContainer);
            jqwidgets.createInstance("#assign", "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/specify.svg"),
            });
            jqwidgets.createInstance("#assign", "jqxTooltip", {
              content: "指派类型",
              position: "mouse",
            });
            break;
          case 2:
            const filterContainer = document.createElement("div");
            filterContainer.style.cssText = "cursor: pointer;";
            filterContainer.id = "filter";
            tool[0].appendChild(filterContainer);
            jqwidgets.createInstance("#filter", "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/filter.svg"),
            });
            jqwidgets.createInstance("#filter", "jqxTooltip", {
              content: "筛选",
              position: "mouse",
            });
            break;
          case 3:
            tool[0].style.cssText = "margin-left:10%;";

            const addPointContainer = document.createElement("div");
            addPointContainer.style.cssText =
              "overflow: hidden; position: relative;display:flex;align-items: center;";
            tool[0].appendChild(addPointContainer);
            const numberInput = document.createElement("div");
            numberInput.id = "addPointNumber";
            addPointContainer.appendChild(numberInput);

            jqwidgets.createInstance(numberInput, "jqxNumberInput", {
              width: 80,
              inputMode: "simple",
              digits: 11,
              spinButtons: true,
              decimalDigits: 2,
            });

            const addPointButton = document.createElement("div");
            addPointButton.style.cssText = "margin-left:5px;cursor: pointer;";
            addPointButton.id = "addPointButton";
            addPointContainer.appendChild(addPointButton);
            jqwidgets.createInstance("#addPointButton", "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/rate.svg"),
            });
            jqwidgets.createInstance("#addPointButton", "jqxTooltip", {
              content: "加点",
              position: "mouse",
            });
            break;
          case 4:
            tool[0].style.cssText = "margin-left:10%;";
            const machineSelectionContainer = document.createElement("div");
            machineSelectionContainer.style.cssText =
              "overflow: hidden; position: relative;display:flex;align-items: center;";
            tool[0].appendChild(machineSelectionContainer);
            // 文本
            let text = document.createElement("span");
            text.innerHTML = "风机选型：";
            machineSelectionContainer.appendChild(text);
            // 标准规格
            const standard = document.createElement("div");
            machineSelectionContainer.appendChild(standard);
            jqwidgets.createInstance(standard, "jqxSwitchButton", {
              width: 50,
              height: 23,
              onLabel: "开",
              offLabel: "关",
              thumbSize: "50%",
              checked: false,
            });
            jqwidgets.createInstance(standard, "jqxTooltip", {
              content: "开启可以选择混流型风机",
              position: "mouse",
            });
            // 机号
            const modelNumber = document.createElement("input");
            modelNumber.style.cssText = "margin-left:5px;";
            modelNumber.id = "modelNumber";
            modelNumber.type = "text";
            machineSelectionContainer.appendChild(modelNumber);
            jqwidgets.createInstance(modelNumber, "jqxInput", {
              width: 50,
              height: 25,
              placeHolder: "型号#",
            });
            // 设备类型
            const machineType = document.createElement("div");
            machineType.style.cssText = "margin-left:5px;";
            machineSelectionContainer.appendChild(machineType);
            jqwidgets.createInstance(machineType, "jqxComboBox", {
              width: 70,
              height: 25,
              source: ["圆机", "柜机"],
              promptText: "请选择...",
            });
            // 速度类型
            const speedType = document.createElement("div");
            speedType.style.cssText = "margin-left:5px;";
            machineSelectionContainer.appendChild(speedType);
            jqwidgets.createInstance(speedType, "jqxComboBox", {
              width: 70,
              height: 25,
              source: ["单速", "双速"],
              promptText: "请选择...",
            });
            // 风量
            const airVolume = document.createElement("input");
            airVolume.style.cssText = "margin-left:5px;";
            machineSelectionContainer.appendChild(airVolume);
            jqwidgets.createInstance(airVolume, "jqxInput", {
              width: 80,
              height: 25,
              placeHolder: "风量：m³/h",
            });
            // 功率
            const machinePower = document.createElement("input");
            machinePower.style.cssText = "margin-left:5px;";
            machineSelectionContainer.appendChild(machinePower);
            jqwidgets.createInstance(machinePower, "jqxInput", {
              width: 80,
              height: 25,
              placeHolder: "功率：kw",
            });
            // 普通选型
            const normalSelection = document.createElement("div");
            normalSelection.style.cssText = "margin-left:5px;cursor: pointer;";
            normalSelection.id = "normalSelection";
            machineSelectionContainer.appendChild(normalSelection);
            jqwidgets.createInstance(normalSelection, "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/confirm.svg"),
            });
            jqwidgets.createInstance("#normalSelection", "jqxTooltip", {
              content: "选常规机",
              position: "mouse",
            });
            // 外购选型
            const outsource = document.createElement("div");
            outsource.style.cssText = "margin-left:5px;cursor: pointer;";
            outsource.id = "outsource";
            machineSelectionContainer.appendChild(outsource);
            jqwidgets.createInstance(outsource, "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/outsource.svg"),
            });
            jqwidgets.createInstance("#outsource", "jqxTooltip", {
              content: "选外购机",
              position: "mouse",
            });
            break;
          case 5:
            tool[0].style.cssText = "float:right;";
            const cotrolBoxContainer = document.createElement("div");
            cotrolBoxContainer.style.cssText =
              "overflow: hidden; position: relative;display:flex;align-items: center;";
            tool[0].appendChild(cotrolBoxContainer);
            // 控制箱选型文本
            text = document.createElement("span");
            text.innerHTML = "控制箱选型：";
            cotrolBoxContainer.appendChild(text);

            // 电源类型
            const controlBoxPowerType = document.createElement("div");
            controlBoxPowerType.style.cssText = "margin-left:5px;";
            cotrolBoxContainer.appendChild(controlBoxPowerType);
            jqwidgets.createInstance(controlBoxPowerType, "jqxComboBox", {
              width: 70,
              height: 25,
              source: ["单电源", "双电源"],
              selectedIndex: 0,
            });
            // 功率
            const controlBoxPower = document.createElement("input");
            controlBoxPower.type = "text";
            controlBoxPower.style.cssText = "margin-left:5px;";
            cotrolBoxContainer.appendChild(controlBoxPower);
            jqwidgets.createInstance(controlBoxPower, "jqxInput", {
              width: 80,
              height: 25,
              placeHolder: "功率：kw",
            });
            // 选型
            const controlBoxSelection = document.createElement("div");
            controlBoxSelection.style.cssText =
              "margin-left:5px;cursor: pointer;";
            controlBoxSelection.id = "controlBoxSelection";
            cotrolBoxContainer.appendChild(controlBoxSelection);
            jqwidgets.createInstance(controlBoxSelection, "jqxButton", {
              imgSrc: require("@/assets/iconfont/custom/confirm.svg"),
            });
            jqwidgets.createInstance("#controlBoxSelection", "jqxTooltip", {
              content: "选控制箱",
              position: "mouse",
            });
            break;
        }
        this.bottomToolsIndex = index;
      }
    },
  },
};
</script>

<style scoped>

.layout {
  height: calc(100vh - 170px);
}

</style>