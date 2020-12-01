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

import SelectionTool from "./SelectionTool";

import { getToolsCompsSource } from "@/network/quote.js";
export default {
  components: {
    JqxToolbar,
  },
  data() {
    return {
      toolsIndex: -1,
      tools: "custom | custom | custom | custom | custom | custom",
      comps: {}
    };
  },
  created() {
    getToolsCompsSource().then((res) => {
      this.comps = res;
    });
  },
  mounted() {},
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      const that = this;
      if (index != this.toolsIndex) {
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

            setTimeout(() => {
              const source = {
                datatype: "json",
                datafields: [
                  { name: "id" },
                  { name: "parentid", map: "pId" },
                  { name: "text", map: "name" },
                  { name: "value", map: "id" },
                ],
                id: "id",
                localdata: that.comps["assign_type"],
              };
              const dataAdapter = new jqx.dataAdapter(source);
              dataAdapter.dataBind();
              const records = dataAdapter.getRecordsHierarchy(
                "id",
                "parentid",
                "items",
                [
                  {
                    name: "text",
                    map: "label",
                  },
                ]
              );
              that.treeInstance = jqwidgets.createInstance(
                "#assignTypeTree",
                "jqxTree",
                {
                  source: records,
                  width: 158,
                  height: 300,
                }
              );
            }, 1000);

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
            tool[0].style.cssText = "float:right;";
            // 选型工具栏
            let container = document.createElement("div");
            container.id = "container";
            container.style.cssText =
              "overflow: hidden; position: relative;margin-top:1px";
            tool[0].appendChild(container);

            const SelectionToolComponent = Vue.extend(SelectionTool);
            that.selectionToolInstance = new SelectionToolComponent({
              propsData: {
                selectionType: "风机选型",
              },
            }).$mount("#container");
            break;
          case 4:
            tool[0].style.cssText = "float:right;";
            // 选型类型选择器
            const selectionSwitch = document.createElement("div");
            selectionSwitch.id = "selectionSwitch";
            tool[0].appendChild(selectionSwitch);
            const selectionType = jqwidgets.createInstance(
              "#selectionSwitch",
              "jqxDropDownList",
              {
                source: [
                  "常规风机",
                  "换气扇",
                  "控制箱",
                  "方形壁式风机",
                  "GDF管道离心风机",
                  "超静音送风机",
                  "边墙风机",
                  "边墙风机（防爆）",
                ],
                width: 150,
                height: 25,
                selectedIndex: 0,
              }
            );
            selectionType.addEventHandler("select", (event) => {
              const value = event.args.item.value;
              that.selectionToolInstance.selectionType = value;
            });
            break;

          default:
            break;
        }
        this.toolsIndex = index;
      }
    },
  },
};
</script>

<style scoped>
</style>