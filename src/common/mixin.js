export const contentHeight = {
  computed: {
    contentStyle() {
      const style = {}
      switch (jqx.theme) {
        case 'ui-darkness':
          style.height = 'calc(100vh - 133px)'
          break
        case 'ui-le-frog':
          style.height = 'calc(100vh - 135px)'
          break
        case 'ui-lightness':
          style.height = 'calc(100vh - 132px)'
          break
        case 'ui-overcast':
          style.height = 'calc(100vh - 135px)'
          break
        case 'ui-redmond':
          style.height = 'calc(100vh - 134px)'
          break
        case 'ui-smoothness':
          style.height = 'calc(100vh - 135px)'
          break
        case 'ui-start':
          style.height = 'calc(100vh - 134px)'
          break
        case 'ui-sunny':
          style.height = 'calc(100vh - 134px)'
          break
        default:
          style.height = 'calc(100vh - 130px)'
          break
      }
      return style
    },
  },
}
