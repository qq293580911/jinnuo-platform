<template>
  <div>
    <JqxToolbar
      :width="'100%'"
      :height="35"
      :rtl="false"
      :tools="tools"
      :initTools="initTools"
      :minimizeWidth="500"
    >
    </JqxToolbar>
  </div>
</template>

<script>
import JqxToolbar from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue";
import { formatDate } from "@/common/util";
export default {
  components: {
    JqxToolbar,
  },
  data() {
    return {
      tools: "custom | custom | custom",
    };
  },
  created() {},
  mounted() {
    // 对象选择事件
    this.subjectInstance.addEventHandler("select", (event) => {
      const quoter = event.args.item.value;
      this.$emit("changeSubject", quoter);
    });
    // 开始日期值改变事件
    this.startDateInstance.addEventHandler("valueChanged", (event) => {
      const startDate = event.args.date.format("yyyy-MM-dd");
      this.$emit("changeStartDate", startDate);
    });
    // 结束日期值改变事件
    this.endDateInstance.addEventHandler("valueChanged", (event) => {
      const endDate = event.args.date.format("yyyy-MM-dd");
      this.$emit("changeEndDate", endDate);
    });
    // 日期类型
    this.dateModeInstance.addEventHandler("select", (event) => {
      const dateMode = event.args.item.value;
      this.$emit("changeDateMode", dateMode);
    });
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      if (menuToolIninitialization == false) {
        const that = this;
        switch (index) {
          case 0:
            const period = document.createElement("div");
            // 开始日期
            const startDateContainer = document.createElement("div");
            const startDateID = JQXLite.generateID();
            startDateContainer.id = startDateID;
            startDateContainer.style.cssText =
              "cursor: pointer;display:inline-block;vertical-align: middle;";
            period.appendChild(startDateContainer);
            // 区间符
            const joiner = document.createElement("span");
            joiner.style.cssText =
              "display:inline-block;vertical-align: middle;";
            joiner.innerHTML = "-";
            period.appendChild(joiner);
            // 结束日期
            const endDateContainer = document.createElement("div");
            const endDateID = JQXLite.generateID();
            endDateContainer.id = endDateID;
            endDateContainer.style.cssText =
              "cursor: pointer;display:inline-block;vertical-align: middle;";
            period.appendChild(endDateContainer);
            tool[0].appendChild(period);

            let date = new Date();
            //初始化开始日期选择框
            let startDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              1
            ).format("yyyy-MM-dd");

            that.startDateInstance = jqwidgets.createInstance(
              `#${startDateID}`,
              "jqxDateTimeInput",
              {
                width: 110,
                height: 25,
                culture: "ja-JP",
                formatString: "yyyy-MM-dd",
                value: new Date(startDate),
              }
            );
            // 初始化结束日期选择框
            let endDate = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            ).format("yyyy-MM-dd");
            that.endDateInstance = jqwidgets.createInstance(
              `#${endDateID}`,
              "jqxDateTimeInput",
              {
                width: 110,
                height: 25,
                culture: "ja-JP",
                formatString: "yyyy-MM-dd",
                value: new Date(endDate),
              }
            );
            break;
          case 1:
            const subjectContainer = document.createElement("div");
            const subjectID = JQXLite.generateID();
            subjectContainer.id = subjectID;
            subjectContainer.style.cssText = "cursor: pointer;";
            tool[0].appendChild(subjectContainer);

            that.subjectInstance = jqwidgets.createInstance(
              `#${subjectID}`,
              "jqxComboBox",
              {
                selectedIndex: 0,
                source: that.$store.state.quoters,
                width: 80,
                height: 25,
                displayMember: "emp_name",
                valueMember: "emp_id",
              }
            );
            break;
          case 2:
            const modelContainer = document.createElement("div");
            const modelID = JQXLite.generateID();
            modelContainer.id = modelID;
            modelContainer.style.cssText = "cursor: pointer;";
            tool[0].appendChild(modelContainer);
            that.dateModeInstance = jqwidgets.createInstance(
              `#${modelID}`,
              "jqxComboBox",
              {
                source: [
                  {
                    label: "按天数",
                    value: "days",
                  },
                  {
                    label: "按月份",
                    value: "months",
                  },
                  {
                    label: "按年份",
                    value: "years",
                  },
                ],
                width: 80,
                height: 23,
                displayMember: "label",
                valueMember: "value",
                selectedIndex: 0,
              }
            );
            break;
          default:
            break;
        }
      }
    },
  },
};
</script>

<style scoped>
</style>