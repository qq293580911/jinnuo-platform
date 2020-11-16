<template>
  <div>
    <JqxWindow
      ref="myWindow"
      :width="'400px'"
      :height="'160px'"
      :autoOpen="false"
      :position="{ x: '40%', y: '30%' }"
    >
      <div>
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
    };
  },
  methods: {
    open(...params) {
      this.$refs.myWindow.setTitle(params[0]);
      this.$refs.myWindow.open();
    },
    onValidationSuccess(event) {
      this.$bus.$emit('openDetailWindow',111)
      this.$refs.myWindow.close()
    },
  },
  mounted() {
    const that = this
    const $browseButton1 = this.$refs.myForm.getComponentByName("reserveBrowseButton");
    const $browseButton2 = this.$refs.myForm.getComponentByName("quoteBrowseButton");
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
      }
    ];
    // 验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName("submitButton");
    confirmBtn[0].addEventListener('click',(event)=>{
      this.$refs.myValidator.validate(document.getElementById("myForm"));
    })
  },
};
</script>

<style scoped>
.jqx-scrollbar {
  width: 16px;
}
</style>