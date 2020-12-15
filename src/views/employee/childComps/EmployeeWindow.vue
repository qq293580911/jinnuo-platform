<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :height="'425px'"
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

import { getDepartment } from "@/network/department.js";
import { addEmployee, updateEmployee } from "@/network/employee.js";
import { EDIT_EMPLOYEE } from "@/common/const.js";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm
  },
  data() {
    const that = this;
    return {
      template: [
        {
          name: "empName",
          type: "text",
          label: "姓名",
          labelWidth: "25%",
          width: "250px",
          rowHeight: "40px",
          required: true,
          info: "输入员工姓名",
          infoPosition: "right"
        },
        {
          name: "gender",
          type: "custom",
          label: "性别",
          labelWidth: "25%",
          width: "250px",
          rowHeight: "40px",
          required: false,
          init: function(component) {
            var div = `<div id="male" style="float: left;margin-left:10px;"><span>男</span></div>
                                        <div id="female" style="float: left;margin-left:10px;"><span>女</span></div>`;
            component.append(div);
            that.maleInstance = jqwidgets.createInstance(
              "#male",
              "jqxRadioButton",
              {
                width: "40%",
                height: 30,
                checked: true
              }
            );
            that.femaleInstance = jqwidgets.createInstance(
              "#female",
              "jqxRadioButton",
              {
                width: "40%",
                height: 30
              }
            );
          }
        },
        {
          name: "phone",
          type: "text",
          label: "电话",
          labelWidth: "25%",
          width: "250px",
          rowHeight: "40px",
          required: true,
          info: "输入员工联系方式",
          infoPosition: "right"
        },
        {
          name: "idCard",
          type: "text",
          label: "身份证",
          labelWidth: "25%",
          width: "250px",
          rowHeight: "40px",
          required: true,
          info: "输入员工身份证",
          infoPosition: "right"
        },
        {
          name: "entryDate",
          type: "date",
          label: "入职日期",
          formatString: "yyyy-MM-dd",
          labelWidth: "25%",
          width: "250px",
          rowHeight: "40px",
          required: true
        },
        {
          name: "department",
          type: "custom",
          label: "部门",
          labelWidth: "25%",
          width: "250px",
          rowHeight: "40px",
          required: true,
          init: (component) => {
            // 按钮
            const dropDownButtonContainer = document.createElement("div");
            dropDownButtonContainer.id = "departmentButton";
            component[0].appendChild(dropDownButtonContainer);
            // 树
            const treeContainer = document.createElement("div");
            treeContainer.id = "deptId";
            treeContainer.style.cssText = "border: none;";
            dropDownButtonContainer.appendChild(treeContainer);
            that.departmentDropDownButtonInstance = jqwidgets.createInstance(
              "#departmentButton",
              "jqxDropDownButton",
              {
                width: 250,
                height: 30
              }
            );

            const source = {
              dataFields: [
                { name: "id", map: "deptId", type: "number" },
                { name: "parentId", type: "number" },
                { name: "text", map: "deptName", type: "string" }
              ],
              url: "/dept/getDepartmentSource.do",
              type: "get",
              datatype: "json"
            };

            that.dataAdapter = new jqx.dataAdapter(source, {
              loadServerData(serverdata, source, callback) {
                getDepartment(source.url, source, serverdata).then((res) => {
                  callback({
                    originaldata: res,
                    records: res.records
                  });
                });
              },
              loadComplete(records) {
                records = that.dataAdapter.getRecordsHierarchy(
                  "id",
                  "parentId",
                  "items",
                  [
                    {
                      name: "text",
                      map: "label"
                    }
                  ]
                );
                jqwidgets.createInstance(
                  "#deptId",
                  "jqxTree",
                  {
                    source: records,
                    width: 248,
                    height: 250
                  }
                );
              }
            });

            that.dataAdapter.dataBind();
          }
        },
        {
          name: "company",
          type: "custom",
          label: "公司",
          labelPosition: "left",
          labelWidth: "25%",
          align: "left",
          width: "250px",
          rowHeight: "40px",
          required: false,
          init: function(component) {
            that.companyInstance = jqwidgets.createInstance(
              component,
              "jqxDropDownList",
              {
                source: [],
                disabled: true,
                animationType: "fade",
                height: 30,
                width: 250
              }
            );
          }
        },
        {
          name: "agency",
          type: "custom",
          label: "分部",
          labelPosition: "left",
          labelWidth: "25%",
          align: "left",
          width: "250px",
          rowHeight: "40px",
          required: false,
          init: function(component) {
            that.agencyInstance = jqwidgets.createInstance(
              component,
              "jqxDropDownList",
              {
                source: [],
                disabled: true,
                animationType: "fade",
                height: 30,
                width: 250
              }
            );
          }
        },
        {
          columns: [
            {
              name: "submitButton",
              type: "button",
              text: "提交",
              width: "60px",
              rowHeight: "50px",
              columnWidth: "50%",
              align: "right"
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
        },
        {
          name: "id",
          type: "custom",
          init: function(component) {
            component.append('<input id="empId" type="hidden"/>');
          }
        }
      ]
    };
  },
  mounted() {
    const that = this;

    // 获取组件对象
    const $name = this.$refs.myForm.getComponentByName("empName");
    // const $gender = this.$refs.myForm.getComponentByName("gender");
    // const $phone = this.$refs.myForm.getComponentByName("phone");
    // const $idCard = this.$refs.myForm.getComponentByName("idCard");
    // const $entryDate = this.$refs.myForm.getComponentByName("entryDate");
    const $deptButton = document.getElementById("departmentButton");
    const $company = this.$refs.myForm.getComponentByName("company");
    const $agency = this.$refs.myForm.getComponentByName("agency");
    // const $id = this.$refs.myForm.getComponentByName("id");

    const dropDownTree = jqwidgets.createInstance(
      document.getElementById("deptId"),
      "jqxTree"
    );
    dropDownTree.addEventHandler("select", (event) => {
      const selectedItem = dropDownTree.getSelectedItem();
      // 设置文本内容到dorpDownButton
      const dropDownContent =
        '<div style="position: relative; margin-left: 3px; line-height: 30px;">' +
        selectedItem.label +
        "</div>";
      that.departmentDropDownButtonInstance.setContent(dropDownContent);
      const content = that.departmentDropDownButtonInstance.getContent();
      if (content[0]["textContent"] === "销售团队") {
        const deptId = event.args.element.id;
        const items = dropDownTree.getItems();
        const companySource = items
          .filter((item) => {
            return item["parentId"] == deptId;
          })
          .map((item) => {
            const map = {};
            map.id = item.id;
            map.label = item.label;
            return map;
          });

        that.companyInstance = jqwidgets.createInstance(
          $company,
          "jqxDropDownList",
          {
            source: companySource,
            displayMember: "label",
            valueMember: "id",
            disabled: false
          }
        );

        that.companyInstance.addEventHandler("select", (event) => {
          const id = event.args.item.value;
          const agencySource = items
            .filter((item) => {
              return item["parentId"] == id;
            })
            .map((item) => {
              const map = {};
              map.id = item.id;
              map.label = item.label;
              return map;
            });
          that.agencyInstance = jqwidgets.createInstance(
            $agency,
            "jqxDropDownList",
            {
              source: agencySource,
              displayMember: "label",
              valueMember: "id",
              disabled: false
            }
          );
        });
      } else {
        jqwidgets.createInstance($company, "jqxDropDownList", {
          source: [],
          disabled: true
        });
        jqwidgets.createInstance($agency, "jqxDropDownList", {
          source: [],
          disabled: true
        });
      }
      that.departmentDropDownButtonInstance.close();
    });

    // 验证规则
    that.$refs.myValidator.rules = [
      {
        input: $name,
        message: "该项必填",
        action: "input,blur",
        rule: "required"
      },
      {
        input: $name,
        message: "该项不能包含数字",
        action: "keyup",
        rule: "notNumber"
      },
      {
        input: $name,
        message: "员工姓名必须在2-4个字符之间",
        action: "keyup, blur",
        rule: "length=2,4"
      },
      {
        input: $deptButton,
        message: "该项必选",
        action: "close",
        rule: function(input) {
          return input[0].textContent != "";
        }
      },
      {
        input: $company,
        message: "该项必选",
        action: "select",
        rule: function() {
          const disabled = that.companyInstance.disabled;
          if (disabled == false) {
            const selectIndex = that.companyInstance.getSelectedIndex();
            return selectIndex > -1;
          }
          return true;
        }
      }
      // {
      //   input: $phone,
      //   message: "该项必填",
      //   action: "input,blur",
      //   rule: "required",
      // },
      // {
      //     input: $phone, message: '该项必填', action: 'keyup, blur', rule: 'required'
      // },
      // {
      //     input: $phone, message: '无效的电话号码格式',action:'valueChanged, blur',rule: 'phone'
      // },
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
      if (params[0] == EDIT_EMPLOYEE) {
        const data = params[1];
        const $name = this.$refs.myForm.getComponentByName("empName");
        // const $gender = this.$refs.myForm.getComponentByName("gender");
        const $phone = this.$refs.myForm.getComponentByName("phone");
        const $idCard = this.$refs.myForm.getComponentByName("idCard");
        const $entryDate = this.$refs.myForm.getComponentByName("entryDate");
        const treeInstance = jqwidgets.createInstance("#deptId", "jqxTree");
        // const $company = this.$refs.myForm.getComponentByName("company");
        // const $agency = this.$refs.myForm.getComponentByName("agency");
        const $id = this.$refs.myForm.getComponentByName("id");

        $name[0].value = data.emp_name;
        if (data.gender == "女") {
          that.femaleInstance.check();
        }
        $phone[0].value = data.phone;
        $idCard[0].value = data.id_card;
        $entryDate.val(new Date(data["entry_date"]));
        const items = treeInstance.getItems();
        for (let i = 0; i < items.length; i++) {
          if (items[i].id == data["dept_id"]) {
            const element = items[i].element;
            treeInstance.selectItem(element);
            treeInstance.expandItem(element);
            break;
          }
        }
        that.dataAdapter.records.forEach((item) => {
          if (item["text"] == data["company"]) {
            this.companyInstance.selectItem(item["id"]);
          }
          if (item["text"] == data["agency"]) {
            this.agencyInstance.selectItem(item["id"]);
          }
        });
        $id[0].children[0].value = data.emp_id;
      }

      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const that = this;
      const $name = this.$refs.myForm.getComponentByName("empName");
      // const $gender = this.$refs.myForm.getComponentByName("gender");
      const $phone = this.$refs.myForm.getComponentByName("phone");
      const $idCard = this.$refs.myForm.getComponentByName("idCard");
      const $entryDate = this.$refs.myForm.getComponentByName("entryDate");
      const treeInstance = jqwidgets.createInstance("#deptId", "jqxTree");
      const $id = this.$refs.myForm.getComponentByName("id");

      that.formValue = {};
      that.formValue.empName = $name[0].value;
      that.formValue.gender = that.maleInstance.checked == true ? "男" : "女";
      that.formValue.entryDate = $entryDate.val();
      that.formValue.phone = $phone[0].value;
      that.formValue.idCard = $idCard[0].value;
      const selectItem = treeInstance.getSelectedItem();
      if (selectItem) {
        that.formValue.deptId = treeInstance.getSelectedItem().id;
      }
      that.formValue.company = "";
      that.formValue.agency = "";
      if (that.companyInstance.disabled == false) {
        const selectedItem = that.companyInstance.getSelectedItem();
        if (selectedItem) {
          that.formValue.company = selectedItem.label;
        }
      }
      if (that.agencyInstance.disabled == false) {
        const selectedItem = that.agencyInstance.getSelectedItem();
        if (selectedItem) {
          that.formValue.agency = selectedItem.label;
        }
      }
      that.formValue.empId = $id[0].children[0].value;

      // 执行添加或修改请求
      const title = this.$refs.myWindow.title;
      if (title == EDIT_EMPLOYEE) {
        this.update();
      } else {
        this.add();
      }
    },
    add() {
      const params = {
        jsonParams: JSON.stringify(this.formValue)
      };
      addEmployee(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh();
      });
    },
    update() {
      const params = {
        jsonParams: JSON.stringify(this.formValue)
      };
      updateEmployee(params).then((res) => {
        this.$refs.myWindow.close()
        this.$parent.refresh();
      });
    }
  }
};
</script>

<style>
</style>
