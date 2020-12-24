<template>
  <div>
    <JqxToolbar
      :width="'100%'"
      :height="35"
      :tools="tools"
      :initTools="initTools"
    >
    </JqxToolbar>
    <authority-tree
      ref="authorityTree"
      :show-checkbox="true"
      :role-authority="roleAuthority"
    ></authority-tree>
  </div>
</template>

<script>
import JqxToolbar from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtoolbar.vue'

import AuthorityTree from '@/components/content/authority/AuthorityTree'

import { findRoleAuthority,saveRoleAuthority } from '@/network/user'
export default {
  components: {
    JqxToolbar,
    AuthorityTree,
  },
  data: function () {
    return {
      tools: 'custom | custom | custom | custom | custom',
      roleAuthority: [],
    }
  },
  mounted() {
    this.$bus.$off('sendRole').$on('sendRole', (role) => {
      const roleId = role['role_id']
      this.roleId = roleId
      const params = {
        jsonParams: JSON.stringify({
          roleId,
        }),
      }
      findRoleAuthority(params).then((res) => {
        this.roleAuthority = res
      })
    })

    this.checkAllButtonInstance.addEventHandler('click', () => {
      this.$refs.authorityTree.checkAll()
    })

    this.uncheckAllButtonInstance.addEventHandler('click', () => {
      this.$refs.authorityTree.uncheckAll()
    })

    this.expandAllButtonInstance.addEventHandler('click', () => {
      this.$refs.authorityTree.expandAll()
    })

    this.collapseAllButtonInstance.addEventHandler('click', () => {
      this.$refs.authorityTree.collapseAll()
    })

    this.saveButtonInstance.addEventHandler('click', () => {
      if (!this.roleId) {
        this.$message.warning('未选择角色')
        return false
      }
      const items = this.$refs.authorityTree.getItems()
      const authoritys = items.map((item) => {
        return {
          permissionId: item['id'],
          available: item['checked'] == false ? 0 : 1,
          id: item['value'],
        }
      })
      const params = {
        jsonParams: JSON.stringify({
          roleId: this.roleId,
          items: authoritys,
        }),
      }
      saveRoleAuthority(params).then((res) => {})
    })
  },
  methods: {
    initTools: function (type, index, tool, menuToolIninitialization) {
      if (menuToolIninitialization == false) {
        switch (index) {
          case 0: {
            let buttonContainer = document.createElement('div')
            buttonContainer.innerHTML = '全选'
            buttonContainer.style.cssText =
              'float: left;margin-left: 5px;  cursor: pointer;'
            tool[0].appendChild(buttonContainer)
            this.checkAllButtonInstance = jqwidgets.createInstance(
              buttonContainer,
              'jqxButton',
              {}
            )
            break
          }
          case 1: {
            let buttonContainer = document.createElement('div')
            buttonContainer.innerHTML = '全不选'
            buttonContainer.style.cssText =
              'float: left;margin-left: 5px;  cursor: pointer;'
            tool[0].appendChild(buttonContainer)
            this.uncheckAllButtonInstance = jqwidgets.createInstance(
              buttonContainer,
              'jqxButton',
              {}
            )
            break
          }
          case 2: {
            let buttonContainer = document.createElement('div')
            buttonContainer.innerHTML = '全展开'
            buttonContainer.style.cssText =
              'float: left;margin-left: 5px;  cursor: pointer;'
            tool[0].appendChild(buttonContainer)
            this.expandAllButtonInstance = jqwidgets.createInstance(
              buttonContainer,
              'jqxButton',
              {}
            )
            break
          }
          case 3: {
            let buttonContainer = document.createElement('div')
            buttonContainer.innerHTML = '全收起'
            buttonContainer.style.cssText =
              'float: left;margin-left: 5px;  cursor: pointer;'
            tool[0].appendChild(buttonContainer)
            this.collapseAllButtonInstance = jqwidgets.createInstance(
              buttonContainer,
              'jqxButton',
              {}
            )
            break
          }
          case 4: {
            let buttonContainer = document.createElement('div')
            buttonContainer.style.cssText =
              'float: left;margin-left: 5px;  cursor: pointer;'
            tool[0].appendChild(buttonContainer)
            this.saveButtonInstance = jqwidgets.createInstance(
              buttonContainer,
              'jqxButton',
              {
                imgSrc: require('@/assets/iconfont/custom/save.svg'),
              }
            )
            break
          }
          default:
            break
        }
      }
    },
  },
}
</script>

<style scoped>
</style>