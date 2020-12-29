<template>
  <div>
    <JqxValidator
      ref="myValidator"
      :hintType="'tooltip'"
      :rtl="true"
      @validationSuccess="onValidationSuccess($event)"
    >
      <JqxForm
        ref="myForm"
        :template="template"
        v-show="editable"
      > </JqxForm>
    </JqxValidator>
    <JqxTree
      style="margin-left: 5px; float: left; margin-top: 5px"
      ref="myTree"
      :width="300"
      :height="650"
      :source="records"
      @select="select($event)"
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
import JqxTree from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue'
import JqxValidator from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxvalidator.vue'
import JqxForm from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxform.vue'
import JqxButton from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxbuttons.vue'

import { Message } from '@/common/const.js'

import {
  getDepartment,
  addDepartment,
  deleteDepartment,
  updateDepartment,
} from '@/network/department.js'
export default {
  components: {
    JqxTree,
    JqxValidator,
    JqxForm,
    JqxButton,
  },
  beforeCreate() {
    this.source = {
      datafields: [
        { name: 'id', map: 'deptId', type: 'number' },
        { name: 'parentId', map: 'parentId', type: 'number' },
        { name: 'text', map: 'deptName', type: 'string' },
      ],
      datatype: 'json',
      id: 'id',
      type: 'get',
      url: '/dept/getDepartmentSource.do',
    }
    this.editable = false
  },
  created() {
    const that = this
    const dataAdapter = new jqx.dataAdapter(this.source, {
      loadServerData(serverdata, source, callback) {
        getDepartment(source.url, source, serverdata).then((res) => {
          callback({
            records: res.records,
          })
        })
      },
      loadComplete(records) {
        that.records = dataAdapter.getRecordsHierarchy(
          'id',
          'parentId',
          'items',
          [{ name: 'text', map: 'label' }]
        )
        that.$refs.myTree.source = that.records
      },
    })
    dataAdapter.dataBind()
  },
  data() {
    return {
      records: [],
      template: [
        {
          columns: [
            {
              name: 'newName',
              bind: 'newName',
              type: 'text',
              align: 'left',
              width: '230px',
              rowHeight: '40px',
            },
            {
              name: 'submitButton',
              type: 'button',
              text: '确认',
              width: '60px',
            },
          ],
        },
      ],
      buttonGroup: (() => {
        const arr = [
          '添加',
          '编辑',
          '删除',
          '展开全部',
          '收起全部',
          '查看员工',
        ].filter((item) => {
          switch (item) {
            case '添加':
              if (this.hasAuthority(this, 'prodCate:add')) {
                return item
              }
              break
            case '删除':
              if (this.hasAuthority(this, 'prodCate:delete')) {
                return item
              }
              break
            case '编辑':
              if (this.hasAuthority(this, 'prodCate:update')) {
                this.editable = true
                return item
              }
              break
            default:
              return item
              break
          }
        })
        return arr
      })(),
    }
  },
  mounted() {
    const $newName = this.$refs.myForm.getComponentByName('newName')
    this.newNameInstance = $newName
    // 设置表单验证规则
    this.$refs.myValidator.rules = [
      {
        input: $newName,
        message: '该项必填',
        action: 'input,blur',
        rule: 'required',
      },
    ]
    // 提交并验证表单
    const confirmBtn = this.$refs.myForm.getComponentByName('submitButton')
    confirmBtn[0].addEventListener('click', (event) => {
      this.$refs.myValidator.validate(document.getElementById('myForm'))
    })
  },
  methods: {
    select(event) {
      const originName = event.args.element.innerText
      this.newNameInstance.val(originName)
    },
    buttonClick(type) {
      const item = this.$refs.myTree.getSelectedItem()
      switch (type) {
        case '添加':
          if (item) {
            this.add(item.id)
          } else {
            this.add(null)
          }
          break
        case '编辑': {
          if (!item) {
            this.$message.warning(Message.NO_NODE_SELECTED)
            return false
          }
          break
        }
        case '删除':
          if (!item) {
            this.$message.warning(Message.NO_NODE_SELECTED)
            return false
          }
          if (item.hasItems) {
            this.$message.warning(Message.UNLABLE_DELETE_HAS_ITEMS)
            return false
          }
          this.delete(item.id)
          break
        case '展开全部':
          this.$refs.myTree.expandAll()
          break
        case '收起全部':
          this.$refs.myTree.collapseAll()
          break
        case '查看员工':
          this.$bus.$emit('queryEmployee', item['label'])
          break
      }
    },
    onValidationSuccess(event) {
      const $newName = this.$refs.myForm.getComponentByName('newName')
      const item = this.$refs.myTree.getSelectedItem()
      if (item['label'] == $newName.val()) {
        return
      }
      const formData = {
        deptName: this.newNameInstance.val(),
        deptId: item.id,
      }
      this.update(formData)
    },
    add(id) {
      const params = {
        pid: id,
        name: 'item',
      }
      addDepartment({ jsonParams: JSON.stringify(params) }).then((res) => {
        // 添加节点
        const item = this.$refs.myTree.getSelectedItem()
        this.$refs.myTree.addTo(
          {
            label: 'item',
            id: id,
          },
          item == null ? null : item.element,
          false
        )
        // 重新渲染树
        this.$refs.myTree.render()
      })
    },
    delete(deptId) {
      const params = {
        jsonParams: JSON.stringify({
          deptId,
        }),
      }
      deleteDepartment(params).then((res) => {
        const item = this.$refs.myTree.getSelectedItem()
        this.$refs.myTree.removeItem(item.element)
      })
    },
    update(formData) {
      const params = {
        jsonParams: JSON.stringify(formData),
      }
      updateDepartment(params).then((res) => {
        const item = this.$refs.myTree.getSelectedItem()
        this.$refs.myTree.updateItem(item.element, { label: formData.deptName })
        this.$refs.myTree.render()
      })
    },
  },
}
</script>

<style scoped>
</style>
