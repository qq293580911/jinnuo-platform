<template>
  <JqxWindow
    ref="myWindow"
    :width="'400px'"
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
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxValidator from "jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";
// import jqxDropDownButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdropdownbutton.vue";
// import jqxTree from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue";
// import jqxNumberInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxnumberinput.vue";
// import jqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";

import { Message, ADD_PRODUCT, EDIT_PRODUCT } from "common/const.js";

import {
  getCategory,
  addMachineProduct,
  updateMachineProduct
} from "@/network/product.js";
export default {
  name: "MachineWindow",
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm
    // jqxDropDownButton,
    // jqxTree,
    // jqxNumberInput,
  },
  beforeCreate() {
    this.dropDownButtonID = JQXLite.generateID();
    this.treeID = JQXLite.generateID();
  },
  created() {},
  data() {
    const that = this;
    return {
      template: [
        {
          name: "name",
          type: "text",
          label: "设备名称",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px"
        },
        {
          name: "model",
          type: "text",
          label: "设备型号",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px"
        },
        {
          name: "category",
          type: "custom",
          label: "设备类型",
          labelWidth: "80px",
          required: true,
          rowHeight: "40px",
          init: function(component) {
            // 按钮
            const dropDownButtonContainer = document.createElement("div");
            dropDownButtonContainer.id = that.dropDownButtonID;
            component[0].appendChild(dropDownButtonContainer);
            // 树
            const treeContainer = document.createElement("div");
            const treeID = JQXLite.generateID();
            treeContainer.id = that.treeID;
            treeContainer.style.cssText = "border: none;";
            dropDownButtonContainer.appendChild(treeContainer);

            that.dropDownButtonInstance = jqwidgets.createInstance(
              `#${that.dropDownButtonID}`,
              "jqxDropDownButton",
              {
                width: 250,
                height: 30
              }
            );

            const source = {
              datatype: "json",
              dataFields: [
                { name: "id", type: "number" },
                { name: "parentid", type: "number" },
                { name: "text", type: "string" }
              ],
              localdata: that.$store.state.productType.records
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
                  map: "label"
                }
              ]
            );

            that.treeInstance = jqwidgets.createInstance(
              `#${that.treeID}`,
              "jqxTree",
              {
                source: records,
                width: 250,
                height: 250
              }
            );

            // 树绑定选择事件
            that.treeInstance.addEventHandler("select", (event) => {
              const selectedItem = that.treeInstance.getSelectedItem();
              // 不能选择包含儿子的节点
              if (selectedItem.hasItems) {
                that.$message.warning(Message.UNSELECTABLE_NODE);
                return false;
              }
              // 设置文本内容到dorpDownButton
              const dropDownContent =
                '<div style="position: relative; margin-left: 3px; line-height: 30px;">' +
                selectedItem.label +
                "</div>";
              that.dropDownButtonInstance.setContent(dropDownContent);
              that.dropDownButtonInstance.close();
            });
          }
        },
        {
          name: "minAirVolume",
          label: "最低风量",
          type: "custom",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          init: function(component) {
            that.minAirVolumeInstance = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true
              }
            );
          }
        },
        {
          name: "maxAirVolume",
          label: "最高风量",
          type: "custom",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          init: function(component) {
            that.maxAirVolumeInstance = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true
              }
            );
          }
        },
        {
          name: "power",
          label: "设备功率",
          type: "text",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          info: "输入产品功率",
          infoPosition: "right"
        },
        {
          name: "unit",
          label: "计量单位",
          type: "custom",
          labelWidth: "80px",
          required: true,
          rowHeight: "40px",
          init: function(component) {
            that.unitInstance = jqwidgets.createInstance(
              component,
              "jqxDropDownList",
              {
                source: ["台"],
                width: 250,
                height: 30,
                selectedIndex: 0
              }
            );
          }
        },
        {
          name: "remark",
          label: "备注",
          type: "text",
          labelWidth: "80px",
          width: "250px",
          required: false,
          rowHeight: "40px"
        },
        {
          columns: [
            {
              name: "submitButton",
              type: "button",
              text: "提交",
              width: "60px",
              rowHeight: "50px",
              align: "right",
              columnWidth: "50%"
            },
            {
              name: "cancelButton",
              type: "button",
              text: "取消",
              width: "60px",
              rowHeight: "50px",
              columnWidth: "50%"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    const that = this;
    // 获取组件对象
    const $name = this.$refs.myForm.getComponentByName("name");
    const $model = this.$refs.myForm.getComponentByName("model");
    const $category = this.$refs.myForm.getComponentByName("category");
    const $unit = this.$refs.myForm.getComponentByName("unit");
    const $power = this.$refs.myForm.getComponentByName("power");
    const $remark = this.$refs.myForm.getComponentByName("remark");

    this.machineNameInsatnce = $name;
    this.machineModelInsatnce = $model;
    this.unitInstance = $unit;
    this.powerInstance = $power;
    this.remarkInstance = $remark;

    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $name,
        message: "该项必填",
        action: "input,blur",
        rule: "required"
      },
      {
        input: `#${that.dropDownButtonID}`,
        message: "该项必选",
        action: "close",
        rule: function(input) {
          return input[0].textContent != "";
        }
      },
      {
        input: $unit,
        message: "该项必选",
        action: "select",
        rule: function(input) {
          return input[0].textContent != "";
        }
      },
      {
        input: $power,
        message: "该项必填",
        action: "input,blur",
        rule: "required"
      }
    ];
    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName("submitButton");
    confirmBtn[0].addEventListener("click", (event) => {
      this.$refs.myValidator.validate(document.getElementById("myForm"));
    });
  },
  methods: {
    open(...params) {
      const that = this;
      this.$refs.myWindow.setTitle(params[0]);
      this.clearForm();
      if (params[0] == EDIT_PRODUCT) {
        const data = params[1];
        this.id = data["pm_id"];
        this.machineNameInsatnce.val(data["pm_name"]);
        this.machineModelInsatnce.val(data["model"]);
        const items = this.treeInstance.getItems();
        for (let i = 0; i < items.length; i++) {
          if (items[i].id == data["pc_id"]) {
            const element = items[i].element;
            this.treeInstance.selectItem(element);
            this.treeInstance.expandItem(element);
            break;
          }
        }
        this.minAirVolumeInstance.val(data["min_air_volume"]);
        this.maxAirVolumeInstance.val(data["max_air_volume"]);
        this.powerInstance.val(data["power"]);
        this.unitInstance.jqxDropDownList("selectItem", data["unit"]);
        this.remarkInstance.val(data["remark"]);
      }
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title;
      const formData = {
        pm_name: this.machineNameInsatnce.val(),
        model: this.machineModelInsatnce.val(),
        pc_id: this.treeInstance.getSelectedItem().id,
        min_air_volume: this.minAirVolumeInstance.val(),
        max_air_volume: this.maxAirVolumeInstance.val(),
        power: this.powerInstance.val(),
        unit: this.unitInstance.val(),
        remark: this.remarkInstance.val(),
        pm_id: this.id
      };

      if (title == EDIT_PRODUCT) {
        this.update(formData);
      } else {
        this.add(formData);
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      addMachineProduct(params).then((res) => {
        this.$refs.myWindow.close();
        // 提醒父组件刷新网格
        this.$parent.refresh();
        this.clearForm();
      });
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      updateMachineProduct(params).then((res) => {
        this.$refs.myWindow.close();
        // 提醒父组件刷新网格
        this.$parent.refresh();
        this.clearForm();
      });
    },
    clearForm() {
      // 重置部件设置
      this.machineNameInsatnce.val("");
      this.machineModelInsatnce.val("");
      this.dropDownButtonInstance.setContent("");
      this.treeInstance.selectItem(null);
      this.minAirVolumeInstance.setDecimal(0);
      this.maxAirVolumeInstance.setDecimal(0);
      this.powerInstance.val("");
      this.remarkInstance.val("");
    }
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  }
};
</script>

<style scoped>
</style>
