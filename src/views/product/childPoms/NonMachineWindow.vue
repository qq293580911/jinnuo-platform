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

import { Message, EDIT_PRODUCT } from "@/common/const";
import {
  addNonMachineProduct,
  updateNonMachineProduct
} from "@/network/product.js";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm
  },
  beforeCreate() {
    this.dropDownButtonID = JQXLite.generateID();
    this.treeID = JQXLite.generateID();
  },
  data() {
    const that = this;
    return {
      template: [
        {
          name: "name",
          type: "text",
          label: "产品名称",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px"
        },
        {
          name: "category",
          label: "产品类型",
          labelWidth: "80px",
          type: "custom",
          required: true,
          rowHeight: "40px",
          init: function(component) {
            // 按钮
            const dropDownButtonContainer = document.createElement("div");
            dropDownButtonContainer.id = that.dropDownButtonID;
            component[0].appendChild(dropDownButtonContainer);
            // 树
            const treeContainer = document.createElement("div");
            that.treeID = JQXLite.generateID();
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
              localdata: that.$store.state.productType
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
          name: "limitSize",
          label: "界定尺寸",
          type: "custom",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          init: function(component) {
            component.append(
              '<div style="display:inline-block;vertical-align: middle;" id="limitSizeLong"></div>'
            );
            component.append(
              '<span style="margin-left:2px;margin-right:2px;display:inline-block;vertical-align: middle;">*</span>'
            );
            component.append(
              '<div style="display:inline-block;vertical-align: middle;" id="limitSizeShort"></div>'
            );
            jqwidgets.createInstance("#limitSizeLong", "jqxNumberInput", {
              width: 120,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true
            });
            jqwidgets.createInstance("#limitSizeShort", "jqxNumberInput", {
              width: 120,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true
            });
          }
        },
        {
          name: "minSizeRound",
          type: "custom",
          label: "最小尺寸",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          info: "圆形的最小尺寸",
          infoPosition: "right",
          init: function(component) {
            jqwidgets.createInstance(component, "jqxNumberInput", {
              width: 250,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true
            });
          }
        },
        {
          name: "maxSizeRound",
          type: "custom",
          label: "最大尺寸",
          labelWidth: "80px",
          required: false,
          rowHeight: "40px",
          info: "圆形的最大尺寸",
          infoPosition: "right",
          init: function(component) {
            jqwidgets.createInstance(component, "jqxNumberInput", {
              width: 250,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true
            });
          }
        },
        {
          name: "formula",
          type: "custom",
          label: "计算公式",
          labelWidth: "80px",
          required: true,
          rowHeight: "40px",
          init: function(component) {
            const formulas = that.$store.state.formula;
            jqwidgets.createInstance(component, "jqxComboBox", {
              width: 250,
              height: 30,
              source: formulas
            });
          }
        },
        {
          name: "unit",
          label: "计量单位",
          type: "dropdownlist",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          options: [{ label: "个" }]
        },
        {
          name: "isCCC",
          type: "dropdownlist",
          label: "强制认证",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          options: [
            { label: "是", value: 1 },
            { label: "否", value: 0 }
          ]
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
    const $name = this.$refs.myForm.getComponentByName("name");
    const $category = this.$refs.myForm.getComponentByName("category");
    const $limitSizeLong = $("#limitSizeLong");
    const $limitSizeShort = $("#limitSizeShort");
    const $minSizeRound = this.$refs.myForm.getComponentByName("minSizeRound");
    const $maxSizeRound = this.$refs.myForm.getComponentByName("maxSizeRound");
    const $formula = this.$refs.myForm.getComponentByName("formula");
    const $unit = this.$refs.myForm.getComponentByName("unit");
    const $isCCC = this.$refs.myForm.getComponentByName("isCCC");
    const $remark = this.$refs.myForm.getComponentByName("remark");

    this.nameInstance = $name;
    this.categoryInstance = $category;
    this.limitSizeLongInstance = $limitSizeLong;
    this.limitSizeShortInstance = $limitSizeShort;
    this.minSizeRoundInstance = $minSizeRound;
    this.maxSizeRoundInstance = $maxSizeRound;
    this.formulaInstance = $formula;
    this.unitInstance = $unit;
    this.isCCCInstance = $isCCC;
    this.remarkInstance = $remark;

    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $name,
        message: "该项必填",
        action: "keyup,blur",
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
        input: $limitSizeLong,
        message: "必须左长右短",
        action: "valueChanged",
        rule: function() {
          const limitSizeLong = $limitSizeLong.val();
          const limitSizeShort = $limitSizeShort.val();
          return limitSizeLong >= limitSizeShort;
        }
      },
      {
        input: $limitSizeShort,
        message: "必须左长右短",
        action: "valueChanged",
        rule: function() {
          const limitSizeLong = $limitSizeLong.val();
          const limitSizeShort = $limitSizeShort.val();
          return limitSizeLong >= limitSizeShort;
        }
      },
      {
        input: $formula,
        message: "该项必选",
        action: "select",
        rule: function() {
          const index = $formula.jqxComboBox("getSelectedIndex");
          return index > -1;
        }
      },
      {
        input: $unit,
        message: "该项必选",
        action: "select",
        rule: function() {
          const index = $unit.jqxDropDownList("getSelectedIndex");
          return index > -1;
        }
      },
      {
        input: $isCCC,
        message: "该项必选",
        action: "select",
        rule: function() {
          const index = $isCCC.jqxDropDownList("getSelectedIndex");
          return index > -1;
        }
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
      this.$refs.myWindow.setTitle(params[0]);
      this.clearForm();
      if (params[0] == EDIT_PRODUCT) {
        const data = params[1];
        this.nameInstance.val(data["pnm_name"]);
        const items = this.treeInstance.getItems();
        const item = items.find(item => {
          return item['id'] == data["pc_id"]
        })
        this.treeInstance.selectItem(item.element);
        this.treeInstance.expandItem(item.element);
        this.limitSizeLongInstance.jqxNumberInput('setDecimal', data['limit_size_long'])
        this.limitSizeShortInstance.jqxNumberInput('setDecimal', data['limit_size_short'])
        this.minSizeRoundInstance.jqxNumberInput('setDecimal', data['round_min_size'])
        this.maxSizeRoundInstance.jqxNumberInput('setDecimal', data['round_max_size'])
        this.formulaInstance.jqxComboBox('selectItem', data['formula'])
        this.unitInstance.jqxDropDownList('selectItem', data['unit'])
        this.isCCCInstance.jqxDropDownList('selectItem', data['is_ccc'] == '是' ? 1 : 0)
        this.remarkInstance.val(data['remark'])
        this.id = data['pnm_id']
      }
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title;
      const formData = {};
      formData["pnm_name"] = this.nameInstance.val();
      formData["pc_id"] = this.treeInstance.getSelectedItem().id;
      formData["limit_size_long"] = this.limitSizeLongInstance.val();
      formData["limit_size_short"] = this.limitSizeShortInstance.val();
      formData["round_min_size"] = this.minSizeRoundInstance.val();
      formData["round_max_size"] = this.maxSizeRoundInstance.val();
      formData["unit"] = this.unitInstance.val();
      formData["formula"] = this.formulaInstance.val();
      formData["is_ccc"] = this.isCCCInstance.val();
      formData["remark"] = this.remarkInstance.val();
      formData["pnm_id"] = this.id;
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
      addNonMachineProduct(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      updateNonMachineProduct(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
    clearForm() {
      this.nameInstance.val("");
      this.dropDownButtonInstance.setContent("");
      this.treeInstance.selectItem(null);
      this.limitSizeLongInstance.jqxNumberInput("setDecimal", 0);
      this.limitSizeShortInstance.jqxNumberInput("setDecimal", 0);
      this.minSizeRoundInstance.jqxNumberInput("setDecimal", 0);
      this.maxSizeRoundInstance.jqxNumberInput("setDecimal", 0);
      this.formulaInstance.jqxComboBox("clearSelection");
      this.unitInstance.jqxDropDownList("clearSelection");
      this.isCCCInstance.jqxDropDownList("clearSelection");
      this.remarkInstance.val("");
    }
  },
  beforeDestroy() {
    this.$refs.myWindow.close();
  }
};
</script>

<style scoped>
</style>
