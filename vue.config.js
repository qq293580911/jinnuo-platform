// const webpack = require('webpack');
module.exports = {
  // 基本路径
  publicPath: './',
  lintOnSave: true,
  outputDir: 'dist', // build打包输出目录
  assetsDir: 'static', // 静态文件输出目录，基于dist
  filenameHashing:true,
  indexPath: 'index.html', // 输出html文件名
  productionSourceMap: false, // 取消.map文件的打包，加快打包速度
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        // 允许跨域
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV == 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true //生产环境去掉console.log
    }
    return {
      resolve: {
        // extensions:[],
        alias: {
          assets: '@/assets',
          common: '@/common',
          components: '@/components',
          network: '@/network',
          views: '@/views',
        },
      },
    }
  },
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');
  },
  css: {
    requireModuleExtension: true, // 启用 CSS modules
    extract: true, // 是否使用css分离插件
    sourceMap: false, // 开启 CSS source maps?
    loaderOptions: {}, // css预设器配置项
  },
}
