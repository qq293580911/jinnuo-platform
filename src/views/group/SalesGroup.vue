<template>
  <div class="base-tab-content-element">
    <JqxToolbar
      :width="'100%'"
      :height="35"
      :rtl="false"
      :tools="tools"
      :initTools="initTools"
    >
    </JqxToolbar>
    <JqxPanel :width="'100%'" :height="'100%'">
      <div>
        <JqxDocking
          ref="myDocking"
          :width="'100%'"
          :orientation="'horizontal'"
          :mode="'default'"
          v-if="groups.length > 0"
        >
          <div
            v-for="(items, index) in groups"
            :key="index"
            :id="'panel' + index"
            style="height: 150px"
          >
            <div v-for="(item, index) in items">
              <div>{{ item.name }}</div>
              <div>
                <JqxListBox
                  style="float: left"
                  :source="item.group"
                  :width="'100%'"
                  :height="'100%'"
                  :allowDrop="true"
                  :allowDrag="true"
                  :displayMember="'emp_name'"
                  :valueMember="'emp_id'"
                >
                </JqxListBox>
              </div>
            </div>
          </div>
        </JqxDocking>
      </div>
    </JqxPanel>
  </div>
</template>

<script>
import JqxToolbar from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue";
import JqxPanel from "jqwidgets-scripts/jqwidgets-vue/vue_jqxpanel.vue";
import JqxDocking from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdocking.vue";
import JqxListBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxlistbox.vue";

import { getSalesGroupList } from "@/network/group.js";
export default {
  name: "Test",
  components: {
    JqxToolbar,
    JqxPanel,
    JqxDocking,
    JqxListBox,
  },
  beforeCreate() {
    this.count = 5;
  },
  created() {
    this.renderData();
  },
  data() {
    return {
      toolsIndex: -1,
      tools: "custom",
      groups: [],
    };
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      if (index != this.toolsIndex) {
        switch (index) {
          case 0:
            let addButtonContainer = document.createElement("div");
            addButtonContainer.id = "addButton";
            addButtonContainer.style.cssText =
              "overflow: hidden; position: relative;";
            tool[0].appendChild(addButtonContainer);
            this.addGroupInstance = jqwidgets.createInstance(
              "#addButton",
              "jqxButton",
              {
                imgSrc: require("@/assets/iconfont/custom/add-circle.svg"),
              }
            );

            jqwidgets.createInstance("#addButton", "jqxTooltip", {
              content: "添加新团队",
              position: "mouse",
            });

            break;
        }

        this.toolsIndex = index;
      }
    },
    renderData() {
      getSalesGroupList().then((res) => {
        const list = [];
        for (let key in res) {
          const map = {};
          map.name = key;
          map.group = res[key];
          list.push(map);
        }
        for (let i = 0; i < this.count; i++) {
          const docks = list.filter((item, index) => {
            if (index % this.count == i) {
              return item;
            }
          });
          this.groups.push(docks);
        }
      });
    },
    // onDragStart: function (event) {},
    // onDragEnd: function (event) {
    //   if (event.args.label) {
    //     let ev = event.args.originalEvent;
    //     let x = ev.pageX;
    //     let y = ev.pageY;
    //     if (
    //       event.args.originalEvent &&
    //       event.args.originalEvent.originalEvent &&
    //       event.args.originalEvent.originalEvent.touches
    //     ) {
    //       let touch = event.args.originalEvent.originalEvent.changedTouches[0];
    //       x = touch.pageX;
    //       y = touch.pageY;
    //     }
    //     let textareaElement = this.$refs.myTextArea.$el.parentElement;
    //     let width = textareaElement.offsetWidth;
    //     let height = textareaElement.offsetHeight;
    //     let right = parseInt(textareaElement.offsetLeft) + width;
    //     let bottom = parseInt(textareaElement.offsetTop) + height;
    //     if (x >= parseInt(textareaElement.offsetLeft) && x <= right) {
    //       if (y >= parseInt(textareaElement.offsetTop) && y <= bottom) {
    //         this.$refs.myTextArea.val(event.args.label);
    //       }
    //     }
    //   }
    // },
    // dragStart: function (item) {
    //   if (item.label == "Breve") {
    //     return false;
    //   }
    // },
    // dragEnd: function (dragItem, dropItem) {
    //   if (dragItem.label == "Frappuccino") return false;
    // },
  },
};
</script>

<style scoped>
</style>