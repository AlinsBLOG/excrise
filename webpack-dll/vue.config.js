const CompressionWebpackPlugin = require('compression-webpack-plugin')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
const path = require('path')
const productionGzipExtensions = ['js', 'css', 'jpg', 'png']

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  lintOnSave: false,
  productionSourceMap: false,
  outputDir: 'dist/terminal',
  chainWebpack: config => {
    config.resolve.alias.set('@', path.join(__dirname, 'src'))
    // 是否开启模块打包分析
    config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  configureWebpack: config => {
    // 压缩代码
    config.plugins.push(new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
      threshold: 10240,
      minRatio: 0.8
    }))

    // 第三，告诉 Webpack 使用了哪些动态链接库
    config.plugins.push(
      new DllReferencePlugin({
        manifest: require(path.join(__dirname, 'dll' ,'vue.manifest.json')),
    }))
  },
  // 开发环境代理
  devServer: {
    overlay: {
      warnings: false,
      errors: false,
    },
    proxy: {
      '/terminal': {
        target: 'http://parkingcloud.test.dyajb.com',
        changeOrigin: true,
        pathRewrite: {
          '^/terminal' : ''
        }
      }
    }
  }
}
