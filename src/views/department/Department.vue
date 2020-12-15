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
  getDepartment,
  addDepartment
  // deleteDepartment,
  // updateDepartment
} from "@/network/department.js";
export default {
  components: {
    JqxTree,
    JqxValidator,
    JqxForm,
    JqxButton
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: "id", map: "deptId", type: "number" },
        { name: "parentId", map: 'parentId', type: "number" },
        { name: "text", map: "deptName", type: "string" }
      ],
      datatype: "json",
      id: "id",
      type: "get",
      url: "/dept/getDepartmentSource.do"
    };
  },
  created() {
    const that = this;
    const dataAdapter = new jqx.dataAdapter(this.source, {
      loadServerData(serverdata, source, callback) {
        getDepartment(source.url, source, serverdata).then((res) => {
          callback({
            records: res.records
          });
        });
      },
      loadComplete(records) {
        that.records = dataAdapter.getRecordsHierarchy(
          "id",
          "parentId",
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
      buttonGroup: ["添加", "编辑", "删除", "展开全部", "收起全部"]
    };
  },
  methods: {
    buttonClick(type) {
      const item = this.$refs.myTree.getSelectedItem();
      switch (type) {
        case "添加":
          if (item) {
            this.addDepartment(item.id);
          } else {
            this.addDepartment(null);
          }
          break;
        case "编辑": {
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
    onValidationSuccess(event) {},
    addDepartment(id) {
      const params = {
        pid: id,
        name: "item"
      };
      addDepartment({ jsonParams: JSON.stringify(params) }).then((res) => {
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
        this.$message.success(Message.INSERT_SUCCESS);
      });
    }
  }
};
</script>

<style scoped>
</style>
