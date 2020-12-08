<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :height="'165px'"
      :autoOpen="false"
      :position="{ x: '40%', y: '30%' }"
    >
      <div style="overflow: hidden">
        <JqxValidator
          ref="myValidator"
          @validationSuccess="onValidationSuccess($event)"
        >
          <JqxForm
            ref="myForm"
            :template="template"
            :padding="{ left: 10, top: 10, right: 10, bottom: 10 }"
          >
          </JqxForm>
        </JqxValidator>
      </div>
    </JqxWindow>
  </div>
</template>

<script>
import Vue from "vue";
import JqxWindow from "jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue";
import JqxValidator from "jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue";
import JqxForm from "jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue";
import Uploader from "components/common/CustomUploader";
export default {
  components: {
    JqxWindow,
    JqxValidator,
    JqxForm,
    Uploader,
  },
  data() {
    const that = this;
    return {
      template: [
        {
          columns: [
            {
              name: "底价",
              type: "custom",
              label: "底价",
              required: true,
              rowHeight: 50,
              labelWidth: "50px",
              columnWidth: "80%",
              init: function (component) {
                let UploaderComponent = Vue.extend(Uploader);
                let uploadInstance = new UploaderComponent({
                  propsData: {
                    width: 250,
                    height: 30,
                    type: "jqxInput",
                    fieldsCofig: {},
                    showUploadButton: false,
                  },
                }).$mount(component[0]);
                that.$refs.reserveUploader = uploadInstance;
              },
            },
            {
              name: "reserveBrowseButton",
              type: "custom",
              labelWidth: "50px",
              columnWidth: "20%",
              init: function (component) {
                let button = jqwidgets.createInstance(component, "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "浏览..",
                });
                button.addEventHandler("click", (event) => {
                  that.$refs.reserveUploader.open();
                });
              },
            },
          ],
        },
        {
          columns: [
            {
              name: "报价",
              type: "custom",
              label: "报价",
              rowHeight: 50,
              required: true,
              labelWidth: "50px",
              columnWidth: "80%",
              init: function (component) {
                let UploaderComponent = Vue.extend(Uploader);
                let uploadInstance = new UploaderComponent({
                  propsData: {
                    width: 250,
                    height: 30,
                    type: "jqxInput",
                    showUploadButton: false,
                  },
                }).$mount(component[0]);
                that.$refs.quoteUploader = uploadInstance;
              },
            },
            {
              name: "quoteBrowseButton",
              type: "custom",
              labelWidth: "50px",
              columnWidth: "20%",
              init: function (component) {
                let button = jqwidgets.createInstance(component, "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "浏览..",
                });
                button.addEventHandler("click", (event) => {
                  that.$refs.quoteUploader.open();
                });
              },
            },
          ],
        },
        {
          columns: [
            {
              name: "submitButton",
              type: "custom",
              rowHeight: "40px",
              columnWidth: "50%",
              align: "right",
              init: function (component) {
                jqwidgets.createInstance(component, "jqxButton", {
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
                jqwidgets.createInstance(component, "jqxButton", {
                  width: 60,
                  height: 30,
                  value: "取消",
                });
              },
            },
          ],
        },
      ],
      detailFormData: {},
    };
  },
  mounted() {
    const that = this;
    const $browseButton1 = this.$refs.myForm.getComponentByName(
      "reserveBrowseButton"
    );
    const $browseButton2 = this.$refs.myForm.getComponentByName(
      "quoteBrowseButton"
    );
    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $browseButton1,
        message: "文件不能为空！",
        action: "blur",
        rule: function () {
          return that.$refs.reserveUploader.inputValue != "";
        },
      },
      {
        input: $browseButton2,
        message: "文件不能为空！",
        action: "blur",
        rule: function () {
          return that.$refs.quoteUploader.inputValue != "";
        },
      },
    ];
    // 验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName("submitButton");
    confirmBtn[0].addEventListener("click", (event) => {
      this.$refs.myValidator.validate(document.getElementById("myForm"));
    });

    // 底价
    this.$refs.reserveUploader.$on("changed", (data) => {
      let sheetName = Object.keys(data[0])[0];
      const reserveFileContent = data[0][sheetName];
      for (let row of reserveFileContent) {
        for (let key in row) {
          const cellData = row[key]
            .toString()
            .replace(/\s+/g, "")
            .replace(":", "：");
          // 项目名称
          const projectName = cellData.match(/(?<=(项目名称：)).*/);
          if (projectName) {
            that.detailFormData["projectName"] = projectName[0];
          }
          // 项目地址
          const projectAddress = cellData.match(/(?<=(项目地址：)).*/);
          if (projectAddress) {
            that.detailFormData["projectAddress"] = projectAddress[0];
          }
          // 客户公司名称
          const customerCompany = cellData.match(
            /(?<=(客户公司名称：|客户公司：)).*/
          );
          if (customerCompany) {
            that.detailFormData["customerCompany"] = customerCompany[0];
          }
          // 客户名称
          const customerName = cellData.match(
            /(?<=(客户姓名|客户名称)：).*?(?=(客户电话|客户联系电话|客户联系方式))/
          );
          if (customerName) {
            that.detailFormData["customer"] = customerName[0];
          }
          // 客户电话
          const customerPhone = cellData.match(
            /(?<=(客户联系电话：|客户电话：)).*(\d+)/
          );
          if (customerPhone) {
            that.detailFormData["customerPhone"] = customerPhone[0];
          }
          // 业务员
          let salesman = cellData.match(
            /(?<=(报价人：|业务员：)).*?(?=(联系))/
          );
          if (salesman) {
            salesman = salesman[0];
            const salesmans = that.$store.state.salesmans;
            let emp = salesmans.find((salesm) => {
              return salesm["emp_name"] == salesman;
            });
            if (emp) {
              that.detailFormData["salesman"] = emp["emp_id"];
            }
          }
          // 报价日期
          let quoteDate = cellData.match(/(?<=日期：).*/);
          if (quoteDate) {
            quoteDate = quoteDate[0];
            that.detailFormData["quoteDate"] = new Date(quoteDate);
          }
          // 底价
          if (/([合,总,共]计)+([(,（]?合同价?[)）]?)?/.test(cellData)) {
            that.detailFormData["reservePrice"] = row["G"];
            if (/合同价/.test(cellData)) {
              that.detailFormData["isRepeat"] = "重复";
            }
          }
          // 控制箱底价
          if (/(风机)?控制[箱,柜]?合计/.test(cellData)) {
            that.detailFormData["controlBoxReservePrice"] = row["G"];
          }
        }
      }
    });

    // 报价
    this.$refs.quoteUploader.$on("changed", (data) => {
      let sheetName = Object.keys(data[0])[0];
      const quoteFileContent = data[0][sheetName];
      for (let row of quoteFileContent) {
        for (let key in row) {
          const cellData = row[key];
          if (/([合,总,共]计)+([(,（]?合同价?[)）]?)?/.test(cellData)) {
            that.detailFormData["quotePrice"] = row["G"];
          }
          if (/(风机)?控制[箱,柜]?合计/.test(cellData)) {
            that.detailFormData["controlBoxQuotePrice"] = row["G"];
          }
        }
      }
    });
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      const reservePriceFile = this.$refs.reserveUploader.file;
      const quotePriceFile = this.$refs.quoteUploader.file;
      this.$bus.$emit(
        "openDetailWindow",
        this.detailFormData,
        reservePriceFile,
        quotePriceFile
      );
      this.$refs.myWindow.close();
    },
  },
  beforeDestroy() {
    this.$refs.myWindow.close()
  },
};
</script>

<style scoped>
.jqx-scrollbar {
  width: 16px;
}
</style>