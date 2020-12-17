<template>
  <div>
    <JqxValidator
      ref="myValidator"
      :hintType="'label'"
      @validationSuccess="onValidationSuccess($event)"
    >
      <JqxForm ref="myForm" :template="template"> </JqxForm>
    </JqxValidator>
    <JqxTree
      style="margin-left: 5px; float: left; margin-top: 5px"
      ref="myTree"
      :width="300"
      :height="650"
      :source="records"
    ></JqxTree>
    <div style="margin-left: 60px; float: left">
      <div
        style="margin-top: 10px"
        v-for="(item, index) in buttonGroup"
        :key="index"
      >
        <JqxButton
          :textPosition="'center'"
          @click="buttonClick(item)"
          :width="100"
          :height="30"
        >
          {{ item }}
        </JqxButton>
      </div>
    </div>
  </div>
</template>

<script>
import JqxTree from "jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue";
import JqxValidator from "jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";
import JqxButton from "jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue";

import { Message } from "@/common/const.js";
import {
  getStandardCategory,
  addStandardCategory,
  deleteStandardCategory,
  updateStandardCategory
} from "@/network/product.js";
export default {
  name: "StandardCategory",
  components: {
    JqxTree,
    JqxValidator,
    JqxForm,
    JqxButton
  },
  beforeCreate() {
    this.source = {
      datatype: "json",
      datafields: [
        { name: "id", map: "id", type: "number" },
        { name: "parentid", map: "pid", type: "number" },
        { name: "text", map: "name", type: "string" },
        { name: "value", map: "id", type: "string" }
      ],
      id: "id",
      type: "json",
      url: "/productCateg/getStandardSortData.do"
    };
  },
  created() {
    const that = this;
    const dataAdapter = new jqx.dataAdapter(that.source, {
      loadServerData(serverdata, source, callback) {
        getStandardCategory(source.url, source, serverdata).then((res) => {
          callback({
            records: res.records
          });
        });
      },
      beforeLoadComplete(records) {
        that.records = dataAdapter.getRecordsHierarchy(
          "id",
          "parentid",
          "items",
          [{ name: "text", map: "label" }]
        );
        that.$refs.myTree.source = that.records;
      }
    });
    dataAdapter.dataBind();
  },
  data() {
    return {
      records: [],
      template: [
        {
          columns: [
            {
              name: "newName",
              bind: "newName",
              type: "text",
              align: "left",
              width: "230px",
              rowHeight: "40px"
            },
            {
              name: "submitBtn",
              bind: "submitBtn",
              type: "button",
              text: "确认",
              width: "60px"
            }
          ]
        }
      ],
      formValues: {},
      onValidationSuccess(event) {
        const item = this.$refs.myTree.getSelectedItem();
        if (item) {
          this.formValues.id = item.id;
          const $newName = this.$refs.myForm.getComponentByName("newName");
          this.formValues.name = $newName.val();
          this.updateCategory(this.formValues);
        } else {
          this.$message.warning(Message.NO_NODE_SELECTED);
        }
      },
      buttonGroup: ["添加", "编辑", "删除", "展开全部", "收起全部"]
    };
  },
  mounted() {
    const $newName = this.$refs.myForm.getComponentByName("newName");
    this.$refs.myForm.hideComponent("newName");
    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $newName,
        message: "该项必填",
        action: "blur,input",
        rule: "required"
      }
    ];
    // 验证表单
    const btn = this.$refs.myForm.getComponentByName("submitBtn");
    btn.on("click", () => {
      this.$refs.myValidator.validate(document.getElementById("myForm"));
    });
  },
  methods: {
    buttonClick(type) {
      const item = this.$refs.myTree.getSelectedItem();
      switch (type) {
        case "添加":
          if (item) {
            this.addCategory(item.id);
          } else {
            this.addCategory(null);
          }
          break;
        case "编辑":
        {
          if (!item) {
            this.$message.warning(Message.NO_NODE_SELECTED);
            return false;
          }
          const $newName = this.$refs.myForm.getComponentByName("newName");
          $newName.val(item.label);
          break;
        }
        case "删除":
          if (!item) {
            this.$message.warning(Message.NO_NODE_SELECTED);
            return false;
          }
          if (item.hasItems) {
            this.$message.warning(Message.UNLABLE_DELETE_HAS_ITEMS);
            return false;
          }
          this.deleteCategory(item.id);
          break;
        case "展开全部":
          this.$refs.myTree.expandAll();
          break;
        case "收起全部":
          this.$refs.myTree.collapseAll();
          break;
      }
    },
    addCategory(id) {
      const params = {
        pid: id,
        name: "item"
      };
      addStandardCategory({ jsonParams: JSON.stringify(params) }).then(
        (res) => {
          // 添加节点
          const item = this.$refs.myTree.getSelectedItem();
          this.$refs.myTree.addTo(
            {
              label: "item",
              id: id
            },
            item == null ? null : item.element,
            false
          );
          // 重新渲染树
          this.$refs.myTree.render();
        }
      );
    },
    deleteCategory(id) {
      const params = {
        id
      };
      deleteStandardCategory({ jsonParams: JSON.stringify(params) }).then(
        (res) => {
          const item = this.$refs.myTree.getSelectedItem();
          this.$refs.myTree.removeItem(item.element);
          this.$refs.myTree.render();
        }
      );
    },
    updateCategory(params) {
      updateStandardCategory({ jsonParams: JSON.stringify(params) }).then(
        (res) => {
          const item = this.$refs.myTree.getSelectedItem();
          this.$refs.myTree.updateItem(item.element, { label: params.name });
          this.$refs.myTree.render();
        }
      );
    }
  }
};
</script>

<style scoped>
</style>
