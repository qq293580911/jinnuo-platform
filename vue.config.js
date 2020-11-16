const path = require('path');
const webpack = require('webpack'); 
module.exports = {
  lintOnSave: true,
  configureWebpack:{
    resolve:{
      // extensions:[],
      alias:{
        'assets':'@/assets',
        'common':'@/common',
        'components':'@/components',
        'network':'@/network',
        'views':'@/views',
        'layexcel': path.resolve('static/excel.js')
      }
    },
    plugins:[
      new webpack.ProvidePlugin({
          layexcel : 'layexcel'
      })
    ]
  },
  chainWebpack: config => {
    config.module.rules.delete('eslint');
  },
  devServer: {
    proxy: {
      '/api': {
          target: 'http://localhost:8080/',
          // 允许跨域
          changeOrigin: true,
          ws: true,
          pathRewrite: {
              '^/api': ''
          }
      }
    }
  }
}