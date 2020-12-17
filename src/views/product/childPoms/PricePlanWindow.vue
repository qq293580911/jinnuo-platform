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

import { UPDATE_PRICE_PLAN } from "@/common/const";
import { addPricePlan, updatePricePlan } from "@/network/product";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm
  },
  data() {
    return {
      template: [
        {
          name: "rule",
          type: "text",
          label: "方案规则",
          labelWidth: "80px",
          width: "250px",
          required: true,
          rowHeight: "40px"
        },
        {
          name: "obsolete",
          type: "dropdownlist",
          label: "过时状态",
          labelWidth: "80px",
          width: "250px",
          required: false,
          options: [{ value: "新" }, { value: "旧" }]
        },
        {
          name: "remark",
          type: "text",
          label: "备注",
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
      ],
      id: null
    };
  },
  mounted() {
    const $rule = this.$refs.myForm.getComponentByName("rule");
    const $obsolete = this.$refs.myForm.getComponentByName("obsolete");
    const $remark = this.$refs.myForm.getComponentByName("remark");

    this.ruleInstance = $rule;
    this.obsoleteInstance = $obsolete;
    this.remarkInstance = $remark;

    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $rule,
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
      this.$refs.myWindow.setTitle(params[0]);
      if (params[0] == UPDATE_PRICE_PLAN) {
        const data = params[1]
        this.id = data['id']
        this.ruleInstance.val(data['rule'])
        this.obsoleteInstance.jqxDropDownList('selectItem', data['obsolete'])
        this.remarkInstance.val(data['remark'])
      }
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const title = this.$refs.myWindow.title;
      const formData = {
        schemeRule: this.ruleInstance.val(),
        obsolete: this.obsoleteInstance.val(),
        remark: this.remarkInstance.val(),
        schemeId: this.id
      };

      if (title == UPDATE_PRICE_PLAN) {
        this.update(formData);
      } else {
        this.add(formData);
      }
    },
    add(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      addPricePlan(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData)
      };
      updatePricePlan(params).then((res) => {
        this.$refs.myWindow.close();
        this.$parent.refresh();
      });
    }
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  }
};
</script>

<style>
</style>
