<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :height="'320px'"
      :autoOpen="false"
      :position="{ x: '40%', y: '30%' }"
    >
      <div>
        <JqxValidator
          ref="myValidator"
          @validationSuccess="onValidationSuccess($event)"
        >
          <JqxForm ref="myForm" :template="template"> </JqxForm>
        </JqxValidator>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxValidator from "jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";

import { getEmployeePosition, assignPosition } from "@/network/employee.js";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: "id", type: "number" },
        { name: "posId", map: "pos_id", type: "number" },
        { name: "posName", map: "pos_name", type: "string" },
        { name: "empId", map: "emp_id", type: "number" },
        { name: "enable", type: "number" }
      ],
      url: "/emp/getEmployeePositionList.do",
      type: "get",
      dataType: "json"
    };
  },
  data() {
    return {
      template: [
        {
          name: "id",
          type: "custom",
          width: "250px",
          rowHeight: "210px",
          init: function(component) {
            const div = document.createElement("div");
            div.id = "positionId";
            component[0].appendChild(div);
          }
        },
        {
          name: "empId",
          bind: "empId",
          type: "custom",
          init: function(component) {
            component.append('<input type="hidden" id="empId"/>');
          }
        },
        {
          name: "submitButton",
          type: "button",
          text: "提交",
          width: "60px",
          rowHeight: "50px",
          align: "center"
        }
      ]
    };
  },
  mounted() {
    const myForm = this.$refs.myForm;
    const $btn = myForm.getComponentByName("submitButton");
    $btn[0].addEventListener("click", () => {
      const items = this.listBoxInstance.getItems();
      const arr = items.map((item) => {
        if (item["checked"] == true) {
          item["originalItem"]["enable"] = 1;
        } else {
          item["originalItem"]["enable"] = 0;
        }
        return item["originalItem"];
      });

      const params = {
        jsonParams: JSON.stringify({
          items: arr,
          empId: this.empId
        })
      };

      assignPosition(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    });
  },
  methods: {
    open(...params) {
      const that = this;
      this.$refs.myWindow.setTitle(params[0]);
      const empId = params[1];
      this.empId = empId;
      const dataAdapter = new jqx.dataAdapter(this.source, {
        loadServerData(serverdata, source, callback) {
          const params = {
            jsonParams: JSON.stringify({
              empId
            })
          };
          getEmployeePosition(source.url, source, params).then((res) => {
            callback({
              records: res.records
            });
          });
        },
        beforeLoadComplete(records) {
          const element = document.getElementById("positionId");
          that.listBoxInstance = jqwidgets.createInstance(
            element,
            "jqxListBox",
            {
              source: records,
              checkboxes: true,
              width: "100%",
              height: 200,
              displayMember: "posName",
              valueMember: "posId"
            }
          );
        },
        loadComplete(records) {
          records.records.forEach((item, index) => {
            if (item.enable) {
              that.listBoxInstance.checkIndex(index);
            }
          });
        }
      });

      dataAdapter.dataBind();

      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {}
  }
};
</script>

<style>
</style>
