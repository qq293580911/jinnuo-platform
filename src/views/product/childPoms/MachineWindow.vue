<template>
  <JqxWindow
    ref="myWindow"
    :width="'400px'"
    :height="'390px'"
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
import jqxDropDownButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxdropdownbutton.vue";
import jqxTree from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue";
import jqxNumberInput from "jqwidgets-scripts/jqwidgets-vue/vue_jqxnumberinput.vue";
import jqxComboBox from "jqwidgets-scripts/jqwidgets-vue/vue_jqxcombobox.vue";

import {
  Message,
  ADD_MACHICNE_PRODUCT,
  EDIT_MACHINE_PRODUCT,
} from "common/const.js";

import {
  getCategory,
  addMachineProduct,
  updateMachineProduct,
} from "@/network/product.js";
export default {
  name: "MachineWindow",
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
    jqxDropDownButton,
    jqxTree,
    jqxNumberInput,
  },
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
          rowHeight: "40px",
          info: "输入产品名称",
          infoPosition: "right",
        },
        {
          name: "category",
          type: "custom",
          label: "设备类型",
          labelWidth: "80px",
          required: true,
          rowHeight: "40px",
          init: function (component) {
            // 按钮
            let dropDownButtonContainer = document.createElement("div");
            dropDownButtonContainer.id = "categoryButton";
            component[0].appendChild(dropDownButtonContainer);
            // 树
            let treeContainer = document.createElement("div");
            treeContainer.id = "pmPcId";
            treeContainer.style.cssText = "border: none;";
            dropDownButtonContainer.appendChild(treeContainer);

            that.categoryDropDownButtonInstance = jqwidgets.createInstance(
              "#categoryButton",
              "jqxDropDownButton",
              {
                width: 250,
                height: 30,
              }
            );

            const source = {
              dataFields: [
                { name: "id", map: "pc_id", type: "number" },
                { name: "pId", map: "pc_pid", type: "string" },
                { name: "name", map: "pc_name", type: "string" },
              ],
              url: "/productCateg/getAllProductCategory.do",
              datatype: "json",
            };

            const dataAdapter = new jqx.dataAdapter(source, {
              loadServerData(serverdata, source, callback) {
                getCategory(source.url, source, serverdata).then((res) => {
                  callback({
                    originaldata: res,
                    records: res.records,
                  });
                });
              },
              loadComplete(records) {
                records = dataAdapter.getRecordsHierarchy(
                  "id",
                  "pId",
                  "items",
                  [
                    {
                      name: "name",
                      map: "label",
                    },
                  ]
                );
                let dropDownTree = jqwidgets.createInstance(
                  "#pmPcId",
                  "jqxTree",
                  {
                    source: records,
                    width: 248,
                    height: 250,
                  }
                );
              },
            });
            dataAdapter.dataBind();
          },
        },
        {
          name: "minAirVolume",
          label: "最低风量",
          type: "custom",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          init: function (component) {
            that.minAirVolumeInstance = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true,
              }
            );
          },
        },
        {
          name: "maxAirVolume",
          label: "最高风量",
          type: "custom",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          init: function (component) {
            that.maxAirVolumeInstance = jqwidgets.createInstance(
              component,
              "jqxNumberInput",
              {
                width: 250,
                height: 30,
                inputMode: "simple",
                decimalDigits: 0,
                spinButtons: true,
              }
            );
          },
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
          infoPosition: "right",
        },
        {
          name: "unit",
          label: "计量单位",
          type: "custom",
          labelWidth: "80px",
          required: true,
          rowHeight: "40px",
          init: function (component) {
            that.unitInstance = jqwidgets.createInstance(
              component,
              "jqxDropDownList",
              {
                source: ["台"],
                width: 250,
                height: 30,
                selectedIndex: 0,
              }
            );
          },
        },
        {
          name: "remark",
          label: "备注",
          type: "text",
          labelWidth: "80px",
          width: "250px",
          required: false,
          rowHeight: "40px",
        },
        {
          name: "id",
          type: "custom",
          init: function (component) {
            component.append('<input id="pmId" type="hidden"/>');
          },
        },
        {
          columns: [
            {
              name: "submitButton",
              type: "custom",
              rowHeight: "40px",
              align: "right",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component[0], "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "提交",
                });
              },
            },
            {
              name: "cancelButton",
              type: "custom",
              rowHeight: "40px",
              columnWidth: "50%",
              init: function (component) {
                jqwidgets.createInstance(component[0], "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "取消",
                });
              },
            },
          ],
        },
      ],
    };
  },
  mounted() {
    const that = this;

    // 获取组件对象
    const $name = this.$refs.myForm.getComponentByName("name");
    const $categoryButton = document.getElementById("categoryButton");
    const $unit = this.$refs.myForm.getComponentByName("unit");
    const $power = this.$refs.myForm.getComponentByName("power");
    const $remark = this.$refs.myForm.getComponentByName("remark");
    const $id = this.$refs.myForm.getComponentByName("id");

    // 设备-类型
    let dropDownTree = jqwidgets.createInstance(
      document.getElementById("pmPcId"),
      "jqxTree"
    );
    dropDownTree.addEventHandler("select", (event) => {
      const selectedItem = dropDownTree.getSelectedItem();
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
      that.categoryDropDownButtonInstance.setContent(dropDownContent);
      that.categoryDropDownButtonInstance.close();
      // 设置id值到formValue
      const id = selectedItem.id;
    });

    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $name,
        message: "该项必填",
        action: "input,blur",
        rule: "required",
      },
      {
        input: $categoryButton,
        message: "该项必选",
        action: "close",
        rule: function (input) {
          return input[0].textContent != "";
        },
      },
      {
        input: $unit,
        message: "该项必选",
        action: "select",
        rule: function (input) {
          return input[0].textContent != "";
        },
      },
      {
        input: $power,
        message: "该项必填",
        action: "input,blur",
        rule: "required",
      },
    ];
    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName("submitButton");
    confirmBtn[0].addEventListener("click", (event) => {
      this.$refs.myValidator.validate(document.getElementById("myForm"));
    });
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      if (params[0] == EDIT_MACHINE_PRODUCT) {
        const data = params[1];
        const $name = this.$refs.myForm.getComponentByName("name");
        const $power = this.$refs.myForm.getComponentByName("power");
        const $remark = this.$refs.myForm.getComponentByName("remark");
        const $id = this.$refs.myForm.getComponentByName("id");
        // 设置ID
        $id[0].children[0].value = data.pm_id;
        // 设置产品名称
        $name[0].value = data.pm_name;
        // 设置类型
        let treeInstance = jqwidgets.createInstance("#pmPcId", "jqxTree");
        const items = treeInstance.getItems();
        for (let i = 0; i < items.length; i++) {
          if (items[i].id == data["pc_id"]) {
            const element = items[i].element;
            treeInstance.selectItem(element);
            treeInstance.expandItem(element);
            break;
          }
        }
        // 设置最低风量
        this.minAirVolumeInstance.val(data.min_air_volume);
        // 设置最高风量
        this.maxAirVolumeInstance.val(data.max_air_volume);
        // 设置设备功率
        $power[0].value = data.power;
        // 设置产品单位
        this.unitInstance.selectItem(data.unit);
        // 设置备注
        $remark[0].value = data.remark;
      }

      this.$refs.myWindow.open();
    },
    clearForm() {
      const $name = this.$refs.myForm.getComponentByName("name");
      const $power = this.$refs.myForm.getComponentByName("power");
      const $remark = this.$refs.myForm.getComponentByName("remark");
      const $id = this.$refs.myForm.getComponentByName("id");

      // 重置部件设置
      $name[0].value = "";
      this.categoryDropDownButtonInstance.setContent("");
      let dreopDownTreeInstance = jqwidgets.createInstance(
        "#pmPcId",
        "jqxTree"
      );
      dreopDownTreeInstance.selectItem(null);
      this.minAirVolumeInstance.val(0);
      this.maxAirVolumeInstance.val(0);
      $power[0].value = "";
      $remark[0].value = "";
      $id[0].children[0].value = "";
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title;
      const $name = this.$refs.myForm.getComponentByName("name");
      let treeInstance = jqwidgets.createInstance("#pmPcId", "jqxTree");
      const $power = this.$refs.myForm.getComponentByName("power");
      const $remark = this.$refs.myForm.getComponentByName("remark");
      const $id = this.$refs.myForm.getComponentByName("id");

      const selectedTreeItem = treeInstance.getSelectedItem();
      this.fromValue = {
        pm_name: $name[0].value,
        pc_id: selectedTreeItem.id,
        min_air_volume: this.minAirVolumeInstance.val(),
        max_air_volume: this.maxAirVolumeInstance.val(),
        power: $power[0].value,
        unit: this.unitInstance.val(),
        remark: $remark[0].value,
        pm_id: $id[0].children[0].value,
      };

      if (title == EDIT_MACHINE_PRODUCT) {
        this.update();
      } else {
        this.add();
      }
    },
    add() {
      const params = {
        jsonParams: JSON.stringify(this.formValue),
      };
      addMachineProduct(params).then((res) => {
        this.$refs.myWindow.close();
        // 提醒父组件刷新网格
        this.$parent.refresh();
        this.clearForm();
      });
    },
    update() {
      const params = {
        jsonParams: JSON.stringify(this.formValue),
      };
      updateMachineProduct(params).then((res) => {
        this.$refs.myWindow.close();
        // 提醒父组件刷新网格
        this.$parent.refresh();
        this.clearForm();
      });
    },
  },
};
</script>

<style scoped>
</style>