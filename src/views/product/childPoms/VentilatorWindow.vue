<template>
  <div>
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
  </div>
</template>

<script>
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxValidator from "jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";

import {
  Message,
  ADD_PRODUCT,
  EDIT_PRODUCT,
  CONFIRM_DELETE,
} from "@/common/const.js";

import { addVentilator, updateVentilator } from "@/network/product.js";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
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
          type: "dropdownlist",
          label: "产品名称",
          labelWidth: "110px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          options: ["管道式换气扇", "百叶窗式换气扇"],
        },
        {
          name: "category",
          label: "产品分类",
          labelWidth: "110px",
          type: "custom",
          required: true,
          rowHeight: "40px",
          init: function (component) {
            // 下拉按钮
            let dropDownButtonContainer = document.createElement("div");
            dropDownButtonContainer.id = that.dropDownButtonID;
            component[0].appendChild(dropDownButtonContainer);
            // 下拉树
            let treeContainer = document.createElement("div");
            treeContainer.id = that.treeID;
            treeContainer.style.cssText = "border: none;";
            dropDownButtonContainer.appendChild(treeContainer);

            that.dropDownButtonInstance = jqwidgets.createInstance(
              `#${that.dropDownButtonID}`,
              "jqxDropDownButton",
              {
                width: 250,
                height: 30,
              }
            );

            const source = {
              datatype: "json",
              datafields: [
                { name: "id" },
                { name: "parentid" },
                { name: "text" },
                { name: "value" },
              ],
              id: "id",
              localdata: that.$store.state.productType,
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
              `#${that.treeID}`,
              "jqxTree",
              {
                source: records,
                width: 250,
                height: 300,
              }
            );

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
          },
        },
        {
          name: "specification",
          type: "text",
          label: "规格",
          labelWidth: "110px",
          width: "250px",
          required: true,
          rowHeight: "40px",
        },
        {
          name: "holeSize",
          type: "text",
          label: "开孔尺寸",
          labelWidth: "110px",
          width: "250px",
          required: true,
          rowHeight: "40px",
        },
        {
          name: "airVolume",
          type: "text",
          label: "风量",
          labelWidth: "110px",
          width: "250px",
          rowHeight: "40px",
          init(component) {
            component.jqxNumberInput({
              width: 250,
              height: 30,
              inputMode: "simple",
              decimalDigits: 0,
              spinButtons: true,
            });
          },
        },
        {
          name: "panelMaterial",
          type: "dropdownlist",
          label: "面板材质",
          labelWidth: "110px",
          width: "250px",
          required: true,
          rowHeight: "40px",
          options: ["普通", "pp面板", "abs面板"],
        },
        {
          name: "remark",
          type: "text",
          label: "备注",
          labelWidth: "110px",
          width: "250px",
          required: false,
          rowHeight: "40px",
        },
        {
          columns: [
            {
              name: "submitButton",
              type: "button",
              text: "提交",
              width: "60px",
              height: "30px",
              rowHeight: "50px",
              align: "right",
              columnWidth: "50%",
            },
            {
              name: "cancelButton",
              type: "button",
              text: "取消",
              width: "60px",
              height: "30px",
              rowHeight: "50px",
              columnWidth: "50%",
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
    const $category = this.$refs.myForm.getComponentByName("category");
    const $specification = this.$refs.myForm.getComponentByName(
      "specification"
    );
    const $holeSize = this.$refs.myForm.getComponentByName("holeSize");
    const $airVolume = this.$refs.myForm.getComponentByName("airVolume");
    const $panelMaterial = this.$refs.myForm.getComponentByName(
      "panelMaterial"
    );
    const $remark = this.$refs.myForm.getComponentByName("remark");

    this.nameInstance = $name;
    this.specificationInstance = $specification;
    this.holeSizeInstance = $holeSize;
    this.airVolumeInstance = $airVolume;
    this.panelMaterialInstance = $panelMaterial;
    this.remarkInstance = $remark;
    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $name,
        message: "该项必选",
        action: "selecte",
        rule: function (input) {
          const selectedIndex = $name.jqxDropDownList("getSelectedIndex");
          return selectedIndex > -1;
        },
      },
      {
        input: $category,
        message: "该项必选",
        action: "close",
        rule: function (input) {
          return input[0].textContent != "";
        },
      },
      {
        input: $specification,
        message: "该项必填",
        action: "input,blur",
        rule: "required",
      },
      {
        input: $holeSize,
        message: "该项必填",
        action: "input,blur",
        rule: "required",
      },
      {
        input: $panelMaterial,
        message: "该项必选",
        action: "selecte",
        rule: function (input) {
          const selectedIndex = $panelMaterial.jqxDropDownList(
            "getSelectedIndex"
          );
          return selectedIndex > -1;
        },
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
      const that = this;
      this.$refs.myWindow.setTitle(params[0]);
      this.clearForm();
      if (params[0] == EDIT_PRODUCT) {
        const data = params[1];
        this.id = data["id"];
        this.nameInstance.val(data["name"]);
        const items = this.treeInstance.getItems();
        const item = items.find((item) => {
          return item["id"] == data["pc_id"];
        });
        this.treeInstance.selectItem(item.element);
        this.treeInstance.expandItem(item.element);
        this.specificationInstance.val(data['specification'])
        this.holeSizeInstance.val(data['hole_size'])
        this.airVolumeInstance.jqxNumberInput('setDecimal',data['air_volume'])
        this.panelMaterialInstance.jqxDropDownList('selectItem',data['panel_material'])
        this.remarkInstance.val(data['remark'])
      }
      this.$refs.myWindow.open();
    },
    clearForm() {
      // 重置部件设置
      // this.machineNameInsatnce.val("");
      // this.machineModelInsatnce.val("");
      // this.dropDownButtonInstance.setContent("");
      // this.treeInstance.selectItem(null);
      // this.minAirVolumeInstance.setDecimal(0);
      // this.maxAirVolumeInstance.setDecimal(0);
      // this.powerInstance.val("");
      // this.remarkInstance.val("");
    },
    onValidationSuccess(event) {
      const formData = {};
      formData["ventName"] = this.nameInstance.val();
      formData["pcId"] = this.treeInstance.getSelectedItem().id;
      formData["specification"] = this.specificationInstance.val();
      formData["holeSize"] = this.holeSizeInstance.val();
      formData["airVolume"] = this.airVolumeInstance.val();
      formData["panelMaterial"] = this.panelMaterialInstance.val();
      formData["remark"] = this.remarkInstance.val();
      formData["ventId"] = this.id;
      const title = this.$refs.myWindow.title;
      if (title == EDIT_PRODUCT) {
        this.update(formData);
      } else {
        this.add(formData);
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      };
      addVentilator(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      };
      updateVentilator(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close();
  },
};
</script>

<style>
</style>